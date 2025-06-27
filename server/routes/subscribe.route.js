import { Router } from 'express';
import { Subscribe, Unsubscribe, isSubscribed } from '../controllers/Subscribed.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.route('/:channelId').post(verifyJWT, Subscribe);
router.route('/:channeId').delete(verifyJWT, Unsubscribe );
router.route('/check/:channelId').get(verifyJWT, isSubscribed );

export default router;