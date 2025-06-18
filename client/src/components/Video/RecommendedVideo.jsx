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
      {videos.map(({ videoId, thumbnailUrl, title, channelTitle, viewCount, publishDate, duration }) => (
        <div
          key={videoId}
          role="button"
          tabIndex={0}
          onClick={() => playVideo(videoId)}
          onKeyDown={(e) => e.key === 'Enter' && playVideo(videoId)}
          className="flex items-start gap-4 cursor-pointer hover:bg-[#2a2a2a] transition duration-200 rounded-xl p-2"
        >
          {/* Thumbnail + Duration */}
          <div className="relative w-52 h-32 flex-shrink-0">
            <img
              src={thumbnailUrl}
              alt={title || "Video thumbnail"}
              className="w-full h-full rounded-xl object-cover"
            />
            {duration && (
              <span className="absolute bottom-2 right-2 bg-black/80 text-white text-sm px-1.5 py-0.5 rounded-md">
                {duration}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-between">
            <h2 className="text-lg font-semibold leading-snug line-clamp-2 text-white">
              {title}
            </h2>
            <p className="text-md text-gray-400 mt-1">{channelTitle}</p>
            <div className="flex gap-3 text-md text-gray-500 mt-1">
              <span>{viewCount}</span>
              <span>&bull;</span>
              <span>{publishDate}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecommendedVideo;
