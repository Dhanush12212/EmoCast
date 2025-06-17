import { Router } from 'express';
import { fetchChannel } from "../controllers/channel.controller.js"; 

const router = Router();
 
router.route("/:channelId").get(fetchChannel);

export default router; 