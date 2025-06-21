import React from 'react';
import { MdOutlineSwitchAccount } from "react-icons/md";
import { FaGoogle } from "react-icons/fa"; 
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import WatchLater from '../Video/WatchLater';

function ProfileFeed() {
  return (
    <div className="min-h-screen w-full px-6 py-10 bg-[#0f0f0f] text-white flex flex-col items-center gap-10">

      {/* Profile Section */}
      <div className="w-full max-w-5xl bg-[#1c1c1c] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-10 shadow-md justify-center">
        <img
          src={assets.Subscription}
          alt="Profile"
          className="h-36 w-36 md:h-40 md:w-40 rounded-full border-4 border-white object-cover"
        />

        <div className="flex flex-col gap-3 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold">Dhanush Moagaveer</h1>
          <p className="text-gray-400 text-lg">@dhanushmogaveer5316</p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3">
            <Link
              to="/register"
              className="flex items-center gap-2 px-5 py-2 bg-[#272727] hover:bg-[#3F3F3F] rounded-full transition-all"
            >
              <MdOutlineSwitchAccount className="w-5 h-5" />
              <span>Switch Account</span>
            </Link>

            <Link
              to="/login"
              className="flex items-center gap-2 px-5 py-2 bg-[#272727] hover:bg-[#3F3F3F] rounded-full transition-all"
            >
              <FaGoogle className="w-5 h-5" />
              <span>Google Account</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Watch Later Section */} 

    <div className="shadow-md pr-15">
      <WatchLater />
    </div> 
    </div>
  );
}

export default ProfileFeed;
