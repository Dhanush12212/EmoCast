import { Router } from 'express';
import { detectEmotion } from "../controllers/emotion.controller.js";
import { verifyJWT } from '../middleware/auth.middleware.js'

const router = Router();

router.route('/emotion').post(verifyJWT, detectEmotion);

export default router;
