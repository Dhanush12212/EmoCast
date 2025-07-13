import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../../config';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CiBookmarkRemove } from "react-icons/ci";
import VideoMenu from './VideoMenu';
import LoaderOrError from '../Reausables/LoaderOrError';
import { assets } from '../../assets/assets';
import NavBar from '../NavBar/NavBar';
import SideBar from '../NavBar/SideBar';

function WatchLater() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/watchLater/videos`, {
          withCredentials: true,
        });

        const cleanedVideos = Array.isArray(response.data)
          ? response.data.filter(video => video && video.videoId)
          : [];

        setVideos(cleanedVideos);
      } catch (error) {
        if (error?.response?.status === 401) {
          navigate('/login');
        } else {
          console.error("ERROR:", error);
          setError(error.response?.data?.message || "Failed to fetch videos!!");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [navigate]);

  const handleDelete = async (videoId) => { 
    try {
      await axios.delete(`${API_URL}/watchLater/delete/${videoId}`, {
        withCredentials: true,
      });
      setVideos(prev => prev.filter(video => video.videoId !== videoId));
    } catch (err) {
      console.error('Error deleting video:', err);
    }
  };

  const handleMenuToggle = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleOutsideClick = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setOpenMenuId(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Fixed NavBar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <NavBar />
      </div>

      <div className="flex flex-1 pt-25">
        {/* Fixed Sidebar */}
        <div className="fixed left-0 top-0 w-64">
          <SideBar />
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64 overflow-x-hidden">
          <div className="w-full min-h-screen bg-[#0f0f0f] text-white px-10 py-2">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">📺 Watch Later</h1>
            <LoaderOrError loading={loading} error={error} />
            {!loading && !error && (
              videos.length === 0 ? (
                <div className="text-center text-gray-400 mt-16 text-xl">
                  <p>No videos added to your Watch Later list.</p>
                  <p className="text-sm mt-2">Start exploring and save videos you want to watch later!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {videos.map((video) => (
                    <div
                      key={video.videoId}
                      className="bg-[#1a1a1a] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                    >
                      <div className="w-full h-[180px] overflow-hidden relative">
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover"
                          onClick={() => navigate(`/videos/${video.videoId}`)}
                        />
                        {video.duration && (
                          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-sm px-1.5 py-0.5 rounded-md">
                            {video.duration}
                          </span>
                        )}
                      </div>

                      <div className="flex items-start justify-between gap-3 p-4 relative">
                        <div className="flex gap-3">
                          <img
                            src={video.channelThumbnail || assets.Subscription}
                            alt="Channel"
                            className="h-10 w-10 rounded-full object-cover border"
                            onClick={() => navigate(`/channel/${video.channelId}`)}
                          />
                          <div className="flex flex-col">
                            <h2 className="text-lg font-medium text-white line-clamp-2">{video.title}</h2>
                            <p className="text-sm text-gray-400 mt-1 line-clamp-1">{video.channelTitle}</p>
                            <div className="flex flex-wrap gap-2 text-sm text-gray-500 mt-1">
                              <span>{video.viewCount || 'N/A'}</span>
                              <span>&bull;</span>
                              <span>{video.publishAt ? new Date(video.publishAt).toLocaleDateString() : 'Unknown date'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="relative">
                          <button
                            aria-label="Open video options menu"
                            onClick={() => handleMenuToggle(video.videoId)}
                            className="menu-btn"
                          >
                            <MoreVertIcon style={{ fontSize: '25px', cursor: 'pointer' }} />
                          </button>
                          {openMenuId === video.videoId && (
                            <div
                              ref={menuRef}
                              onClick={(e) => e.stopPropagation()}
                              onMouseDown={(e) => e.stopPropagation()}
                              className="absolute right-0 z-50"
                            >
                              <div
                                className="flex w-40 bg-[#282828] rounded-lg text-[#F1F1F1] text-lg font-medium py-2 shadow-lg gap-3 hover:bg-gray-700 justify-center"
                                onClick={() => handleDelete(video.videoId)}
                              >
                                <CiBookmarkRemove className="w-6 h-6" />
                                <span>Remove</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WatchLater;
