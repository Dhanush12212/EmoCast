import { GoHomeFill } from "react-icons/go";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions, MdOutlineWatchLater, MdOutlinePlaylistPlay} from "react-icons/md"; 
import { AiOutlineLike } from "react-icons/ai"; 

export const sidebarItems = [
  { icon: GoHomeFill, label: "Home", path: '/'},
  { icon: SiYoutubeshorts, label: "Shorts", path: '/shorts' },
  { icon: MdOutlineSubscriptions, label: "Subscription", path: '/subscription' },  
  { icon: MdOutlineWatchLater, label: "Watch Later", path: '/watchLater' },  
  {divider: true},
];

export const Channels = [
    "CodeWithHarry",
    "Apna College",
    "Tech in Kannada",
    "Technical Guruji",
    "Chai aur Code",
]

// export const profileItem = [
//     {divider: true},
//     { icon: FaGoogle, label: "Google Account", path: '/login'},
//     { icon: MdOutlineSwitchAccount, label: "Switch account", path: '/register' },
//     { icon: PiSignOut, label: "Sign out", }, 
//     { icon: MdOutlineDarkMode, label: "Appearance: Dark Mode" },
//     {divider: true},
//     { icon: SiYoutubestudio, label: "Youtube Studio" },
//     { icon: AiOutlineDollar, label: "Purchase and Membership" },
//     {divider: true},
//     { icon: BsGlobe, label: "Location: India" },
//     { icon: IoLanguageSharp, label: "Languages" },
//     { icon: MdOutlineSecurity, label: "Restricted Mode: off" },
//     { icon: CgProfile, label: "Your data" },
//     { icon: FaRegKeyboard, label: "Keyboard Shortcut" },
//     {divider: true},
//     { icon: IoSettingsOutline, label: "Setting" },     
//     {divider: true},
//     { icon: IoIosHelpCircleOutline, label: "Help" },     
//     { icon: MdOutlineFeedback, label: "Feedback" },     
// ];           