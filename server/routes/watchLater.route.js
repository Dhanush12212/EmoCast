import { Router } from 'express';
import { addVideos, fetchVideos, deleteVideo } from "../controllers/watchLater.controller.js";
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();
 
router.route("/add").post(verifyJWT, addVideos); 
router.route("/videos").get(verifyJWT, fetchVideos);
router.route('/delete/:videoId').delete(verifyJWT, deleteVideo);

export default router; 