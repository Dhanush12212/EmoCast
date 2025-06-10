import dotenv from "dotenv"
dotenv.config({
    path:'./.env'
})

import ApiError from "../utils/ApiError.utils.js" 
import asyncHandler from "../utils/asyncHandler.utils.js";
import axios from 'axios';
import xml2js from 'xml2js';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = process.env.YOUTUBE_API_URL;
const CHANNELS_API_URL = process.env.CHANNELS_API_URL; 
const RECOMMENDED_API_URL = process.env.RECOMMENDED_API_URL; 
const SEARCH_API_URL = process.env.SEARCH_API_URL;
const COMMENTS_API_URL = process.env.COMMENTS_API_URL;

//To display view count in k and M form
function formatNumber(num) {
    if (num >= 1e6) {
        return (num / 1e6).toFixed(1).replace(/\.0$/, '') + "M ";
    }
    if (num >= 1e3) {
        return (num / 1e3).toFixed(1).replace(/\.0$/, '') + "K ";
    }
    return num.toString();
}

//Converting time stamp 
function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const intervals = [
        { label: "year", seconds: 31536000 },
        { label: "month", seconds: 2592000 },
        { label: "week", seconds: 604800 },
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
        { label: "second", seconds: 1 },
    ];

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
        }
    }
    return "just now";
}  

//Fetching Videos for the Home Page
const fetchVideos = asyncHandler(async (req, res) => {
    try { 
        const response = await axios.get(YOUTUBE_API_URL, {
            params: {
                part: 'snippet, statistics',
                chart: 'mostPopular',
                regionCode: 'IN',
                maxResults: 30,
                key: YOUTUBE_API_KEY,
            },
        });

        if (!response || !response.data.items.length)
            throw new ApiError(404, "No Videos found");

        // Extract video IDs from the response
        const videoIds = response.data.items
            .map(item => item.id)  
            .filter(id => id); 

        if (videoIds.length === 0) {
            throw new ApiError(404, "No valid video IDs found");
        }
        
        const videos = response.data.items.map(item => {  

            return {
                videoId: item.id?.videoId || item.id?.playlistId || item.id?.channelId || item.id || '',
                thumbnailUrl: item.snippet?.thumbnails?.high?.url || '',
                title: item.snippet?.title || "No title",
                description: item.snippet?.description || "No description available",
                channelTitle: item.snippet?.channelTitle || "Unknown Channel",
                channelThumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url,
                publishDate: timeAgo(item.snippet?.publishedAt || ''),
                viewCount: formatNumber(item.statistics?.viewCount ?? '0'),   
            };
        }); 
        
        //Sending the video response to the frontend 
        return res.status(200).json({ videos });
    } catch (error) { 
        throw new ApiError(error.response?.status || 500, error.message || "Error fetching videos");
    }
}); 


