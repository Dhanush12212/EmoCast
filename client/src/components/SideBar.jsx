import React from 'react'
import { GoHomeFill } from "react-icons/go";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions } from "react-icons/md"; 
import { CgProfile } from "react-icons/cg";

export const sidebarItems = [
  { icon: GoHomeFill, label: "Home" },
  { icon: SiYoutubeshorts, label: "Shorts"},
  { icon: MdOutlineSubscriptions, label: "Subscription" },  
  { icon: CgProfile, label: "Profile" },  
];

function SideBar() {
  return ( 
    <div className='my-6 flex flex-col gap-5 mx-3'> 

        {sidebarItems.map((item, idx) => {
            return(
                <div key={idx} className='hover:bg-[#3D3D3D] rounded-xl flex items-center flex-col gap-2 w-23 py-2 '>
                    <item.icon className='w-8 h-8'/>
                    <label htmlFor="Home" className='text-sm font-medium'>{item.label}</label>
                </div> 
            )
        })} 

    </div>
  )
}

export default SideBar