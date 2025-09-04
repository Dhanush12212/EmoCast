import React from 'react'
import { Link } from 'react-router-dom'
import { GoHomeFill } from "react-icons/go";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions, MdOutlineWatchLater } from "react-icons/md"; 
import { CgProfile } from "react-icons/cg";  
import WebCamCapture from '../WebCam/WebCamCapture'

export const sidebarItems = [
  { icon: GoHomeFill, label: "Home", path: '/' },
  { icon: SiYoutubeshorts, label: "Shorts", path: '/shorts'},
  { icon: MdOutlineSubscriptions, label: "Subscription", path: '/subscription'},  
  { icon: MdOutlineWatchLater, label: "Watch Later", path: '/watchLater' }, 
  { icon: CgProfile, label: "You", path:'/profile' },  
];

function SideBar() {
  return ( 
    <div className="flex flex-col items-center py-2 w-25 bg-[#181818] text-white min-h-screen relative top-18">
      
      {/* Menu Items */}
      {sidebarItems.map((item, idx) => (
        <Link 
          to={item.path} 
          key={idx} 
          className="flex flex-col items-center justify-center w-full py-3 hover:bg-[#3D3D3D] rounded-xl transition-all duration-200"
        >
          <item.icon className="w-6 h-6 mb-1" />
          <span className="text-[11px] font-medium">{item.label}</span>
        </Link>
      ))}

      {/* WebCam pinned at bottom */}
      <div className="w-full">
        <div className="flex flex-col items-center justify-center py-3 hover:bg-[#3D3D3D] rounded-xl transition-all duration-200 cursor-pointer">
          <WebCamCapture 
            onEmotion={(data) => {
              console.log("Detected emotion:", data.emotion);
            }}
          /> 
        </div>
      </div>
    </div>
  )
}

export default SideBar