//Fetch Single video for VideoPage
const fetchSingleVideo = asyncHandler(async (req, res) => {
    
    try {
        const videoId = req.params.id; 
        if (!videoId) {
            throw new ApiError(400, "Video ID parameter is required");
        }
 
        // Fetch main video details
        const response = await axios.get(YOUTUBE_API_URL, {
            params: {
                part: 'snippet,statistics,contentDetails',
                id: videoId,
                key: YOUTUBE_API_KEY,
            }
        });

        if (!response.data.items || response.data.items.length === 0) {
            throw new ApiError(404, "Video not found");
        }

        const item = response.data.items[0];

        // Fetch channel details
        const channelId = item.snippet.channelId;
        const channelResponse = await axios.get(CHANNELS_API_URL, {
            params: {
                part: 'snippet,statistics',
                id: channelId,
                key: YOUTUBE_API_KEY,
            },
        });
        
        const channel = channelResponse.data.items[0];
        
        // Fetch comments for the main video
        const commentResponse = await axios.get(COMMENTS_API_URL, {
            params: {
                part: 'snippet',
                videoId,
                maxResults: 100,
                key: YOUTUBE_API_KEY,
            },
        });
        
        const comments = commentResponse.data.items.map(comment => ({
            author: comment.snippet.topLevelComment.snippet.authorDisplayName,
            text: comment.snippet.topLevelComment.snippet.textDisplay,
            publishedAt: timeAgo(comment.snippet.topLevelComment.snippet.publishedAt),
            likeCount: formatNumber(comment.snippet.topLevelComment.snippet.likeCount ?? 0),
            commentThumbnail: comment.snippet.topLevelComment.snippet.authorProfileImageUrl || '',
        }));
         
       const recommendedResponse = await axios.get(YOUTUBE_API_URL, {
           params: {
               part: 'snippet,statistics',  
               chart: 'mostPopular',
               regionCode: 'US',
               maxResults: 20,
               key: YOUTUBE_API_KEY,
           },
       });

       const recommendedItems = recommendedResponse.data.items || [];

        // const recommendedVideoIds = recommendedItems
        //     .map(item => { item.id.videoId.trim()})
        //     .filter(id => id && id.length > 0); 

        // // Fetch statistics for recommended videos only if IDs are available
        // let statsMap = {};
        // if (recommendedVideoIds.length > 0) {
        //     const statsResponse = await axios.get(YOUTUBE_API_URL, {
        //         params: {
        //             part: 'statistics',
        //             id: recommendedVideoIds.join(','),
        //             key: YOUTUBE_API_KEY,
        //         },
        //     });

        //     statsResponse.data.items.forEach(statItem => {
        //         statsMap[statItem.id] = statItem.statistics;
        //     });
        // }

        // Build recommended videos array with stats
        const recommendedVideos = recommendedItems.map(item => {  
            return {
                videoId: item.id,
                title: item.snippet.title,
                thumbnailUrl: item.snippet.thumbnails?.high?.url || '',
                channelTitle: item.snippet.channelTitle,
                publishDate: timeAgo(item.snippet?.publishedAt || ''),
                viewCount: formatNumber(item.statistics?.viewCount ?? '0'), 
            };
        });

        // Final video object
        const video = {
            videoId: item.id || '',
            title: item.snippet?.title || "No Title",
            description: item.snippet?.description || "No description found",
            channelTitle: item.snippet?.channelTitle || "Unknown Channel",
            channelThumbnailUrl: channel.snippet?.thumbnails?.high?.url || '',
            publishDate: timeAgo(item.snippet?.publishedAt || ''),
            viewCount: formatNumber(item.statistics?.viewCount ?? '0'),
            likeCount: formatNumber(item.statistics?.likeCount ?? '0'),
            commentsCount: formatNumber(item.statistics?.commentCount ?? '0'),
            subscribers: formatNumber(channel.statistics?.subscriberCount ?? '0'),
            captionStatus: item.contentDetails?.caption || "No Captions",
            recommendedVideos,
            comments,
        }; 

        res.status(200).json(video);
    } catch (error) {
        console.error("Error fetching video data:", error.response?.data || error.message);
        throw new ApiError(error.response?.status || 500, error.message || "Error fetching video");
    }
});

//Controller for Search Videos
const searchVideos = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) {
    throw new ApiError(400, 'Search query is required');
  }

  try {
    //Fetch Search videos
    const searchResponse = await axios.get(SEARCH_API_URL, {
      params: {
        part: 'snippet',
        maxResults: 100,
        q,
        type: 'video',
        key: YOUTUBE_API_KEY,
      },
    });
    const items = searchResponse.data.items;

    const videoIds = searchResponse.data.items.map(item => item.id.videoId).filter(Boolean);

    if (videoIds.length === 0) {
      return res.status(200).json({ videos: [] });
    }

    //Fetch statistics for these video IDs
    const statsResponse = await axios.get(YOUTUBE_API_URL, {
      params: {
        part: 'statistics',
        id: videoIds.join(','),
        key: YOUTUBE_API_KEY,
      },
    });
 
    const statsMap = {};
    statsResponse.data.items.forEach(item => {
      statsMap[item.id] = item.statistics;
    });

    const channelIds = [...new Set(items.map(item => item.snippet.channelId))].join(',');
    const channelResponse = await axios.get(CHANNELS_API_URL, {
        params: {
            part: 'snippet,statistics',
            id: channelIds,
            key: YOUTUBE_API_KEY,
        },
    });
          
    const formattedDetails = searchResponse.data.items.map(item => {
      const videoId = item.id.videoId || '';
      const stats = statsMap[videoId] || {}; 

      return {
        videoId,
        thumbnailUrl: item.snippet?.thumbnails?.medium?.url || '',
        title: item.snippet?.title || 'No Title',
        channelTitle: item.snippet?.channelTitle || 'Unknown Channel', 
        channelThumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url,
        publishDate: timeAgo(item.snippet?.publishedAt || ''),
        viewCount: stats.viewCount || '0',
        likeCount: stats.likeCount || '0',
        commentCount: stats.commentCount || '0',
      };
    });

    res.status(200).json({ videos: formattedDetails });
  } catch (error) {
    console.log("Error Searching Videos", error.message);
    throw new ApiError(500, 'Failed to Fetch the videos from Youtube API');
  }
});


export {
    fetchVideos,
    fetchSingleVideo,
    searchVideos, 
}

