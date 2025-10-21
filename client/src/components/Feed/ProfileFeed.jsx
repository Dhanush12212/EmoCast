import React from 'react';
import { MdOutlineSwitchAccount } from "react-icons/md";
import { FaGoogle } from "react-icons/fa";
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
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
      console.error(
        "Logout Error: ",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleGoogleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full py-8 px-4 sm:px-6 md:px-10 bg-[#0f0f0f] text-white flex flex-col items-center gap-8 sm:gap-10 md:gap-12">

      {/* Profile Card */}
      <div className="w-full max-w-5xl bg-[#1f1f1f] rounded-3xl p-5 sm:p-6 md:p-10 flex flex-col md:flex-row items-center gap-5 sm:gap-8 md:gap-12 shadow-xl">
        <img
          src={user?.profilePic || assets.Profile}
          alt="Profile"
          className="h-28 w-28 sm:h-36 sm:w-36 md:h-44 md:w-44 rounded-full border-4 border-white object-cover shadow-lg"
        />

        <div className="flex flex-col gap-2 sm:gap-3 items-center md:items-start text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold break-words max-w-[90%]">
            {user?.username || "Guest"}
          </h1>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg break-words max-w-[90%]">
            {user?.email || "No Email"}
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4 mt-4">
            {/* Google Account */}
            {!user ? (
              <button
                onClick={handleGoogleLogin}
                className="flex items-center gap-2 px-4 sm:px-5 py-2 bg-[#3a3a3a] hover:bg-[#4f4f4f] rounded-full transition-all text-xs sm:text-sm font-medium"
              >
                <FaGoogle className="w-4 h-4 sm:w-5 sm:h-5" />
                Login with Google
              </button>
            ) : (
              <div className="flex items-center gap-2 px-4 sm:px-5 py-2 bg-green-600 rounded-full text-xs sm:text-sm font-medium">
                <FaGoogle className="w-4 h-4 sm:w-5 sm:h-5" />
                Connected via Google
              </div>
            )}

            {/* Logout Button */}
            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 sm:px-5 py-2 bg-red-600 hover:bg-red-700 rounded-full transition-all text-xs sm:text-sm font-medium"
              >
                <MdOutlineSwitchAccount className="w-4 h-4 sm:w-5 sm:h-5" />
                Logout
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Watch Later Section */}
      {user && (
        <div className="w-full max-w-6xl px-2 sm:px-4 md:px-0">
          <WatchLater />
        </div>
      )}
    </div>
  );
}

export default ProfileFeed;
