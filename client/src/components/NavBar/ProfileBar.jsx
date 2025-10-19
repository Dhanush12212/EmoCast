import React from 'react';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineDarkMode } from 'react-icons/md';
import { FaGoogle } from 'react-icons/fa';
import { PiSignOut } from 'react-icons/pi';
import axios from 'axios';
import { API_URL } from '../../../config';

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = async () => {
    try {
      await axios.put(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      localStorage.removeItem('user');
      console.log('Logout Successfully');
      navigate('/');
    } catch (error) {
      console.error(
        'Logout Error: ',
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="bg-[#222222] text-white w-[90vw] sm:w-[320px] rounded-2xl shadow-lg overflow-hidden border border-[#3a3a3a]">
      {/* Profile Header */}
      <div className="flex items-center gap-4 p-4 border-b border-[#3c3c3c]">
        <img
          src={user?.profilePic || assets.Profile}
          alt="Profile"
          className="h-14 w-14 rounded-full object-cover border border-gray-600"
        />
        <div>
          <h1 className="text-lg font-semibold">{user?.username || 'Guest'}</h1>
          <p className="text-sm text-gray-400">{user?.email || 'No Email'}</p>
          <Link
            to="/profile"
            className="text-blue-500 mt-1 block text-sm hover:underline"
          >
            View your channel
          </Link>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex flex-col text-base">
        <Link
          to="/login"
          className="flex items-center gap-4 hover:bg-[#3E3E3E] p-3 transition rounded-lg"
        >
          <FaGoogle className="w-6 h-6" />
          <span>Google Account</span>
        </Link>

        <div
          onClick={handleLogout}
          className="flex items-center gap-4 hover:bg-[#3E3E3E] p-3 transition rounded-lg cursor-pointer"
        >
          <PiSignOut className="w-6 h-6" />
          <span>Sign Out</span>
        </div>

        <div className="flex items-center gap-4 hover:bg-[#3E3E3E] p-3 transition rounded-lg cursor-pointer">
          <MdOutlineDarkMode className="w-6 h-6" />
          <span>Appearance: Dark Mode</span>
        </div>
      </div>
    </div>
  );
}

export default Profile;
