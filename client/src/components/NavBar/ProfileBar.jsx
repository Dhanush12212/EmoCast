import React from 'react';
import { assets } from '../../assets/assets'; 
import { Link, useNavigate } from 'react-router-dom'; 
import { MdOutlineSwitchAccount, MdOutlineDarkMode } from "react-icons/md"; 
import { FaGoogle } from "react-icons/fa";
import { PiSignOut } from "react-icons/pi";
import axios from 'axios';
import { API_URL } from '../../../config'; 
import { useAuth } from '../Contexts/AuthContext'

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = async () => {
    try {
      await axios.put(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      localStorage.removeItem("user");
      console.log("Logout Successfully"); 
      navigate('/');
    } catch (error) {
      console.error("Logout Error: ", error.response ? error.response.data : error.message);
    }
  }; 

  return (
    <div className='h-auto bg-[#222222] lg:w-[300px] flex flex-col right-0 z-10 rounded-3xl left-0 '>
      <div className='flex gap-7 p-4'>
        <img
          src={ assets.Profile || user?.profilePic} 
          className="h-14 w-14 rounded-full object-cover cursor-pointer mt-2"
        />
        <Link to='/profile' className=''>
          <h1 className='text-xl font-semibold'>{user?.username || "Guest"}</h1>
          <p className='text-md '>{user?.email || "No Email"}</p>
          <p className='text-blue-500 mt-3 cursor-pointer text-xl font-semibold'>View your channel</p>
        </Link>
      </div>

      <div className='p-3 text-xl flex flex-col '>
        <div className='border-1 border-[#3c3c3c] w-full h-0 left-0'></div>

        <Link to='/login' className='flex gap-5 hover:bg-[#3E3E3E] rounded-xl p-3 items-center cursor-pointer'>
          <FaGoogle className='w-8 h-8'/>
          <span className='cursor-pointer'>Google Account</span>
        </Link>  

        <div onClick={handleLogout} className='flex gap-5 hover:bg-[#3E3E3E] rounded-xl p-3 items-center cursor-pointer'>
          <PiSignOut className='w-8 h-8'/>
          <span className='cursor-pointer'>Sign Out</span>
        </div> 

        <Link className='flex gap-5 hover:bg-[#3E3E3E] rounded-xl p-3 items-center cursor-pointer'>
          <MdOutlineDarkMode className='w-8 h-8'/>
          <span className='cursor-pointer'>Appearance: Dark Mode</span>
        </Link>  

        <div className='border-1 border-[#3c3c3c] w-full h-0 left-0'></div>
      </div> 
    </div>
  )
}

export default Profile;
