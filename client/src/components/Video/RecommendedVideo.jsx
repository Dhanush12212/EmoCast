import React from 'react' 

function RecommendedVideo() {

    const videos = Array(10).fill({
        title: "Mock Coding Interview | Amazon Coding Interview",
        channel: "CodeWithHarry",
        views: "2.5k views",
        time: "3 weeks ago"
      });

  return ( 
    <div className="flex flex-col flex-wrap justify-around gap-8 mt-5 px-6">
      {videos.map((video, index) => (
      <div
        key={index}
        className="w-[90%] rounded-2xl flex shadow-md cursor-pointer gap-5"
      >
        {/* Video Thumbnail */}
          <img
            src='https://i.ytimg.com/vi/OmedSCfI9EY/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCEPszmWSR2RvUTmVydvxv76BvjrQ'
          alt="video"
          className="w-60 h-[65%] rounded-t-2xl object-cover rounded-2xl"
          />
          {/* Video Info */}
          <div className="flex gap-3 p-3"> 
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
  )
}

export default RecommendedVideo