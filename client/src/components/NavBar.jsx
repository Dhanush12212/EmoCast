import React, { useState } from 'react';
import { MdMic } from 'react-icons/md';
import { MdAdd } from 'react-icons/md'; 
import { IoSearchOutline } from 'react-icons/io5'; 
import { IoReorderThreeOutline } from 'react-icons/io5';
import { assets } from '../assets/assets';
import { FaRegBell } from 'react-icons/fa';  
import SideFullBar from './SideFullBar'; 
import ProfileBar from './ProfileBar';

function NavBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
     <div className="flex items-center justify-between w-full px-6 py-0 z-10 fixed top-0 bg-[#121212]">
      
      {/* div #1 */}
      <div className='flex w-[12%] items-center justify-around'>
        {/* Hamburger icon */}
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <IoReorderThreeOutline className="w-12 h-12 text-white hover:bg-[#222222] rounded-full cursor-pointer hover:p-2" />
        </button>  

        {/* Sidebar */}
        {isSidebarOpen && (
          <div className="fixed top-20 left-0 h-full z-40">
            <SideFullBar/>
          </div>
        )}
 
        {/* YouTube logo */}
        <img className="w-42 " src={assets.YouTube} alt="YouTube Logo" />
      </div> 
      
      {/* div #2 */}
      <div className='flex min-w-[50%] items-center'> 
        {/* Search bar */}
        <div className="flex mx-5 border border-[#383838] w-full h-14 bg-[#222222] pr-4 rounded-full items-center">
          <input
            className="border border-[#222222] w-full outline-none pl-10 pr-2 py-2 h-14 text-xl rounded-l-full bg-[#121212] hover:border-blue-700"
            placeholder="Search"
            type="search"
            value={searchTerm}
            onChange={handleSearchChange}
            />
          <IoSearchOutline className="w-9 h-10 text-white ml-5 mr-3" /> 
        </div > 
      
        {/* Mic */}
        <div className='border-0 rounded-full bg-[#222222] p-2 h-12 hover:bg-[#3F3F3F] hover:rounded-full'>
          <MdMic className="w-8 h-8 text-white " />
        </div>
      </div>

      {/* div #3 */}
      <div className="flex items-center justify-end gap-6 w-[25%]">
        <div className="flex items-center gap-3 bg-[#222222] hover:bg-[#3F3F3F] px-5 py-3 rounded-full cursor-pointer">
          <MdAdd className="text-white w-8 h-8" />
          <span className="text-white text-xl font-bold">Create</span>
        </div>
        <div className='p-2 h-12 hover:bg-[#3F3F3F] hover:rounded-full'>
          <FaRegBell className="w-8 h-8 text-white " />
        </div>

        <button onClick={() => setIsProfileOpen(!isProfileOpen)}> 
          <img
            src={assets.Profile}
            alt="Profile"
            className="h-12 w-12 rounded-full object-cover cursor-pointer"
          />
        </button>  

        {/* Sidebar */}
        {isProfileOpen && (
          <div className="fixed top-3 right-25 z-40"> 
            <ProfileBar/>
          </div>
        )}

      </div>
    </div>
  );
}

export default NavBar;
