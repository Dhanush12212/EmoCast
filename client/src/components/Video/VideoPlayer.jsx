import React, { useState } from 'react';
import { SlLike, SlDislike } from "react-icons/sl";
import { RiShareForwardLine } from "react-icons/ri";
import { LiaDownloadSolid } from "react-icons/lia";
import { useNavigate } from 'react-router-dom';
import SubscribeButton from '../Reausables/SubscribeButton';

function VideoPlayer({ video }) {
  const navigate = useNavigate();
  const [isMore, setIsMore] = useState(false);
  const {
    videoId, 
    title,
    channelId,
    channelThumbnailUrl,
    channelTitle,
    subscribers,
    likeCount,
    viewCount,
    publishDate,
    description, 
    commentsCount
  } = video || {};

  const linkify = (text) => {
    const cleanedText = text.replace(/<a[^>]*>(.*?)<\/a>/gi, '$1');
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return cleanedText.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line.split(urlRegex).map((part, j) =>
          urlRegex.test(part) ? (
            <a key={j} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
              {part}
            </a>
          ) : (
            part
          )
        )}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div
      key={videoId}
      className="w-full h-full flex flex-col gap-3 overflow-auto md:mb-10 px-3 py-2"
    >
      {/* Video Player */}
      <div className="w-full aspect-video">
        <iframe
          className="w-full h-[100%]"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute`} 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin" 
        ></iframe>
      </div>

      {/* Title */}
      <h1 className="text-base md:text-2xl lg:text-2xl font-bold">{title}</h1>

      {/* Channel & Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4 cursor-pointer">
        <div className="flex items-center gap-4"
          onClick={() => navigate(`/channel/${channelId}`)}
        >
          {channelThumbnailUrl && channelThumbnailUrl !== '' ? (
            <img
              src={channelThumbnailUrl}
              alt={channelTitle}
              className="h-10 w-10 md:h-14 md:w-14 rounded-full object-cover cursor-pointer" 
            /> 
          ) : (
            <span 
              className="absolute font-semibold text-xl md:text-2xl uppercase text-gray-300"> 
              {channelTitle?.charAt(0)}
            </span>  
          )}
          <div>
            <h2 className="text-sm md:text-lg lg:text-lg font-semibold">{channelTitle}</h2>
            <p className="text-xs md:text-md lg:text-md text-gray-400">{subscribers} subscribers</p>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <SubscribeButton channelId={channelId} />
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-[#252728] px-3 py-1 md:px-4 md:py-2 rounded-full cursor-pointer text-base md:text-lg font-extrabold">
            <SlLike className="w-5 h-5 md:w-6 md:h-6" /> {likeCount}
          </div>
          <div className="flex items-center gap-2 bg-[#252728] px-3 py-1 md:px-4 md:py-2 rounded-full cursor-pointer text-base md:text-lg">
            <SlDislike className="w-5 h-5 md:w-6 md:h-6" /> {}
          </div>
          <div className="flex items-center gap-2 bg-[#252728] px-3 py-1 md:px-4 md:py-2 rounded-full cursor-pointer text-base md:text-lg">
            <RiShareForwardLine className="w-5 h-5 md:w-6 md:h-6" />
            <span className="font-extrabold">Share</span>
          </div>
          <div className="flex items-center gap-2 bg-[#252728] px-3 py-1 md:px-4 md:py-2 rounded-full cursor-pointer text-base md:text-lg">
            <LiaDownloadSolid className="w-5 h-5 md:w-6 md:h-6" />
            <span className="font-extrabold">Download</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="w-full p-4 md:p-5 mt-5 rounded-2xl font-semibold bg-gradient-to-b from-[#333333] to-[#272727] text-base md:text-xl flex flex-col gap-4 md:gap-5 transition-all duration-300">
        <div className='flex gap-3 text-sm md:text-base'>
          <p>{viewCount} views</p>
          <p>{publishDate}</p>
        </div>

        <div className={`transition-all duration-300 ${isMore ? 'max-h-[1000px]' : 'max-h-40 overflow-hidden'}`}>
          <p style={{ whiteSpace: 'pre-wrap' }} className="text-sm md:text-base lg:text-xl">{linkify(description)}</p>
        </div>

        <button
          onClick={() => setIsMore(!isMore)}
          className="mt-2 md:mt-3 text-sm md:text-md text-blue-500 transition-all duration-200 hover:text-blue-600 hover:underline outline-none"
        >
          {isMore ? "▲ Show Less" : "▼ Show More"}
        </button>
      </div>

      {/* Comments */}
      <div className='flex-col gap-10 px-3 py-2 hidden md:flex'>
        <h1 className='text-2xl md:text-3xl lg:text-3xl font-bold'>{commentsCount} Comments</h1>
        {video.comments?.map(({author, commentThumbnail, publishedAt, likeCount, text}, index) => (
          <div key={`${videoId}-${index}`} className='flex gap-5 py-1'>
            {commentThumbnail && commentThumbnail !== '' ? (
              <img
                src={commentThumbnail} 
                className="h-10 w-10 md:h-14 md:w-14 rounded-full object-cover cursor-pointer"
              /> 
            ) : (
              <span className="absolute font-semibold text-xl md:text-2xl uppercase text-gray-300">
                {author?.charAt(0)}
              </span> 
            )}
            <div className='flex flex-col gap-1 py-1'>
              <div className='flex gap-2 items-center'>
                <p className='text-sm md:text-lg lg:text-lg'>{author}</p>
                <span className='text-xs md:text-sm lg:text-sm text-[#999595]'>{publishedAt}</span>
              </div>
              <p className='text-sm md:text-base lg:text-xl'>{linkify(text)}</p>
              <div className='flex gap-5'>
                <div className='flex gap-2'>
                  <SlLike className='w-4 h-4 md:w-5 md:h-5 cursor-pointer'/>
                  <p className='text-sm md:text-base'>{likeCount}</p>
                </div>
                <SlDislike className='w-4 h-4 md:w-5 md:h-5 cursor-pointer'/>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VideoPlayer;
