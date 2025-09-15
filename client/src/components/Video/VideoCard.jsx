import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../../config';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VideoMenu from './VideoMenu';
import LoaderOrError from '../Reausables/LoaderOrError';
import { useEmotion } from '../Contexts/EmotionContext';

function VideoCard({ selectedCategory, category }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videos, setVideos] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { query } = useParams();
  const { emotion } = useEmotion(); // ✅ Emotion context (best emotion from webcam)

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);

      try { 
        if (emotion && typeof emotion === "string" && emotion !== "unknown" && emotion !== "none") {
          console.log("Fetching videos for emotion:", emotion);
          const response = await axios.get(
            `${API_URL}/emotion/fetchVideosByEmotion`,
            { params: { emotion }, withCredentials: true }
          );
          setVideos(response.data.videos || []);
          setLoading(false);
          return;
        }
 
        let url = `${API_URL}/allVideos/videos`;
        let params = {};

        if (query) {
          url = `${API_URL}/searchVideos/search`;
          params = { q: query };
        } else if (selectedCategory) {
          url = `${API_URL}/allVideos/byCategory/${selectedCategory}`;
        } else if (category) {
          url = `${API_URL}/searchVideos/search`;
          params = { q: category };
        }

        const response = await axios.get(url, { params, withCredentials: true });
        setVideos(response.data.videos || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch videos!');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [query, selectedCategory, category, emotion]);  
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6 px-3 sm:px-4 lg:px-6">
          {videos.length === 0 ? (
            <p className="text-center text-gray-400 text-lg mt-10 italic">
              {query
                ? `No videos found matching "${query}"`
                : emotion && emotion !== "unknown" && emotion !== "none"
                ? `No videos found for mood "${emotion}"`
                : 'No videos available.'}
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
                <div className="relative aspect-video overflow-hidden">
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
                <div className="p-4">
                  <h1 className="text-white text-base font-semibold leading-snug line-clamp-2 w-full">
                    {video.title}
                  </h1>

                  <div className="flex items-center gap-3 mt-2">
                    {/* Channel Thumbnail */}
                    <div
                      className="w-9 h-9 rounded-full overflow-hidden border border-gray-600 bg-gradient-to-tr from-gray-800 to-gray-900 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/channel/${video.channelId}`);
                      }}
                    >
                      {video.channelThumbnail ? (
                        <img
                          src={video.channelThumbnail}
                          alt={video.channelTitle}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="flex justify-center items-center w-full h-full font-bold text-sm text-gray-300">
                          {video.channelTitle?.charAt(0)}
                        </span>
                      )}
                    </div>

                    {/* Channel Info */}
                    <div className="flex-1">
                      <p className="text-sm text-gray-400">{video.channelTitle}</p>
                      <div className="text-xs text-gray-500 flex gap-2 items-center">
                        <span>{video.viewCount}</span>
                        <span>&bull;</span>
                        <span>{video.publishDate}</span>
                      </div>
                    </div>

                    {/* More Button */}
                    <div className="relative">
                      <button
                        onClick={() => handleMenuToggle(video.videoId)}
                        className="menu-btn"
                      >
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
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}

export default VideoCard;
