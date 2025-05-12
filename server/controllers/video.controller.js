import dotenv from "dotenv"
dotenv.config({
    path:'./.env'
})

import ApiError from "../utils/ApiError.utils.js" 
import asyncHandler from "../utils/asyncHandler.utils.js";
import axios from 'axios';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = process.env.YOUTUBE_API_URL;

const fetchVideos = asyncHandler(async (req, res) => {
    try { 
        const response = await axios.get(YOUTUBE_API_URL, {
            params: {
                part: 'snippet',
                chart: 'mostPopular',
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
        
        //To display view count in k and M form
        function formatNumber(num) {
            if (num >= 1e6) {
                return (num / 1e6).toFixed(1).replace(/\.0$/, '') + "M views";
            }
            if (num >= 1e3) {
                return (num / 1e3).toFixed(1).replace(/\.0$/, '') + "K views";
            }
            return num.toString() + " views";
        }
        
        // Fetch statistics for each video
        const statsResponse = await axios.get( YOUTUBE_API_URL, {
            params: {
                part: 'statistics',
                id: videoIds.join(','),  
                key: YOUTUBE_API_KEY,
            },
        }); 

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

        const videos = response.data.items.map(item => { 
            const stats = statsResponse.data.items.find(statItem => statItem.id === item.id); 

            return {
                videoId: item.id?.videoId || item.id?.playlistId || item.id?.channelId || item.id || '',
                thumbnailUrl: item.snippet?.thumbnails?.high?.url || '',
                title: item.snippet?.title || "No title",
                description: item.snippet?.description || "No description available",
                channelTitle: item.snippet?.channelTitle || "Unknown Channel",
                channelThumbnailUrl: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || 'default-channel-thumbnail.jpg',
                publishDate: timeAgo(item.snippet?.publishedAt || ''),
                views: formatNumber(stats?.statistics?.viewCount ?? '0'),  
                tags: item.snippet?.tags || [] ,
            };
        }); 
        
        //Sending the video response to the frontend 
        return res.status(200).json({ videos });
    } catch (error) { 
        throw new ApiError(error.response?.status || 500, error.message || "Error fetching videos");
    }
});
 
const searchVideos = asyncHandler( async( req, res) =>{

});


export {
    fetchVideos,
    searchVideos, 
}

