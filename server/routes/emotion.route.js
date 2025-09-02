import { Router } from 'express';
import { detectEmotionRoute } from "../controllers/emotion.controller.js";
import { verifyJWT } from '../middleware/auth.middleware.js'

const router = Router();

router.route('/detect').post(verifyJWT, detectEmotionRoute);

export default router;
