import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import API_URL from '../../config';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VideoMenu from './VideoMenu';

function VideoCard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videos, setVideos] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null); // Reference for the video menu

  // Effect for fetching videos
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${API_URL}/playlist/videos`);
        setVideos(response.data.videos);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch videos");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []); // Empty dependency means this will run once when the component mounts

  // Handle menu toggling
  const handleMenuToggle = (id) => {
    setOpenMenuId(openMenuId === id ? null : id); // Toggle the menu for each video
  };

  // Handle clicks outside the menu
  const handleOutsideClick = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setOpenMenuId(null); // Close the menu if clicked outside
    }
  };

  // Adding event listener to close the menu if clicked outside
  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick); // Cleanup event listener
    };
  }, []);

  // Ensure hooks are not being conditionally rendered based on state
  if (loading) return <p>Loading Videos.....</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-wrap justify-around gap-8 mt-5 px-6">
      {videos.map(({ videoId, thumbnailUrl, title, channelThumbnailUrl, channelTitle, views, publishDate }) => (
        <div
          key={videoId}
          className="w-full sm:w-[48%] lg:w-[32%] xl:w-[30%] h-[300px] rounded-2xl flex flex-col shadow-md cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg duration-300"
        >
          {/* Video Thumbnail */}
          <img
            src={thumbnailUrl}
            alt="video"
            className="w-full h-[65%] rounded-t-2xl object-cover"
          />

          {/* Video Information */}
          <div className="py-3 flex justify-between">
            <div className="flex gap-3">
              <div className="h-14 w-14 flex justify-center items-center rounded-full overflow-hidden border border-red-400 shrink-0">
                <img
                  src={channelThumbnailUrl}
                  alt={channelTitle}
                  className="w-full h-full object-cover rounded"
                />
              </div>

              <div>
                <h1 className="text-xl font-semibold leading-tight">{title}</h1>
                <p className="text-lg text-gray-400 mt-2">{channelTitle}</p>
                <div className="flex gap-3 text-lg text-gray-400">
                  <p>{views}</p>
                  <span>-</span>
                  <p>{publishDate}</p>
                </div>
              </div>
            </div>

            {/* More Options */}
            <div className="relative">
              <button onClick={() => handleMenuToggle(videoId)}>
                <MoreVertIcon style={{ fontSize: "25px", cursor: "pointer" }} />
              </button>

              {openMenuId === videoId && (
                <div
                  ref={menuRef} // Use the ref to target the menu
                  className="z-40 w-40 bg-[#282828] rounded-lg text-[#F1F1F1] shadow-md absolute top-12 right-0"
                >
                  <VideoMenu />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default VideoCard;
