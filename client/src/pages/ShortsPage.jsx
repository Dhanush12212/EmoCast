import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar/NavBar';
import SideBar from '../components/NavBar/SideBar';
import { API_URL } from '../../config';
import { ThumbsUp, MessageCircle, Share2 } from 'lucide-react';

function ShortsPage() {
  const [shorts, setShorts] = useState([]);

  useEffect(() => {
    const fetchShorts = async () => {
      try {
        const res = await axios.get(`${API_URL}/allVideos/shorts`);
        setShorts(res.data.shorts);
      } catch (err) {
        console.error('Failed to load shorts:', err);
      }
    };
    fetchShorts();
  }, []);

  return (
    <div className="w-full h-screen bg-black text-white relative overflow-hidden">
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <NavBar />
      </div>

      {/* Sidebar */}
      <div className="fixed top-0 left-0 z-40">
        <SideBar />
      </div>

      {/* Shorts list */}
      <div className="h-screen overflow-y-scroll snap-y snap-mandatory pt-16">
        {shorts.map(({ videoId, title, likeCount, commentCount, thumbnail, channelTitle }) => (
          <div
            key={videoId}
            className="flex justify-center items-center h-screen snap-start"
          >
            <div className="flex items-center gap-4 mt-10">
              {/* Video Container */}
              <div className="relative w-[500px] max-w-[90%] h-[650px] bg-black rounded-xl shadow-lg overflow-hidden">
               <iframe
                  className="w-full h-full object-cover"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&enablejsapi=1&disablekb=1&fs=0&iv_load_policy=3`}
                  allow="autoplay; encrypted-media"
                  frameBorder="0"
                  allowFullScreen
                ></iframe> 
                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 p-4 text-white z-10 bg-gradient-to-t from-black via-transparent to-transparent">
                  <div className="flex items-center gap-2 ">
                    <img
                      src={thumbnail}
                      alt="Channel"
                      className="w-12 h-12 rounded-full object-cover border-red-500 border-1 "
                    />
                    <div className="text-lg font-semibold">@{channelTitle}</div>
                    <button className="ml-2 px-2 py-0.5 bg-white text-black text-xs rounded-full">
                      Subscribe
                    </button>
                  </div>
                  <div className="text-xl font-semibold mt-1">{title}</div>
                </div>
              </div>

              {/* Right-side icons (next to video, not overlayed) */}
              <div className="flex flex-col items-center gap-6 text-white">
                <div className="flex flex-col items-center">
                  <ThumbsUp className="w-8 h-8" />
                  <span className="text-md">{likeCount}</span>
                </div>
                <div className="flex flex-col items-center">
                  <MessageCircle className="w-8 h-8" />
                  <span className="text-md">{commentCount}</span>
                </div>
                <div className="flex flex-col items-center">
                  <Share2 className="w-8 h-8" />
                  <span className="text-md">Share</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShortsPage;
