import React from 'react'
import {Link} from 'react-router-dom'
import { GoHomeFill } from "react-icons/go";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions } from "react-icons/md"; 
import { CgProfile } from "react-icons/cg"; 

export const sidebarItems = [
  { icon: GoHomeFill, label: "Home", path: '/' },
  { icon: SiYoutubeshorts, label: "Shorts", path: '/'},
  { icon: MdOutlineSubscriptions, label: "Subscription", path: '/subscription'},  
  { icon: CgProfile, label: "Profile", path:'/profile' },  
];

function SideBar() {
  return ( 
    <div className='flex flex-col gap-5 mx-3 relative top-25'>  
        {sidebarItems.map((item, idx) => { 
            return ( <Link to={item.path} key={idx} className='hover:bg-[#3D3D3D] rounded-xl flex items-center flex-col gap-2 w-23 py-2 cursor-pointer' onClick={() => (item.path)}>
              <item.icon className='w-8 h-8'/>
              <label htmlFor="Home" className='text-sm font-medium'>{item.label}</label>
            </Link>  
            )  
        })} 

    </div>
  )
}

export default SideBar