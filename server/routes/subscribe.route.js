import { Router } from 'express';
import { Subscribe, Unsubscribe } from '../controllers/Subscribed.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router;

router.route('/subscribe').post(verifyJWT, Subscribe);
router.route('/unsubscribe').post(verifyJWT, Unsubscribe );

export default router;