import React, { useState, useEffect } from 'react';
// import { assets } from '../assets/assets';
import axios from 'axios';
import API_URL from '../../config'; 

function VideoCard() { 

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${API_URL}/playlist/videos`);
        setVideos(response.data.videos);
      } catch(error) {
        setError(error.response?.data?.message || "Failed to fetch videos ");
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, []);

  if(loading) return <p>Loading Videos.....</p>;
  if(error) return <p>Error: {error} </p>;

  

  return (
    <div className="flex flex-wrap justify-around gap-6 mt-5 px-6">
      {videos.map((video, videoId) => (
        <div
          key={videoId}
          className="w-full sm:w-[48%] lg:w-[32%] xl:w-[30%] h-[300px]  rounded-2xl flex flex-col shadow-md cursor-pointer"
        >
          {/* Video Thumbnail */}
          <img
            src={video.thumbnailUrl}
            alt="video"
            className="w-full h-[65%] rounded-t-2xl object-cover"
          />

          {/* Video Info */}
        <div className="flex gap-3 py-3">
          <div className="h-16 w-16 p-0 flex justify-center items-center bg-red-800 rounded-full overflow-hidden">
            <img
              src={video.channelThumbnailUrl}
              alt={video.channelTitle}
              className="w-full h-full object-cover cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105"
            />
          </div>

          <div>
            <h1 className="text-xl font-semibold leading-tight">{video.title}</h1>
            <p className="text-lg text-gray-400 mt-2">{video.channelTitle}</p>
            <div className="flex gap-3 text-lg text-gray-400">
              <p>{video.views}</p> 
              -
              <p>{video.publishDate}</p>
            </div>
          </div>
        </div>

        </div>
      ))}
    </div>
  );
}

export default VideoCard;
