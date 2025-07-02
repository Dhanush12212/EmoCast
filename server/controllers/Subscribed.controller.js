import ApiError from '../utils/ApiError.utils.js'; 
import asyncHandler from '../utils/asyncHandler.utils.js';
import { Channel } from '../models/Subscribed.model.js';
import mongoose from 'mongoose';

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


export {
    Subscribe,
    Unsubscribe,
    isSubscribed
}