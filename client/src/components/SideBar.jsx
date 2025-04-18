import React from 'react'
import { GoHomeFill } from "react-icons/go";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions } from "react-icons/md"; 
import { CgProfile } from "react-icons/cg";

function SideBar() {
  return (
    // <div className='bg-[#070707] lg:w-[17%] md:w-[30%] sm:w-[40%] px-6 py-4'>
    <div className='p-3 '> 

        {/* Home */}
        <div className='items-center text-center hover:bg-[#3D3D3D] p-3 rounded-xl'>
            <GoHomeFill className='w-8 h-8 mb-1'/>
            <label htmlFor="Home" className='text-sm font-medium'>Home</label>
        </div>

        {/* Shorts */}
        <div className='items-center text-center hover:bg-[#3D3D3D] p-3 rounded-xl'>
            <SiYoutubeshorts className='w-8 h-8 mb-1'/>
            <label htmlFor="Home" className='text-sm font-medium'>Shorts</label>
        </div>  

        {/* Subscription */}
        <div className='items-center text-center hover:bg-[#3D3D3D] p-3 rounded-xl'>
            <MdOutlineSubscriptions className='w-8 h-8 mb-1'/>
            <label htmlFor="Home" className='text-sm font-medium'>Subscription</label>
        </div> 

        {/* Profile */}
        <div className='items-center text-center hover:bg-[#3D3D3D] p-3 rounded-xl'>
            <CgProfile className='w-8 h-8 mb-1'/>
            <label htmlFor="Home" className='text-sm font-medium'>Profile</label>
        </div> 
 
    </div>
  )
}

export default SideBar