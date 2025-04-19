import { GoHomeFill } from "react-icons/go";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions, MdOutlineWatchLater, MdOutlinePlaylistPlay, MdOndemandVideo } from "react-icons/md";
import { FaHistory } from "react-icons/fa";  
import { AiOutlineLike } from "react-icons/ai"; 
 
export const sidebarItems = [
  { icon: GoHomeFill, label: "Home" },
  { icon: SiYoutubeshorts, label: "Shorts" },
  { icon: MdOutlineSubscriptions, label: "Subscription" }, 
  {divider: true},
  { icon: MdOutlineWatchLater, label: "Watch Later" },
  { icon: MdOutlinePlaylistPlay, label: "Playlists" },
  { icon: MdOndemandVideo, label: "Your Videos" },
  { icon: FaHistory, label: "History" },
  { icon: AiOutlineLike, label: "Liked Videos" },     
  {divider: true},
];

export const Channels = [
    "CodeWithHarry",
    "Apna College",
    "Tech in Kannada",
    "Technical Guruji",
    "Chai aur Code",
]