import React, { useEffect, useState } from 'react';
import { sidebarItems } from '../../constants';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../../config';
import WebCamCapture from '../WebCam/WebCamCapture';

function SideFullBar() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("user"));

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await axios.get(`${API_URL}/subscribe/fetchChannels`, {
          withCredentials: true,
        });
        setChannels(response.data.subscribedChannels || []);
      } catch (error) {
        console.log("Failed to fetch the channels", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  return (
    <div className="bg-[#121212] w-full sm:w-64 md:w-72 lg:w-80 px-3 sm:px-4 md:px-6 py-3 h-full text-white transition-all duration-300">

      {/* Sidebar items */}
      {sidebarItems.map((item, idx) => {
        if (item.divider)
          return <div key={idx} className="border border-[#222222] my-2"></div>;

        return (
          <Link
            to={item.path}
            key={idx}
            className="flex items-center gap-3 sm:gap-4 md:gap-5 hover:bg-[#3D3D3D] p-2 sm:p-3 rounded-xl cursor-pointer transition-all duration-200"
          >
            <item.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
            <span className="text-sm sm:text-base md:text-lg font-medium truncate">
              {item.label}
            </span>
          </Link>
        );
      })}

      {/* Webcam section */}
      <div className="mt-3 sm:mt-4">
        <WebCamCapture />
      </div>

      {/* Subscriptions Header */}
      <p className="m-4 text-base sm:text-lg md:text-xl font-semibold">Subscriptions</p>

      {/* Subscriptions List */}
      {loading ? (
        <p className="text-gray-400 text-xs sm:text-sm mt-2">Loading subscriptions...</p>
      ) : channels.length === 0 ? (
        <p
          className={`m-4 px-3 py-2 rounded-lg text-xs sm:text-sm md:text-base font-medium w-fit
            ${
              isLoggedIn
                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}
        >
          {isLoggedIn ? "📭 No Channel Subscribed" : "Login is required"}
        </p>
      ) : (
        channels.map((channel) => (
          <div
            key={channel.channelId}
            onClick={() => navigate(`/channel/${channel.channelId}`)}
            className="flex items-center gap-3 sm:gap-4 md:gap-5 hover:bg-[#3D3D3D] p-2 sm:p-3 rounded-xl cursor-pointer transition-all duration-200"
          >
            <img
              src={channel.channelThumbnail}
              alt="Profile"
              className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full object-cover"
            />
            <span className="text-sm sm:text-base md:text-lg font-medium truncate">
              {channel.channelTitle}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

export default SideFullBar;
