import dotenv from "dotenv"
dotenv.config({
    path:'./.env'
})

import ApiError from "../utils/ApiError.utils.js"
// import ApiResponse from "../utils/ApiResponse.utils.js"
import asyncHandler from "../utils/asyncHandler.utils.js";
import axios from 'axios';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = process.env.YOUTUBE_API_URL;

const fetchVideos = asyncHandler( async( req, res) => {
    try {

        const response = await axios.get(YOUTUBE_API_URL, {
            params: {
                part: 'snippet',   
                chart: 'mostPopular', 
                maxResults: 20,       
                key: YOUTUBE_API_KEY,
            },
        })
        
        if (!response || !response.data.items.length)
            throw new ApiError(404, "No Videos found");
        
        const videos = response.data.items.map(( item ) => ({
            videoId: item.id?.videoId ?? '',
            title: item.snippet?.title ?? "No title",
            thumbnailUrl: item.snippet?.thumbnailUrl?.high?.url ?? '',
        }));  
        
        return res.status(200).json({ videos, response: response.data });
    } catch(error) {
        throw new ApiError(error.response?.status || 500, error.message || "Error fetching videos");
    }
    
});


const searchVideos = asyncHandler( async( req, res) =>{

});


export {
    fetchVideos,
    searchVideos,

}

