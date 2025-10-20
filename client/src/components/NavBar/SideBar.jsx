import React from 'react'
import { Link } from 'react-router-dom'
import { GoHomeFill } from "react-icons/go";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions, MdOutlineWatchLater } from "react-icons/md"; 
import { CgProfile } from "react-icons/cg";  
import WebCamCapture from '../WebCam/WebCamCapture'

export const sidebarItems = [
  { icon: GoHomeFill, label: "Home", path: '/' },
  { icon: SiYoutubeshorts, label: "Shorts", path: '/shorts' },
  { icon: MdOutlineSubscriptions, label: "Subscription", path: '/subscription' },  
  { icon: MdOutlineWatchLater, label: "Watch Later", path: '/watchLater' }, 
  { icon: CgProfile, label: "You", path: '/profile' },  
];

function SideBar() {
  return ( 
    <div className="flex justify-start flex-col fixed left-0 top-0 h-screen z-50">
      <div 
        className="flex flex-col items-center py-2 w-[70px] sm:w-[80px] md:w-[85px] bg-[#121212] text-white h-full mt-20"
      >
        {/* Menu Items */}
        {sidebarItems.map((item, idx) => (
          <Link 
            to={item.path} 
            key={idx} 
            className="flex flex-col items-center justify-center w-full py-3 hover:bg-[#3D3D3D] rounded-xl transition-all duration-200"
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span className="hidden md:flex text-[11px] font-medium">{item.label}</span>
          </Link>
        ))}

        {/* WebCamCapture */}
        <div className="w-full px-2 flex flex-col items-center justify-center py-2 hover:bg-[#3D3D3D] rounded-xl transition-all duration-200 cursor-pointer">
          <WebCamCapture /> 
        </div> 
      </div>
    </div>
  )
}

export default SideBar
