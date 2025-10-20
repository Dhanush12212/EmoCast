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

    // Lock scroll on body
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="w-full h-screen bg-black text-white relative overflow-hidden">
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <NavBar />
      </div>

      {/* Sidebar */}
      <div className="hidden md:block fixed top-0 left-0 z-40">
        <SideBar />
      </div>

      {/* Shorts List */}
      <div className="h-screen overflow-y-scroll snap-y snap-mandatory pt-16">
        {shorts.map(({ videoId, title, likeCount, commentCount, thumbnail, channelTitle }, index) => (
          <div
            key={`${videoId}-${index}`}
            className="relative flex justify-center items-center h-screen snap-start px-2 sm:px-6"
          >
            <div
              className="relative w-full max-w-[400px] sm:max-w-[450px] md:max-w-[500px] lg:max-w-[600px] aspect-[14/16] 
                         rounded-xl overflow-hidden shadow-xl bg-black"
            >
              {/* Video Player */}
              <iframe
                title={`short-${videoId}`}
                className="w-full h-full object-cover"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&playsinline=1&loop=1&playlist=${videoId}&enablejsapi=1&disablekb=1&fs=0&iv_load_policy=3`}
                allow="autoplay; encrypted-media"
                allowFullScreen
                style={{ border: 'none' }}
              ></iframe>

              {/* Bottom Info Gradient */}
              <div className="absolute bottom-0 left-0 w-full p-3 sm:p-4 bg-gradient-to-t from-black via-black/30 to-transparent z-10">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <img
                    src={thumbnail}
                    alt="Channel"
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white"
                  />
                  <span className="font-semibold text-sm sm:text-md">@{channelTitle}</span>
                  <button className="bg-white text-black text-xs sm:text-sm font-semibold px-3 py-[4px] rounded-full">
                    Subscribe
                  </button>
                </div>
                <div className="text-base sm:text-lg font-medium leading-tight">{title}</div>
              </div>

              {/* Right-side Icons */}
              <div className="absolute right-3 sm:right-5 bottom-20 flex flex-col items-center gap-5 z-10">
                <div className="flex flex-col items-center">
                  <ThumbsUp className="w-6 h-6 sm:w-8 sm:h-8" />
                  <span className="text-xs sm:text-sm">{likeCount}</span>
                </div>
                <div className="flex flex-col items-center">
                  <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                  <span className="text-xs sm:text-sm">{commentCount}</span>
                </div>
                <div className="flex flex-col items-center">
                  <Share2 className="w-6 h-6 sm:w-8 sm:h-8" />
                  <span className="text-xs sm:text-sm">Share</span>
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
