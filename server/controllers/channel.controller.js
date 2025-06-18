import dotenv from "dotenv"
dotenv.config({
    path:'./.env'
})

import ApiError from "../utils/ApiError.utils.js" 
import asyncHandler from "../utils/asyncHandler.utils.js";
import { formatNumber, timeAgo, parseDuration } from '../utils/Formatters.utils.js';
import axios from 'axios'; 
 
const CHANNELS_API_URL = process.env.CHANNELS_API_URL; 
const YOUTUBE_API_URL = process.env.YOUTUBE_API_URL;
const PLAYLIST_API_URL = process.env.PLAYLIST_API_URL;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

//Fetch channel details
const fetchChannel = asyncHandler(async (req, res) => {
  try {
    const { channelId } = req.params;

    const channelResponse = await axios.get(CHANNELS_API_URL, {
      params: {
        part: 'snippet,statistics,brandingSettings,contentDetails',
        id: channelId,
        key: YOUTUBE_API_KEY,
      },
    });

    const channel = channelResponse.data.items?.[0];
    if (!channel) {
      throw new ApiError(404, "Channel not found");
    }

    // Extract uploads playlist ID
    const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;

    // Fetch videos
    const videoResponse = await axios.get(PLAYLIST_API_URL, {
      params: {
        part: 'snippet,contentDetails',
        playlistId: uploadsPlaylistId,
        maxResults: 30,
        key: YOUTUBE_API_KEY,
      },
    });

    const basicVideos = videoResponse.data.items || [];
    const videoIds = basicVideos.map(item => item.contentDetails.videoId).join(',');

    // Fetch video statistics & contentDetails 
    const statsResponse = await axios.get(YOUTUBE_API_URL, {
      params: {
        part: 'contentDetails,statistics',
        id: videoIds,
        key: YOUTUBE_API_KEY,
      },
    });

    const statsMap = {};
    for (const item of statsResponse.data.items) {
      statsMap[item.id] = {
        duration: parseDuration(item.contentDetails?.duration),
        viewCount: formatNumber(item.statistics?.viewCount || '0'),
      };
    }

    const videos = basicVideos.map(item => {
      const videoId = item.contentDetails.videoId;
      return {
        videoId,
        title: item.snippet.title,
        thumbnailUrl: item.snippet.thumbnails?.high?.url || '',
        publishDate: timeAgo(item.snippet.publishedAt),
        viewCount: statsMap[videoId]?.viewCount || '0',
        duration: statsMap[videoId]?.duration || '0:00',
      };
    });

    const channelDetails = {
      title: channel.snippet?.title || 'Unknown Channel',
      description: channel.snippet?.description || '',
      thumbnail: channel.snippet?.thumbnails?.high?.url || '',
      subscribers: formatNumber(channel.statistics?.subscriberCount || '0'),
      videos,
      banner: channel.brandingSettings?.image?.bannerExternalUrl || '',
      customUrl: (channel.snippet?.customUrl || '').replace(/^.*\/@?/, ''),
    };

    res.status(200).json({ channel: channelDetails });

  } catch (error) {
    console.error("Failed to Fetch the Channel:", error.message);
    throw new ApiError(error.response?.status || 500, error.response?.data?.error?.message || "Failed to fetch channel");
  }
});

export {
    fetchChannel, 
}