import asyncHandler from "../utils/asyncHandler.utils";
import ApiError from "../utils/ApiError.utils.js";
import { Channel } from '../models/Subscribed.model.js';

const Subscribe = asyncHandler( async( req, res) => {
    const userId = req.user.id;
    const channelId = req.params.channelId;

    try {
        const user = await Channel.findById({ userId });
        if (!user) {
            throw new ApiError(404, "User channel not found");
        }
        
        if(!user.subscribedTo.includes(channelId)) {
            user.subscribedTo.push(channelId);
            await user.save();
            return res.json({ message: "Subscribed Successfully"});
        } else {
            return res.status(400).json({ message: "Already Subscribed"});
        }
    } catch(error) {
        throw new ApiError(500, "Server Error"); 
    }
});


const Unsubscribe = asyncHandler( async( req, res) => {
    const userId = req.user.id;
    const channeId = req.params.channelId;

    try {
        const user = await Channel.findById({ userId });
        
        if (!user) {
            throw new ApiError(404, "User channel not found");
        }
        
        user.subscribedTo = user.subscribedTo.filter(id => id.toString() != channeId);
        await user.save();
        return res.json({ message: "Unsubscribed Successully "});
    } catch(error) {
        throw new ApiError(500, "Server Error");
    }
}); 


export {
    Subscribe,
    Unsubscribe
}