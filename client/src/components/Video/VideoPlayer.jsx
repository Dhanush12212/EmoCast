import React, { useState } from 'react';
import { SlLike, SlDislike } from "react-icons/sl";
import { RiShareForwardLine } from "react-icons/ri";
import { LiaDownloadSolid } from "react-icons/lia";

function MainVideoSection({ video }) {
  const [isMore, setIsMore] = useState(false);
  const {
    videoId, 
    title,
    channelThumbnailUrl,
    channelTitle,
    subscribers,
    likeCount,
    viewCount,
    publishDate,
    description, 
    commentsCount
  } = video || {};

  return (
    <div
      key={videoId}
      className="w-full md:w-[65%] h-full flex flex-col gap-6 overflow-auto md:mb-10 p-3"
    >
      {/* Video Player */}
      <div className="w-full h-[60vh]">
        <iframe
          width="100%"
          height="438"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute`}
          title={title}
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold">{title}</h1>

      {/* Channel & Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4 cursor-pointer">
        <div className="flex items-center gap-4">
          <img
            src={channelThumbnailUrl}
            alt="Profile"
            className="h-14 w-14 rounded-full object-cover cursor-pointer"
          />
          <div>
            <h2 className="text-lg font-semibold">{channelTitle}</h2>
            <p className="text-md text-gray-400">{subscribers} subscribers</p>
          </div>
          <button className="ml-4 px-6 py-2 bg-white text-black rounded-full text-ld font-medium hover:bg-gray-200 cursor-pointer">
            Subscribe
          </button>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-[#252728] px-4 py-2 rounded-full cursor-pointer text-lg font-extrabold">
            <SlLike className="w-6 h-6" /> {likeCount}
          </div>
          <div className="flex items-center gap-2 bg-[#252728] px-4 py-2 rounded-full cursor-pointer ">
            <SlDislike className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-2 bg-[#252728] px-4 py-2 rounded-full cursor-pointer ">
            <RiShareForwardLine className="w-6 h-6" />
            <span className="text-lg font-extrabold">Share</span>
          </div>
          <div className="flex items-center gap-2 bg-[#252728] px-4 py-2 rounded-full cursor-pointer">
            <LiaDownloadSolid className="w-6 h-6" />
            <span className="text-lg font-extrabold">Download</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="w-full p-4 rounded-2xl font-semibold bg-gradient-to-b from-[#333333] to-[#272727] text-xl flex flex-col gap-5 transition-all duration-300">
        <div className='flex gap-3'>
          <p>{viewCount} views</p>
          <p>{publishDate}</p>
        </div>

        <div className={`transition-all duration-300 ${isMore ? 'max-h-[1000px]' : 'max-h-40 overflow-hidden'}`}>
          <p>{description}</p>
        </div>

        <button 
          onClick={() => setIsMore(!isMore)}
          className='outline-none mt-2 text-blue-400 hover:underline cursor-pointer'
        >
          {isMore ? "Show Less" : "Show More"}
        </button>
      </div>

      {/* Comments */}
      <div className='flex-col gap-10 px-3 hidden md:flex'>
        <h1 className='text-3xl font-bold'>{commentsCount} Comments</h1>
        {video.comments.map(({author, commentThumbnail, publishedAt, likeCount, text}) => (
          <div key={author} className='flex gap-5 py-1'>
            <img
              src={commentThumbnail}
              alt="Profile"
              className="h-12 w-12 rounded-full object-cover cursor-pointer"
            />
            <div className='flex flex-col gap-1 py-1'>
              <div className='flex gap-2 items-center'>
                <p className='text-lg'>{author}</p>
                <span className='text-[#999595]'>{publishedAt}</span>
              </div>
              <p className='text-xl'>{text}</p>
              <div className='flex gap-5'>
                <div className='flex gap-2'>
                  <SlLike className='w-5 h-5 cursor-pointer'/>
                  <p>{likeCount}</p>
                </div>
                <SlDislike className='w-5 h-5 cursor-pointer'/>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MainVideoSection;
