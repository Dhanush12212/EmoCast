import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../../config';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VideoMenu from './VideoMenu';
import LoaderOrError from '../Reausables/LoaderOrError'; 
import Swal from "sweetalert2";


function SubscribedVideos() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videos, setVideos] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate(); 
  const isLoggedIn = Boolean(localStorage.getItem("user"));

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);

      try {
        let response = await axios.get(`${API_URL}/subscribe/fetchVideos`, {
          withCredentials: true
        }); 
        setVideos(response.data.videos || []);
      } catch (error) {
          Swal.fire({
          icon: "info",
          title: "🔒 Login Required",
          text: "You need to log in before syncing your emotions.",
          confirmButtonText: "Okay",
          confirmButtonColor: "#e50914", 
          background: "#1e1e1e",  
          color: "#fff",
        });
        navigate("/");
        return;
        setError(error.response?.data?.message || 'Failed to fetch videos!!');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

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
    <>
      <LoaderOrError loading={loading} error={error} />
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-6 px-4 md:px-8">
          {videos.length === 0 ? (
            <p className="text-center text-gray-400 text-lg mt-10 italic"> 
              No videos available.
            </p>
          ) : (
            videos.map((video) => (
              <div
                key={video.videoId}
                onClick={(e) => {
                  if (!e.target.closest('.menu-btn')) {
                    navigate(`/videos/${video.videoId}`);
                  }
                }}
                className="group bg-[#1e1e1e] rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-[1.03] duration-300 cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="relative h-[180px] md:h-[200px] overflow-hidden">
                  <img
                    src={video.thumbnailUrl}
                    alt="video thumbnail"
                    className="w-full h-full object-cover rounded-t-2xl group-hover:brightness-110 transition-all duration-300"
                  />
                  {video.duration && (
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </span>
                  )}
                </div>

                {/* Info Section */}
                <div className="flex p-4 gap-4">
                  {/* Channel Thumbnail */}
                  <div className="w-14 h-14 relative rounded-full overflow-hidden border border-gray-600 bg-gradient-to-tr from-gray-800 to-gray-900 shrink-0">
                    {video.channelThumbnail ? (
                      <img
                        src={video.channelThumbnail}
                        alt={video.channelTitle}
                        className="w-full h-full object-cover"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/channel/${video.channelId}`);
                        }}
                      />
                    ) : (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/channel/${video.channelId}`);
                        }}
                        className="absolute inset-0 flex justify-center items-center font-bold text-xl text-gray-300"
                      >
                        {video.channelTitle?.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Video Text Info */}
                  <div className="flex-1">
                    <h1 className="text-white text-base font-semibold leading-snug line-clamp-2">
                      {video.title}
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">{video.channelTitle}</p>
                    <div className="text-xs text-gray-500 mt-0.5 flex gap-2 items-center">
                      <span>{video.viewCount}</span>
                      <span>&bull;</span>
                      <span>{video.publishDate}</span>
                    </div>
                  </div>

                  {/* More Button */}
                  <div className="relative">
                    <button onClick={() => handleMenuToggle(video.videoId)} className="menu-btn">
                      <MoreVertIcon style={{ fontSize: '22px' }} />
                    </button>
                    {openMenuId === video.videoId && (
                      <div
                        ref={menuRef}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-3 right-0 z-50"
                      >
                        <VideoMenu video={video} closeMenu={() => setOpenMenuId(null)} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}

export default SubscribedVideos;
