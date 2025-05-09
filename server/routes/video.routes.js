import { Router } from 'express';
import { fetchVideos, searchVideos } from "../controllers/video.controller.js";
import { fetchPlaylist } from "../controllers/playlist.controller.js";

const router = Router();

router.route("/search").get(searchVideos);
router.route("/videos").get(fetchVideos);
router.route("/plylist").get(fetchPlaylist);


export default router;