import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../../config';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VideoMenu from './VideoMenu';
import LoaderOrError from '../LoaderOrError';

function VideoCard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videos, setVideos] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { query } = useParams();   

  const playVideo = (id) => {
    navigate(`/videos/${id}`);
  };

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);

      try {
        let response;
        if (query) { 
          response = await axios.get(`${API_URL}/searchVideos/search`, {
            params: { q: query }
          });
        } else { 
          response = await axios.get(`${API_URL}/playlist/videos`);
        }

        setVideos(response.data.videos || []);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch videos!!');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [query]);  

  const handleMenuToggle = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Close menu if clicked outside
  const handleOutsideClick = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setOpenMenuId(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <>
      <LoaderOrError loading={loading} error={error} />
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-5 px-6">
          {videos.length === 0 ? (
            <p className="text-center text-gray-400 text-lg mt-10 italic">
              {query ? `No videos found matching "${query}"` : 'No videos available.'}
            </p>
          ) : (
            videos.map(
              ({
                videoId,
                thumbnailUrl,
                title,
                channelThumbnail,
                channelTitle,
                channelInitial,
                viewCount,
                publishDate,
              }) => (
                <div
                  key={videoId}
                  onClick={(e) => {
                    if (!e.target.closest('.menu-btn')) {
                      playVideo(videoId);
                    }
                  }}
                  className="h-[300px] rounded-2xl flex flex-col shadow-md cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg duration-300"
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
                        {channelThumbnail ? (
                          <img
                            src={channelThumbnail}
                            alt={channelTitle}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-300 text-white font-semibold text-lg uppercase">
                            {channelInitial}
                          </div>
                        )}
                      </div> 
                      <div>
                        <h1 className="text-xl font-semibold leading-tight line-clamp-2">
                          {title}
                        </h1>

                        <p className="text-lg text-gray-400 mt-2">{channelTitle}</p>
                        <div className="flex gap-3 text-lg text-gray-400">
                          <p>{viewCount}</p>
                          &bull;
                          <p>{publishDate}</p>
                        </div>
                      </div>
                    </div>

                    {/* More Options */}
                    <div className="relative">
                      <button onClick={() => handleMenuToggle(videoId)} className="menu-btn">
                        <MoreVertIcon style={{ fontSize: '25px', cursor: 'pointer' }} />
                      </button>

                      {openMenuId === videoId && (
                        <div
                          ref={menuRef}
                          className="z-40 w-40 bg-[#282828] rounded-lg text-[#F1F1F1] shadow-md absolute top-12 right-0"
                        >
                          <VideoMenu />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            )
          )}
        </div>
      )}
    </>
  );
}

export default VideoCard;
