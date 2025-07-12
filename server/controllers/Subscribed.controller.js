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
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

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
          part: 'snippet,statistics,contentDetails',
          id: channelIds.join(','),
          key: YOUTUBE_API_KEY,
        },
      }
    );

    if (!data.items || data.items.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No valid subscribed channels found',
        subscribedChannels: [],
      });
    }
 
    const transformedChannels = data.items.map((channel) => ({
      channelId: channel.id, 
      channelTitle: channel.snippet?.title || "Unknown Channel",
      channelThumbnail: channel.snippet?.thumbnails?.high?.url || channel.snippet?.thumbnails?.medium?.url || channel.snippet?.thumbnails?.default?.url,
      // thumbnailUrl: channel.snippet?.thumbnails?.high?.url || '',
      // title: channel.snippet?.title || "No title",
      // description: channel.snippet?.description || "No description available",
      // publishDate: timeAgo(channel.snippet?.publishedAt || ''),
      // publishAt: channel.snippet?.publishedAt || '',
      // viewCount: formatNumber(channel.statistics?.viewCount ?? '0'),   
      // duration: channel.contentDetails?.duration
      //             ? parseDuration(channel.contentDetails.duration)
      //             : '0:00',    
    })); 

    res.status(200).json({
      success: true,
      subscribedChannels: transformedChannels,
    });
  } catch (error) {
      console.error('Error fetching subscribed channels:', error.message);
      throw new ApiError(500, 'Failed to fetch subscribed channel details');
  } 
});

export {
    Subscribe,
    Unsubscribe,
    isSubscribed,
    fetchSubscription
}