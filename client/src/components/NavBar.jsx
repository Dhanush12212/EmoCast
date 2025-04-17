import React, { useState } from 'react';
import { MdMic } from 'react-icons/md';
import { MdAdd } from 'react-icons/md'; 
import { IoSearchOutline } from 'react-icons/io5'; 
import { IoReorderThreeOutline } from 'react-icons/io5';
import { assets } from '../assets/assets';
import { FaRegBell } from 'react-icons/fa';  

function NavBar() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="flex items-center justify-around w-full px-5 py-3  ">

      {/* Hamburger icon */}
      <IoReorderThreeOutline className="w-10 h-12 text-white" />
      
      {/* YouTube logo */}
      <img className="w-42" src={assets.YouTube} alt="YouTube Logo" />
      
      {/* Search bar */}
      <div className="flex mx-5 border border-[#222222] w-full h-14 bg-[#222222] pr-5 rounded-full items-center">
        <input
          className="border border-[#222222]  w-full outline-none px-5 py-2 h-14 text-xl rounded-l-full bg-[#121212] hover:border-blue-700"
          placeholder="Search"
          type="search"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <IoSearchOutline className="w-9 h-10 text-white ml-5 mr-3" /> 
      </div > 
      
      <div className='border rounded-full bg-[#222222] p-2 h-12 '>
        <MdMic className="w-8 h-8 text-white " />
      </div>

      <div className='border rounded-full bg-[#222222] py-2 px-3 flex h-12 m-3 w-36 items-center'> 
        <MdAdd className="w-8 h-8 text-white" />
        <button className='text-lg font-semibold text-[#A1A1A1]'>Create</button>
      </div>

      <div className='p-2 h-12 '>
        <FaRegBell className="w-8 h-8 text-white " />
      </div>

    </div>
  );
}

export default NavBar;
