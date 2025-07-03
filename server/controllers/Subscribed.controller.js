import ApiError from '../utils/ApiError.utils.js'; 
import asyncHandler from '../utils/asyncHandler.utils.js';
import { Channel } from '../models/Subscribed.model.js'; 
import { formatNumber, timeAgo, parseDuration } from '../utils/Formatters.utils.js';
import dotenv from "dotenv"
dotenv.config({
    path:'./.env'
})
import axios from 'axios';

const CHANNELS_API_URL = process.env.CHANNELS_API_URL;

const Subscribe = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const channelId = req.params.channelId;

  try {
    if (!userId) {
      throw new ApiError(401, "Unauthorized: User ID missing");
    }

    const user = await Channel.findOne({ userId });
    if (!user)  throw new ApiError(404, "User not found"); 
    if(!channelId) throw new ApiError(404, "Channel Id is required");

    const isSubscribed = user.subscribedTo.some(id =>
      id.toString() === channelId
    );


    if (!isSubscribed) {
      user.subscribedTo.push(channelId);
      await user.save();
      return res.json({ message: "Subscribed Successfully" });
    } else {
      return res.status(400).json({ message: "Already Subscribed" });
    }
  } catch (error) {
    console.error("Subscribe Controller Error:", error);
    throw new ApiError(500, "Server Error");
  }
}); 

const Unsubscribe = asyncHandler( async( req, res) => {
    const userId = req.user.id;
    const channelId = req.params.channelId;

    try {
        const user = await Channel.findOne({ userId });
        
        if (!user)  throw new ApiError(404, "User not found"); 
        if(!channelId) throw new ApiError(404, "Channel Id is required");

        const before = user.subscribedTo.length;
        user.subscribedTo = user.subscribedTo.filter(
          (id) => id.toString() !== channelId
        );

        if (user.subscribedTo.length === before) {
          return res.status(400).json({ message: "Not subscribed to this channel" });
        }

        await user.save();
        return res.json({ message: "Unsubscribed Successully "});
    } catch(error) {
        throw new ApiError(500, "Server Error");
    }
}); 

const isSubscribed = asyncHandler(async (req, res) => {

  const { channelId } = req.params;
  const userId = req.user?.id; 

  const user = await Channel.findOne({ userId  }); 

  if (!user)  {
    user = await Channel.create({ userId, subscribedTo: [] }); 
  }
  if(!channelId) throw new ApiError(404, "Channel Id is required");

  const isSubscribed = user.subscribedTo.some(id =>
    id.toString() === channelId
  );

  res.status(200).json({ subscribed: isSubscribed });

});


const fetchSubscription = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  try {
    if (!userId) {
      throw new ApiError(401, 'Unauthorized: User ID missing');
    }

    const userChannel = await Channel.findOne({ userId });

    if (!userChannel || userChannel.subscribedTo.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No subscriptions found',
        subscribedChannels: [],
      });
    }

    const channelIds = userChannel.subscribedTo;

    // Fetch YouTube channel details
    const { data } = await axios.get( CHANNELS_API_URL, {
        params: {
          part: 'snippet,statistics',
          id: channelIds.join(','),
          key: YOUTUBE_API_KEY,
        },
      }
    );
 
    const transformedChannels = data.items.map((channel) => ({
      channelId: channel.id, 
      thumbnailUrl: item.snippet?.thumbnails?.high?.url || '',
      title: item.snippet?.title || "No title",
      description: item.snippet?.description || "No description available",
      channelTitle: item.snippet?.channelTitle || "Unknown Channel",
      channelThumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url,
      publishDate: timeAgo(item.snippet?.publishedAt || ''),
      publishAt: item.snippet?.publishedAt || '',
      viewCount: formatNumber(item.statistics?.viewCount ?? '0'),   
      duration: item.contentDetails?.duration
            ? parseDuration(item.contentDetails.duration)
            : '0:00',    
      channelId,
    }));

    res.status(200).json({
      success: true,
      subscribedChannels: transformedChannels,
    });
  } catch (error) {
    console.error('Error fetching subscribed channels:', error.message);
    throw new ApiError(500, 'Failed to fetch subscribed channel details');
  }


export {
    Subscribe,
    Unsubscribe,
    isSubscribed,
    fetchSubscription
}