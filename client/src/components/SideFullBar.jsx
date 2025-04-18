import React from 'react'
import { GoHomeFill } from "react-icons/go";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions, MdOutlineWatchLater, MdOutlinePlaylistPlay, MdOndemandVideo } from "react-icons/md";
import { FaHistory } from "react-icons/fa";  
import { AiOutlineLike } from "react-icons/ai"; 
import { CgProfile } from "react-icons/cg";

function SideFullBar() {
  return ( 
    <div className='bg-[#070707] w-80 px-6 py-3 h-full'> 

        {/* Home */}
        <div className='flex items-center gap-5 hover:bg-[#3D3D3D] p-3 rounded-xl'>
            <GoHomeFill className='w-8 h-8'/>
            <label htmlFor="Home" className='text-xl font-medium'>Home</label>
        </div>

        {/* Shorts */}
        <div className='flex items-center gap-5 hover:bg-[#3D3D3D] p-3 rounded-xl'>
            <SiYoutubeshorts className='w-8 h-8'/>
            <label htmlFor="Home" className='text-xl font-medium'>Shorts</label>
        </div> 

        {/* Subscription */}
        <div className='flex items-center gap-5 hover:bg-[#3D3D3D] p-3 rounded-xl'>
            <MdOutlineSubscriptions className='w-8 h-8'/>
            <label htmlFor="Home" className='text-xl font-medium'>Subscription</label>
        </div> 

        <div className='border-[1.5px] border-[#222222]'></div>  

        <h1 className='text-2xl font-medium my-5 mx-2'>You</h1>

        {/* History */}
        <div className='flex items-center gap-5 hover:bg-[#3D3D3D] p-3 rounded-xl'>
            <FaHistory className='w-8 h-8'/>
            <label htmlFor="Home" className='text-xl font-medium'>History</label>
        </div>    

        {/* PlayList */}
        <div className='flex items-center gap-5 hover:bg-[#3D3D3D] p-3 rounded-xl'>
            <MdOutlinePlaylistPlay className='w-8 h-8 '/>
            <label htmlFor="Home" className='text-xl font-medium'>Playlists</label>
        </div>   

        {/* Your Videos */}
        <div className='flex items-center gap-5 hover:bg-[#3D3D3D] p-3 rounded-xl'>
            <MdOndemandVideo className='w-8 h-8'/>
            <label htmlFor="Home" className='text-xl font-medium'>Your Videos</label>
        </div>   

        {/* Watch Later */}
        <div className='flex items-center gap-5 hover:bg-[#3D3D3D] p-3 rounded-xl'>
            <MdOutlineWatchLater className='w-8 h-8'/>
            <label htmlFor="Home" className='text-xl font-medium'>Watch Later</label>
        </div>   

        {/* Liked Videos */}
        <div className='flex items-center gap-5 hover:bg-[#3D3D3D] p-3 rounded-xl'>
            <AiOutlineLike className='w-8 h-8'/>
            <label htmlFor="Home" className='text-xl font-medium'>Liked Videos</label>
        </div>    
        <div className='border-[1.5px] border-[#222222]'></div>  

        {/* SubScription */}
        <h1 className='text-2xl font-medium my-5 mx-2'>Subscription</h1> 

        <div className='flex items-center gap-5 hover:bg-[#3D3D3D] p-3 rounded-xl'>
            <CgProfile className='w-8 h-8'/>
            <label htmlFor="Home" className='text-xl font-medium'>CodeWithHarry</label>
        </div>    
        <div className='flex items-center gap-5 hover:bg-[#3D3D3D] p-3 rounded-xl'>
            <CgProfile className='w-8 h-8'/>
            <label htmlFor="Home" className='text-xl font-medium'>Apna College</label>
        </div>    
        <div className='flex items-center gap-5 hover:bg-[#3D3D3D] p-3 rounded-xl'>
            <CgProfile className='w-8 h-8'/>
            <label htmlFor="Home" className='text-xl font-medium'>Tech in Kannada</label>
        </div>    
        <div className='flex items-center gap-5 hover:bg-[#3D3D3D] p-3 rounded-xl'>
            <CgProfile className='w-8 h-8'/>
            <label htmlFor="Home" className='text-xl font-medium'>Technical Guruji</label>
        </div>    
        <div className='flex items-center gap-5 hover:bg-[#3D3D3D] p-3 rounded-xl'>
            <CgProfile className='w-8 h-8'/>
            <label htmlFor="Home" className='text-xl font-medium'>Chai aur Code</label>
        </div>    
    </div>
  )
}

export default SideFullBar