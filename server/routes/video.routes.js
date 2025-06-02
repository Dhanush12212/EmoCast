import { Router } from 'express';
import { fetchVideos, searchVideos, fetchSingleVideo } from "../controllers/video.controller.js";
import { fetchPlaylist } from "../controllers/playlist.controller.js";

const router = Router();

router.route("/search").get(searchVideos);
router.route("/videos").get(fetchVideos);
router.route("/plylist").get(fetchPlaylist);
router.route("/videos/:id").get(fetchSingleVideo);


export default router;