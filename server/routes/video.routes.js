import { Router } from 'express';
import { fetchVideos, fetchSingleVideo, videoCategories, getVideosByCategory } from "../controllers/video.controller.js";
import { fetchPlaylist } from "../controllers/playlist.controller.js"; 

const router = Router();
 
router.route("/videos").get(fetchVideos);
router.route("/plylist").get(fetchPlaylist);
router.route("/video/:id").get(fetchSingleVideo);   
router.route("/categories").get(videoCategories);
router.route("/byCategory/:categoryId").get(getVideosByCategory);

export default router; 