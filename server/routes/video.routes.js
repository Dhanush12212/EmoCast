import { Router } from express;
import { fetchVideos, searchVideos } from "../controllers/video.controller";
import { fetchPlaylist } from "../controllers/playlist.controller";

const router = Router();

router.route("/search").get('searchVideos');
router.route("/videos").get("fetchVideos");
router.route("/plylist").get("fetchPlaylist");


export default router;