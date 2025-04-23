import React from 'react';
import { assets } from '../assets/assets';

function VideoCard() {
  const videos = Array(21).fill({
    title: "Mock Coding Interview | Amazon Coding Interview",
    channel: "CodeWithHarry",
    views: "2.5k views",
    time: "3 weeks ago"
  });

  return (
    <div className="flex flex-wrap justify-around gap-6 mt-5 px-6">
      {videos.map((video, index) => (
        <div
          key={index}
          className="w-full sm:w-[48%] lg:w-[32%] xl:w-[30%] h-[300px]  rounded-2xl flex flex-col shadow-md cursor-pointer"
        >
          {/* Video Thumbnail */}
          <img
            src={assets.video}
            alt="video"
            className="w-full h-[65%] rounded-t-2xl object-cover"
          />

          {/* Video Info */}
          <div className="flex gap-3 p-3">
            <div className="hover:bg-[#3D3D3D] p-2 rounded-xl">
              <img
                src={assets.Subscription}
                alt="Profile"
                className="h-10 w-10 rounded-full object-cover cursor-pointer"
              />
            </div>
            <div>
              <h1 className="text-xl font-semibold leading-tight">{video.title}</h1>
              <p className="text-md text-gray-400 mt-2">{video.channel}</p>
              <div className="flex gap-4 text-md text-gray-400">
                <p>{video.views}</p>
                <p>{video.time}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default VideoCard;
