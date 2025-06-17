import dotenv from "dotenv"
dotenv.config({
    path:'./.env'
})

import ApiError from "../utils/ApiError.utils.js" 
import asyncHandler from "../utils/asyncHandler.utils.js";
import axios from 'axios'; 
 
const CHANNELS_API_URL = process.env.CHANNELS_API_URL; 
// const YOUTUBE_API_URL = process.env.YOUTUBE_API_URL;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;


const fetchChannel = asyncHandler( async( req, res) => {
    try  {
        const { channelId } = req.params;
        const channelResponse = await axios.get(CHANNELS_API_URL, {
            params: {
                part: 'snippet,statistics,brandingSettings',
                id: channelId,
                key: YOUTUBE_API_KEY,
            }
        });

        const channel = channelResponse.data.items[0];

        if (!channel) {
            throw new ApiError(404, "Channel not found");
        }

        const channelDetails = {
            title: channel.snippet.title,
            description: channel.snippet.description,
            thumbnail: channel.snippet.thumbnails.high.url,
            subscribers: channel.statistics.subscriberCount,
            views: channel.statistics.viewCount,
            videos: channel.statistics.videoCount,
            banner: channel.brandingSettings?.image?.bannerExternalUrl
        }

        res.status(200).json({ channel: channelDetails })

    } catch(error) {
        console.log("Fialed to Fetch the Channel", error.message);
        throw new ApiError(404, "Failed to Fetch the Channel");
    }
});


const fetchChannelVideos = asyncHandler( async( req, res) => {

});

export {
    fetchChannel,
    fetchChannelVideos,
}