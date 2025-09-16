import dotenv from "dotenv"
dotenv.config({
    path:'./.env'
})

import ApiError from "../utils/ApiError.utils.js" 
import asyncHandler from "../utils/asyncHandler.utils.js";
import { formatNumber, timeAgo, parseDuration } from '../utils/Formatters.utils.js';
import axios from 'axios'; 

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = process.env.YOUTUBE_API_URL;
const CHANNELS_API_URL = process.env.CHANNELS_API_URL; 
// const RECOMMENDED_API_URL = process.env.RECOMMENDED_API_URL; 
const SEARCH_API_URL = process.env.SEARCH_API_URL;
const COMMENTS_API_URL = process.env.COMMENTS_API_URL;
const CATEGORIES_API_URL = process.env.CATEGORIES_API_URL;

const fetchVideos = asyncHandler(async (req, res) => {
  try {
    const { pageToken } = req.query;

    const response = await axios.get(YOUTUBE_API_URL, {
      params: {
        part: 'snippet,statistics,contentDetails',
        chart: 'mostPopular',
        regionCode: 'IN',
        maxResults: 32,
        key: YOUTUBE_API_KEY,
        pageToken: pageToken || "",
      },
    });

    if (!response.data.items.length)
      throw new ApiError(404, "No Videos found");

    const videos = response.data.items.map(item => ({
      videoId: item.id || '',
      thumbnailUrl: item.snippet?.thumbnails?.high?.url || '',
      title: item.snippet?.title || "No title",
      channelTitle: item.snippet?.channelTitle || "Unknown Channel",
      channelThumbnail: item.snippet?.thumbnails?.high?.url || '',
      publishDate: timeAgo(item.snippet?.publishedAt || ''),
      viewCount: formatNumber(item.statistics?.viewCount ?? '0'),
      duration: item.contentDetails?.duration ? parseDuration(item.contentDetails.duration) : '0:00',
      channelId: item.snippet.channelId,
    }));

    res.status(200).json({
      videos,
      nextPageToken: response.data.nextPageToken || null,
    });
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
               part: 'snippet,statistics,contentDetails',  
               chart: 'mostPopular',
               regionCode: 'US',
               maxResults: 20,
               key: YOUTUBE_API_KEY,
           },
       });

       const recommendedItems = recommendedResponse.data.items || [];
 
        // Build recommended videos array with stats
        const recommendedVideos = recommendedItems.map(item => {  
            return {
                videoId: item.id,
                title: item.snippet.title,
                thumbnailUrl: item.snippet.thumbnails?.high?.url || '',
                channelTitle: item.snippet.channelTitle,
                publishDate: timeAgo(item.snippet?.publishedAt || ''),
                viewCount: formatNumber(item.statistics?.viewCount ?? '0'), 
                duration: item.contentDetails?.duration
                  ? parseDuration(item.contentDetails?.duration)
                  : '0:00'
            };
        });

        // Final video object
        const video = {
            videoId: item.id || '',
            title: item.snippet?.title || "No Title",
            description: item.snippet?.description || "No description found",
            channelTitle: item.snippet?.channelTitle || "Unknown Channel",
            channelThumbnailUrl: channel.snippet?.thumbnails?.high?.url || '',
            channelId: item.snippet.channelId,
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

// Search Videos with pagination
const searchVideos = asyncHandler(async (req, res) => {
  const { q, pageToken } = req.query;
  if (!q) {
    throw new ApiError(400, 'Search query is required');
  }

  try {
    const searchResponse = await axios.get(SEARCH_API_URL, {
      params: {
        part: 'snippet',
        maxResults: 30,
        q,
        type: 'video',
        pageToken: pageToken || '',
        key: YOUTUBE_API_KEY,
      },
    });

    const searchItems = searchResponse.data.items || [];
    const videoIds = searchItems.map(item => item.id.videoId).filter(Boolean);

    if (videoIds.length === 0) {
      return res.status(200).json({ videos: [], nextPageToken: searchResponse.data.nextPageToken || null });
    }

    const statsResponse = await axios.get(YOUTUBE_API_URL, {
      params: {
        part: 'statistics,contentDetails',
        id: videoIds.join(','),
        key: YOUTUBE_API_KEY,
      },
    });

    const statsMap = {};
    statsResponse.data.items.forEach(item => {
      statsMap[item.id] = {
        statistics: item.statistics,
        contentDetails: item.contentDetails,
      };
    });

    const formattedDetails = searchItems.map(item => {
      const videoId = item.id.videoId;
      const statDetail = statsMap[videoId] || {};
      const stats = statDetail.statistics || {};
      const contentDetails = statDetail.contentDetails || {};

      return {
        videoId,
        thumbnailUrl: item.snippet?.thumbnails?.medium?.url || '',
        title: item.snippet?.title || 'No Title',
        channelId: item.snippet.channelId,
        channelTitle: item.snippet?.channelTitle || 'Unknown Channel',
        channelThumbnail:
          item.snippet?.thumbnails?.high?.url ||
          item.snippet?.thumbnails?.medium?.url ||
          item.snippet?.thumbnails?.default?.url,
        publishDate: timeAgo(item.snippet?.publishedAt || ''),
        viewCount: formatNumber(stats.viewCount || '0'),
        duration: contentDetails.duration ? parseDuration(contentDetails.duration) : '0:00',
      };
    });

    res.status(200).json({
      videos: formattedDetails,
      nextPageToken: searchResponse.data.nextPageToken || null,
    });
  } catch (error) {
    console.log('Error Searching Videos', error.message);
    throw new ApiError(500, 'Failed to fetch videos from YouTube API');
  }
});

//Fetching the Video Category array from the youtube endpoint
const videoCategories  = asyncHandler(async(req, res) => {
    try {  
        const categoryResponse = await axios.get(CATEGORIES_API_URL, {
            params: {
                part: 'snippet',
                regionCode: 'IN',
                maxResults:30,
                key: YOUTUBE_API_KEY
            }
        });

        const categories = categoryResponse.data.items
        .filter(category => category.snippet.assignable)
        .map(category => ({
            id: category.id,
            title: category.snippet.title
        }));

        res.status(200).json({ categories });
    }
    catch(error) {
        console.log("Error Fetching the video category", error.message);
        throw new ApiError(500, "Failed to Fetch the Videos Categories fro Youtube API");
    }
});

// Get videos by category with pagination
const getVideosByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { pageToken } = req.query;

  if (!categoryId) {
    throw new ApiError(400, "Category ID is required");
  }

  try {
    const response = await axios.get(YOUTUBE_API_URL, {
      params: {
        part: 'snippet,statistics,contentDetails',
        chart: 'mostPopular',
        regionCode: 'IN',
        maxResults: 30,
        videoCategoryId: categoryId,
        videoDuration: "medium",
        pageToken: pageToken || '',
        key: YOUTUBE_API_KEY,
      },
    });

    const videos = response.data.items || [];

    if (videos.length === 0) {
      throw new ApiError(400, "No videos found for this category");
    }

    const formattedVideos = videos.map(item => ({
      videoId: item.id,
      thumbnailUrl: item.snippet?.thumbnails?.medium?.url || '',
      title: item.snippet?.title || 'No Title',
      channelTitle: item.snippet?.channelTitle || 'Unknown Channel',
      channelThumbnail: item.snippet?.thumbnails?.default?.url || '',
      publishDate: timeAgo(item.snippet?.publishedAt || ''),
      viewCount: formatNumber(item.statistics?.viewCount || '0'),
      duration: item.contentDetails?.duration ? parseDuration(item.contentDetails.duration) : '0:00',
    }));

    res.status(200).json({
      videos: formattedVideos,
      nextPageToken: response.data.nextPageToken || null,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    if (error.response?.status === 404) {
      return res.status(400).json({ message: "No videos found (404 from YouTube)" });
    }

    console.error("Unexpected error:", error.message);
    return res.status(500).json({ message: "Failed to fetch category videos" });
  }
});
 
const fetchShorts = asyncHandler(async (req, res) => {
  try { 
    const searchResponse = await axios.get(SEARCH_API_URL, {
      params: {
        part: 'snippet',
        q: 'shorts',
        type: 'video',
        videoDuration: 'short',
        maxResults: 20,
        key: YOUTUBE_API_KEY,
      },
    });

    const items = searchResponse.data.items;
 
    const videoIds = items.map((item) => item.id.videoId).join(',');
 
    const videosResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,statistics',
        id: videoIds,
        key: YOUTUBE_API_KEY,
      },
    });

    const shorts = videosResponse.data.items.map((item) => ({
      videoId: item.id,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      likeCount: formatNumber(item.statistics.likeCount || '0'),
      commentCount: formatNumber(item.statistics.commentCount || '0'),
      viewCount: formatNumber(item.statistics.viewCount || '0'),
    }));

    res.status(200).json({ shorts });
  } catch (error) {
    console.error('Failed to fetch Shorts:', error.message);
    throw new ApiError(500, 'Failed to fetch shorts');
  }
});

 
export {
    fetchVideos,
    fetchSingleVideo,
    searchVideos,
    videoCategories,
    getVideosByCategory,
    fetchShorts,
}

