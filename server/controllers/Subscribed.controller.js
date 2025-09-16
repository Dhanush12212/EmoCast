import ApiError from '../utils/ApiError.utils.js'; 
import asyncHandler from '../utils/asyncHandler.utils.js';
import { Channel } from '../models/Subscribed.model.js'; 
import { formatNumber, timeAgo, parseDuration } from '../utils/Formatters.utils.js';
import dotenv from "dotenv";
dotenv.config({ path:'./.env' });
import axios from 'axios';

const CHANNELS_API_URL = process.env.CHANNELS_API_URL;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const PLAYLIST_API_URL = process.env.PLAYLIST_API_URL;
const YOUTUBE_API_URL = process.env.YOUTUBE_API_URL;

// Subscribe to a channel
const Subscribe = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const channelId = req.params.channelId;

  if (!userId) throw new ApiError(401, "Unauthorized: User ID missing");
  if (!channelId) throw new ApiError(404, "Channel ID is required");

  const user = await Channel.findOne({ userId });
  if (!user) throw new ApiError(404, "User not found");

  const isSubscribed = user.subscribedTo.some(id => id.toString() === channelId);

  if (!isSubscribed) {
    user.subscribedTo.push(channelId);
    await user.save();
    return res.json({ message: "Subscribed Successfully" });
  }

  res.status(400).json({ message: "Already Subscribed" });
});

// Unsubscribe from a channel
const Unsubscribe = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const channelId = req.params.channelId;

  if (!channelId) throw new ApiError(404, "Channel ID is required");

  const user = await Channel.findOne({ userId });
  if (!user) throw new ApiError(404, "User not found");

  const before = user.subscribedTo.length;
  user.subscribedTo = user.subscribedTo.filter(id => id.toString() !== channelId);

  if (user.subscribedTo.length === before) {
    return res.status(400).json({ message: "Not subscribed to this channel" });
  }

  await user.save();
  res.json({ message: "Unsubscribed Successfully" });
});

// Check subscription status
const isSubscribed = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userId = req.user?.id;

  if (!channelId) throw new ApiError(404, "Channel ID is required");

  let user = await Channel.findOne({ userId });
  if (!user) user = await Channel.create({ userId, subscribedTo: [] });

  const subscribed = user.subscribedTo.some(id => id.toString() === channelId);
  res.status(200).json({ subscribed });
});

// Fetch subscribed channels
const fetchSubscription = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  if (!userId) throw new ApiError(401, 'Unauthorized: User ID missing');

  const userChannel = await Channel.findOne({ userId });
  if (!userChannel || userChannel.subscribedTo.length === 0) {
    return res.status(200).json({ success: true, subscribedChannels: [] });
  }

  const { data } = await axios.get(CHANNELS_API_URL, {
    params: { part: 'snippet,statistics,contentDetails', id: userChannel.subscribedTo.join(','), key: YOUTUBE_API_KEY },
  });

  const channels = data.items?.map(channel => ({
    channelId: channel.id,
    channelTitle: channel.snippet?.title || "Unknown Channel",
    channelThumbnail: channel.snippet?.thumbnails?.high?.url || channel.snippet?.thumbnails?.medium?.url || channel.snippet?.thumbnails?.default?.url,
  })) || [];

  res.status(200).json({ success: true, subscribedChannels: channels });
});

// Fetch subscription videos with pagination
const fetchVideos = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { pageToken } = req.query; // for infinite scroll
  const maxResults = 30;

  if (!userId) throw new ApiError(401, 'Unauthorized: User ID missing');

  const userChannel = await Channel.findOne({ userId });
  if (!userChannel || userChannel.subscribedTo.length === 0) {
    return res.status(200).json({ success: true, videos: [], nextPageToken: null });
  }

  const channelIds = userChannel.subscribedTo;

  // Fetch playlist IDs of subscribed channels
  const { data: channelsData } = await axios.get(CHANNELS_API_URL, {
    params: { part: 'contentDetails', id: channelIds.join(','), key: YOUTUBE_API_KEY },
  });

  const playlistIds = channelsData.items.map(item => item.contentDetails?.relatedPlaylists?.uploads).filter(Boolean);
  if (playlistIds.length === 0) return res.status(200).json({ success: true, videos: [], nextPageToken: null });

  // Fetch videos from first playlist (could extend to all playlists if needed)
  const playlistId = playlistIds[0];
  const { data: playlistData } = await axios.get(PLAYLIST_API_URL, {
    params: { part: 'snippet,contentDetails', playlistId, maxResults, pageToken: pageToken || '', key: YOUTUBE_API_KEY },
  });

  const videoIds = playlistData.items.map(item => item.contentDetails.videoId).filter(Boolean);
  if (videoIds.length === 0) return res.status(200).json({ success: true, videos: [], nextPageToken: null });

  const { data: videoDetails } = await axios.get(YOUTUBE_API_URL, {
    params: { part: 'snippet,contentDetails,statistics', id: videoIds.join(','), key: YOUTUBE_API_KEY },
  });

  const videos = videoDetails.items.map(item => ({
    videoId: item.id,
    thumbnailUrl: item.snippet?.thumbnails?.high?.url || '',
    title: item.snippet?.title || 'No title',
    description: item.snippet?.description || 'No description available',
    channelTitle: item.snippet?.channelTitle || 'Unknown Channel',
    channelThumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url,
    publishDate: timeAgo(item.snippet?.publishedAt || ''),
    viewCount: formatNumber(item.statistics?.viewCount ?? '0'),
    duration: item.contentDetails?.duration ? parseDuration(item.contentDetails.duration) : '0:00',
    channelId: item.snippet.channelId,
  }));

  res.status(200).json({
    success: true,
    videos,
    nextPageToken: playlistData.nextPageToken || null,
  });
});

export { Subscribe, Unsubscribe, isSubscribed, fetchSubscription, fetchVideos };
