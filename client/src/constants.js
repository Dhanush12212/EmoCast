import { GoHomeFill } from "react-icons/go";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions, MdOutlineWatchLater, MdOutlinePlaylistPlay, MdOndemandVideo } from "react-icons/md";
import { FaHistory } from "react-icons/fa";  
import { AiOutlineLike } from "react-icons/ai"; 

import { MdOutlineSwitchAccount, MdOutlineDarkMode, MdOutlineFeedback, MdOutlineSecurity } from "react-icons/md";
import { IoLanguageSharp, IoSettingsOutline } from "react-icons/io5"; 
import { FaGoogle, FaRegKeyboard } from "react-icons/fa";
import { PiSignOut } from "react-icons/pi";
import { SiYoutubestudio } from "react-icons/si"; 
import { BsGlobe } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { AiOutlineDollar } from "react-icons/ai";  
import { IoIosHelpCircleOutline } from "react-icons/io";

export const filters = ["All","Gaming","Inventions","Computer programming","Kannada Cinema","CPUs","Music","Thrillers","Google","Mixes","Automobiles","Cricket","Live","Dramedy","Cars","Blogs","Technology","Fitness","Food","Travel","Education","Science","Health","Sports","Comedy","Motivation","DIY","Photography","Art","Fashion","Vlogs","News","Reviews","Unboxing","Animation","Short Films","Music Videos","Podcasts","Tech Reviews","Documentaries","Nature","Pets","Gaming Tutorials","ASMR","Self Improvement","Lifestyle","Meditation","Business","Finance","Gaming News"];

export const sidebarItems = [
  { icon: GoHomeFill, label: "Home", path: '/'},
  { icon: SiYoutubeshorts, label: "Shorts", path: '/' },
  { icon: MdOutlineSubscriptions, label: "Subscription", path: '/subscription' }, 
  {divider: true},
  { icon: MdOutlineWatchLater, label: "Watch Later", path: '/profile' },
  { icon: MdOutlinePlaylistPlay, label: "Playlists", path: '/profile' },
  { icon: MdOndemandVideo, label: "Your Videos", path: '/profile' },
  { icon: FaHistory, label: "History", path: '/profile' },
  { icon: AiOutlineLike, label: "Liked Videos", path: '/profile' },     
  {divider: true},
];

export const Channels = [
    "CodeWithHarry",
    "Apna College",
    "Tech in Kannada",
    "Technical Guruji",
    "Chai aur Code",
]

export const profileItem = [
    {divider: true},
    { icon: FaGoogle, label: "Google Account", path: '/login'},
    { icon: MdOutlineSwitchAccount, label: "Switch account" },
    { icon: PiSignOut, label: "Sign out" }, 
    {divider: true},
    { icon: SiYoutubestudio, label: "Youtube Studio" },
    { icon: AiOutlineDollar, label: "Purchase and Membership" },
    {divider: true},
    { icon: MdOutlineDarkMode, label: "Appearance: Dark Mode" },
    { icon: BsGlobe, label: "Location: India" },
    { icon: IoLanguageSharp, label: "Languages" },
    { icon: MdOutlineSecurity, label: "Restricted Mode: off" },
    { icon: CgProfile, label: "Your data" },
    { icon: FaRegKeyboard, label: "Keyboard Shortcut" },
    {divider: true},
    { icon: IoSettingsOutline, label: "Setting" },     
    {divider: true},
    { icon: IoIosHelpCircleOutline, label: "Help" },     
    { icon: MdOutlineFeedback, label: "Feedback" },     
];