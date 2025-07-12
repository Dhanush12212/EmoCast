import React from 'react'

function ChannelVideos({ videos }) {
  return ( 
    <div className="flex flex-wrap justify-start gap-10 px-2">
      {videos.map(({ videoId, thumbnailUrl, viewCount, publishDate, title, duration }) => (
        <div
          key={videoId}
          className="bg-[#1f1f1f] w-full sm:w-[48%] lg:w-[30%] xl:w-[23%] rounded-xl overflow-hidden shadow-md transition transform hover:scale-105 cursor-pointer"
          onClick={() => {
            navigate(`/videos/${videoId}`)
          }}
        >
          {/* Thumbnail */}
          <div className="relative">
            <img
              src={thumbnailUrl}
              alt="video"
              className="w-full h-44 object-cover"
            />
            <span className="absolute bottom-2 right-2 bg-black/80 text-white text-sm px-1.5 py-0.5 rounded-md">
              {duration}
            </span>
          </div>
          {/* Info */}
          <div className="p-4 flex flex-col gap-3">
            <h3 className="text-lg font-medium line-clamp-2">{title}</h3>
            <div className="text-md text-gray-400 font-medium flex justify-between flex-wrap">
              <span>{publishDate}</span>
              <span>{viewCount} views</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ChannelVideos