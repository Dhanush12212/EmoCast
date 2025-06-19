import { Router } from 'express';
import { addVideos, fetchVideos } from "../controllers/watchLater.controller.js";
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();
 
router.route("/add").post(verifyJWT, addVideos); 
router.route("/videos").get(verifyJWT, fetchVideos);

export default router; 