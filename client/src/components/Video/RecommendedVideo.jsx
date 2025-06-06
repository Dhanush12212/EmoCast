import React from 'react';
import { useNavigate } from 'react-router-dom';

function RecommendedVideo({ videos = [] }) {
  const navigate = useNavigate();

  const playVideo = (id) => {
    navigate(`/videos/${id}`);
  };

  if (!videos.length) {
    return (
      <p className="text-center text-gray-400 text-lg py-6">
        No recommended videos available.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6 mt-4 px-3">
      {videos.map((video, index) => (
        <div
          key={index}
          onClick={() => playVideo(video.videoId)}
          className="flex items-start gap-4 cursor-pointer hover:bg-[#2a2a2a] transition duration-200 rounded-xl p-2"
        >
          {/* Thumbnail */}
          <img
            src={video.thumbnailUrl}
            alt={video.title || "Video thumbnail"}
            className="w-48 h-28 rounded-xl object-cover flex-shrink-0"
          />

          {/* Info */}
          <div className="flex flex-col justify-between">
            <h2 className="text-lg font-semibold leading-snug line-clamp-2 text-white">
              {video.title}
            </h2>
            <p className="text-sm text-gray-400 mt-1">{video.channelTitle}</p>
            <div className="flex gap-3 text-sm text-gray-500 mt-1">
              <span>{video.views}</span>
              <span>•</span>
              <span>{video.publishDate}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecommendedVideo;
