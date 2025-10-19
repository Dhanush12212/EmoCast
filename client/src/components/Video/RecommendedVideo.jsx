import React from 'react';
import { useNavigate } from 'react-router-dom';

function RecommendedVideo({ videos = [] }) {
  const navigate = useNavigate();

  const playVideo = (id) => {
    navigate(`/videos/${id}`);
  };

  if (!videos.length) {
    return (
      <p className="text-center text-gray-400 text-lg py-6 w-full">
        No recommended videos available.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4 mt-4 px-4 w-full">
      {videos.map(
        ({
          videoId,
          thumbnailUrl,
          title,
          channelTitle,
          viewCount,
          publishDate,
          duration,
        }) => (
          <div
            key={videoId}
            role="button"
            tabIndex={0}
            onClick={() => playVideo(videoId)}
            onKeyDown={(e) => e.key === 'Enter' && playVideo(videoId)}
            className="
              flex flex-col sm:flex-row 
              items-start sm:items-center 
              gap-4 cursor-pointer 
              hover:bg-[#2a2a2a] 
              transition duration-200 
              rounded-xl p-3
              w-full
            "
          >
            {/* Thumbnail + Duration */}
            <div className="relative w-full sm:w-72 h-48 sm:h-40 flex-shrink-0">
              <img
                src={thumbnailUrl}
                alt={title || 'Video thumbnail'}
                className="w-full h-full rounded-xl object-cover"
              />
              {duration && (
                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs sm:text-sm px-1.5 py-0.5 rounded-md">
                  {duration}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col justify-between flex-1 w-full">
              {/* Title */}
              <h2
                className="
                  font-semibold leading-snug line-clamp-2 text-white
                  text-base sm:text-lg md:text-xl
                "
              >
                {title}
              </h2>

              {/* Channel name, views, and date */}
              <div
                className="
                  flex flex-wrap items-center gap-2 mt-1 text-gray-400
                  text-xs sm:text-sm md:text-base
                "
              >
                <p className="truncate max-w-[70%] sm:max-w-none">{channelTitle}</p>
                <span className="hidden sm:inline">•</span>
                <span>{viewCount}</span>
                <span className="hidden sm:inline">•</span>
                <span>{publishDate}</span>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default RecommendedVideo;
  