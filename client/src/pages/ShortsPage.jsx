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

      {/* Shorts List */}
      <div className="h-screen overflow-y-scroll snap-y snap-mandatory pt-16">
        {shorts.map(({ videoId, title, likeCount, commentCount, thumbnail, channelTitle }) => (
          <div
            key={videoId}
            className="relative flex justify-center items-center h-screen snap-start"
          >
            <div className="relative w-[360px] sm:w-[400px] h-[640px] rounded-xl overflow-hidden shadow-xl bg-black">
              {/* Video Player */}
              <iframe
                className="w-full h-full object-cover"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&playsinline=1&loop=1&playlist=${videoId}&enablejsapi=1&disablekb=1&fs=0&iv_load_policy=3`}
                allow="autoplay; encrypted-media"
                frameBorder="0"
                allowFullScreen
              ></iframe>

              {/* Gradient overlay for bottom info */}
              <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black via-black/30 to-transparent z-10">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={thumbnail}
                    alt="Channel"
                    className="w-10 h-10 rounded-full object-cover border-2 border-white"
                  />
                  <span className="font-semibold text-sm">@{channelTitle}</span>
                  <button className="ml-auto bg-white text-black text-xs font-semibold px-3 py-1 rounded-full">
                    Subscribe
                  </button>
                </div>
                <div className="text-sm font-medium">{title}</div>
              </div>

              {/* Right-side Icons Overlay */}
              <div className="absolute right-3 bottom-20 flex flex-col items-center gap-6 z-10">
                <div className="flex flex-col items-center">
                  <ThumbsUp className="w-7 h-7" />
                  <span className="text-xs">{likeCount}</span>
                </div>
                <div className="flex flex-col items-center">
                  <MessageCircle className="w-7 h-7" />
                  <span className="text-xs">{commentCount}</span>
                </div>
                <div className="flex flex-col items-center">
                  <Share2 className="w-7 h-7" />
                  <span className="text-xs">Share</span>
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
