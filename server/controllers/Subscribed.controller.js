import ApiError from '../utils/ApiError.utils.js'; 
import asyncHandler from '../utils/asyncHandler.utils.js';
import { Channel } from '../models/Subscribed.model.js';

const Subscribe = asyncHandler( async( req, res) => {
    const userId = req.user.id;
    const channelId = req.params.channelId;

    try {
        const user = await Channel.findOne({ userId });
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        
        if(!user.subscribedTo.includes(channelId)) {
            user.subscribedTo.push(channelId);
            await user.save();
            return res.json({ message: "Subscribed Successfully"});
        } else {
            return res.status(400).json({ message: "Already Subscribed"});
        }
    } catch(error) {
        console.log(error);
        throw new ApiError(500, "Server Error"); 
    }
});


const Unsubscribe = asyncHandler( async( req, res) => {
    const userId = req.user.id;
    const channelId = req.params.channelId;

    try {
        const user = await Channel.findOne({ userId });
        
        if (!user) {
            throw new ApiError(404, "User not found");
        }

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
  const userId = req.user.id;
  const channelId = req.params.channelId;

  const user = await Channel.findOne({ userId });

  if (!user) return res.status(404).json({ isSubscribed: false });

  const isSubscribed = user.subscribedTo.includes(channelId);
  res.json({ isSubscribed });
});

export {
    Subscribe,
    Unsubscribe,
    isSubscribed
}