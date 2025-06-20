import SampleVideo from '../SampleVideo'
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../../config';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VideoMenu from './VideoMenu';
import LoaderOrError from '../LoaderOrError'; 
    
function WatchLater() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [videos, setVideos] = useState([]);
    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const { query } = useParams();
    return (
    <div className='w-full h-screen'>
        <h1 className='text-4xl font-bold text-gray-400 mb-10 mt-5 ml-5'>Watch later videos</h1>
        <div className='border-1 border-[#3c3c3c] w-full h-0 left-0'></div> 

        {/* videos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10 mt-5 px-6">
          {videos.length === 0 ? (
            <p className="text-center text-gray-400 text-lg mt-10 italic">
              {query ? `No videos found matching "${query}"` : 'No videos available.'}
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
                className="relative h-[300px] rounded-2xl flex flex-col shadow-md cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg duration-300"
              >
                {/* Thumbnail */}
                <div className="relative w-full h-full rounded-t-2xl overflow-hidden">
                  <img src={video.thumbnailUrl} alt="video" className="w-full h-full object-cover" />
                  {video.duration && (
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-sm px-1.5 py-0.5 rounded-md">
                      {video.duration}
                    </span>
                  )}
                </div>

                {/* Info Section */}
                <div className="py-3 flex justify-between relative">
                  <div className="flex gap-3">
                    <div className="h-14 w-14 relative flex justify-center items-center rounded-full overflow-hidden border border-red-400 shrink-0 bg-gradient-to-tr from-gray-800 to-gray-900">
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
                          className="absolute font-semibold text-2xl uppercase text-gray-300 cursor-pointer"
                        >
                          {video.channelTitle?.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h1 className="text-xl font-semibold leading-tight line-clamp-2">{video.title}</h1>
                      <p className="text-lg text-gray-400 mt-2">{video.channelTitle}</p>
                      <div className="flex gap-3 text-lg text-gray-400">
                        <p>{video.viewCount}</p>
                        &bull;
                        <p>{video.publishDate}</p>
                      </div>
                    </div>
                  </div>

                  {/* More Menu */}
                  <div className="relative">
                    <button onClick={() => handleMenuToggle(video.videoId)} className="menu-btn">
                      <MoreVertIcon style={{ fontSize: '25px', cursor: 'pointer' }} />
                    </button>
                    {openMenuId === video.videoId && (
                      <div
                        ref={menuRef}
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="absolute top-6 right-0 z-50"
                      >
                        <VideoMenu
                          video={video}
                          closeMenu={() => setOpenMenuId(null)} 
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
    </div>
  )
}

export default WatchLater