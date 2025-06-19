import { Router } from 'express';
import { fetchVideos, fetchSingleVideo, videoCategories, getVideosByCategory, fetchShorts } from "../controllers/video.controller.js"; 

const router = Router();
 
router.route("/videos").get(fetchVideos); 
router.route("/video/:id").get(fetchSingleVideo);   
router.route("/categories").get(videoCategories);
router.route("/byCategory/:categoryId").get(getVideosByCategory);
router.route("/shorts").get(fetchShorts);

export default router; 