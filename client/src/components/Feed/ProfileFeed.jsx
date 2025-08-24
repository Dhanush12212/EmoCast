import React from 'react';
import { MdOutlineSwitchAccount } from "react-icons/md";
import { FaGoogle } from "react-icons/fa";
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import WatchLater from '../Video/WatchLater';
import { API_URL } from '../../../config';
import axios from 'axios';

function ProfileFeed() {
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
    <div className="min-h-screen w-full py-10 bg-[#0f0f0f] text-white flex flex-col items-center gap-12">

      {/* Profile Card */}
      <div className="w-full max-w-5xl bg-[#1f1f1f] rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-12 shadow-xl">
        <img
          src={user?.profilePic}
          alt="Profile"
          className="h-36 w-36 md:h-44 md:w-44 rounded-full border-4 border-white object-cover shadow-lg text-center"
        />

        <div className="flex flex-col gap-3 items-center md:items-start text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold">{user?.username || "Guest"}</h1>
          <p className="text-gray-400 text-lg">{user?.email || "No Email"}</p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
            {/* Google Account */}
            <Link
              to="/login"
              className="flex items-center gap-2 px-5 py-2 bg-[#3a3a3a] hover:bg-[#4f4f4f] rounded-full transition-all text-sm font-medium"
            >
              <FaGoogle className="w-5 h-5" />
              Google Account
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 rounded-full transition-all text-sm font-medium"
            >
              <MdOutlineSwitchAccount className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Watch Later Section */}
      <div className="mr-30 shadow-md"> 
        <WatchLater />
      </div>
    </div>
  );
}

export default ProfileFeed;
  