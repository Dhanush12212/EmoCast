import { Router } from 'express';
import { Subscribe, Unsubscribe, isSubscribed, fetchChannels } from '../controllers/Subscribed.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.route('/check/:channelId').get(verifyJWT, isSubscribed );
router.route('/:channelId').post(verifyJWT, Subscribe);
router.route('/:channelId').delete(verifyJWT, Unsubscribe );
router.route('/fetchChannels').get(verifyJWT, fetchChannels);

export default router;