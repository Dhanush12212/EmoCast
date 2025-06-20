import ApiError from "../utils/ApiError.utils.js";
import ApiResponse from "../utils/ApiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import { WatchLater } from '../models/watchLater.model.js'
 
const addVideos = asyncHandler(async (req, res) => {
  const { video } = req.body;
  const userId = req.user.id;
  console.log("User ID", userId);
  
  console.log("Received body:", req.body);
  
  try {
    let userWatchLater = await WatchLater.findOne({ userId });
 
    if (userWatchLater) { 

      const isDuplicate = userWatchLater.video.some(
        (v) => v?.videoId === video.videoId
      );

      if (isDuplicate) {
        return res.status(400).json({ message: "Video already in Watch Later" });
      }

      userWatchLater.video.push(video);
      await userWatchLater.save();
    }

    res.status(200).json({ message: "Added to Watch Later" });
  } catch (error) {
    console.error("Failed to add video", error.message);
    throw new ApiError(500, "Server Error");
  }
});


const fetchVideos = asyncHandler( async( req, res) => {
  try {
    const videos = await WatchLater.findOne({ userId: req.user.id });
    res.status(200).json(videos?.video || []);
  } catch(error) {
    throw new ApiError(500, 'Server Error' );
  }
});


export { 
    addVideos, 
    fetchVideos, 
}