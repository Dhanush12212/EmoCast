import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import NavBar from '../components/Navabr/NavBar';
import { BiLike, BiDislike } from "react-icons/bi";
import { RiShareForwardLine } from "react-icons/ri";
import { LiaDownloadSolid } from "react-icons/lia"; 
import RecommendedVideo from '../components/Video/RecommendedVideo'; 
import axios from 'axios';
import { API_URL } from '../../config';
import { useParams } from 'react-router-dom';

function VideoPage() { 
  const [isMore, setIsMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [video, setVideo] = useState(null);

  const { id } = useParams();

  useEffect( () => {
    const fetchVideos = async() => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`${API_URL}/playlist/videos/${id}`);
        setVideo(response.data);
      } catch(err) {
        setError(err.response?.data?.message || " Failed to fetch the video!!");
      }
      finally {
        setLoading(false);
      }
    };


    fetchVideos();
  }, [id] );

  if (loading) return <p className='flex text-2xl font-semibold justify-center'>Loading Videos.....</p>;
  if (error) return <p className='flex text-2xl font-semibold justify-center text-red-700'>Error: {error}</p>;

  return (
    <div className="w-full h-screen bg-[#101111] text-white flex flex-col mt-20 ">
      
      {/* NavBar */}
      <NavBar />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden p-12 gap-5 flex-col md:flex-row ">

        {/* Video Section */}
        {video && (

          <div 
            key={video.videoId} 
            className="w-full md:w-[65%] h-full flex flex-col gap-6 overflow-auto md:mb-10"
          >
 
          <div className="w-full h-[60vh]">
              <iframe 
                width="100%" 
                height="438" 
                src={`https://www.youtube.com/embed/${id}`} 
                title={video.title}
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerpolicy="strict-origin-when-cross-origin" 
                allowfullscreen="true"
              ></iframe>
          </div>

        
          <h1 className="text-2xl font-bold">
            {video.title}
          </h1>

          {/* Video Info & Actions */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Channel Info */}
            <div className="flex items-center gap-4"> 
              <img
                src={video.channelThumbnailUrl}
                alt="Profile"
                className="h-14 w-14 rounded-full object-cover cursor-pointer"
              />
              <div>
                <h2 className="text-lg font-semibold">{video.channelTitle}</h2>
                <p className="text-md text-gray-400">{video.subscribers}subscribers</p>
              </div>
              <button className="ml-4 px-6 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-200">
                Subscribe
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-[#252728] px-4 py-2 rounded-full">
                <BiLike className="w-6 h-6 cursor-pointer" /> {video.likes}
              </div>
              <div className="flex items-center gap-2 bg-[#252728] px-4 py-2 rounded-full cursor-pointer">
                <BiDislike className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 bg-[#252728] px-4 py-2 rounded-full cursor-pointer">
                <RiShareForwardLine className="w-6 h-6" />
                <span className="text-sm">Share</span>
              </div>
              <div className="flex items-center gap-2 bg-[#252728] px-4 py-2 rounded-full cursor-pointer">
                <LiaDownloadSolid className="w-6 h-6" />
                <span className="text-sm">Download</span>
              </div>
            </div>
          </div>

          {/* Description of the video */}
          <div className="w-full p-4 rounded-2xl font-semibold bg-gradient-to-b from-[#333333] to-[#272727] text-xl flex flex-col gap-5 transition-all duration-300">
            <div className='flex gap-5'>
              <p>{video.views} views</p>  
              <p>{video.publishDate}</p>
            </div>

            {/* This is the scroll/collapsible area */}
            <div className={`transition-all duration-300 ${isMore ? 'max-h-[1000px]' : 'max-h-40 overflow-hidden'}`}>
               <p>Royal Enfield’s first electric bike coming Jan-Mar 2026, Snapdragon 7 Gen 4 launched by Qualcomm, AI coding leads to layoffs as Microsoft cuts 6,000 jobs, Android 16 rollout begins June with select phones, Trump urges Apple to halt iPhone production shift to India, iOS 19 to feature AI for better iPhone battery life, NZ plans under-16 social media ban by 2026, Nothing Phone (3) leaks hint at ₹90,500 flagship launch, Realme GT 7 Dream Edition confirmed for India launch, Alcatel V3 Series to launch in India on May 27, Galaxy S25 FE leak reveals Exynos 2400 chipset, Sony launches WH-1000XM6 ANC headphones, OnePlus 13s to launch in 3 colors.|Kannada video(ಕನ್ನಡದಲ್ಲಿ)

                Intro 0:00 <br />
                News 1: Royal Enfield’s first electric bike  00:08
                News 2: Snapdragon 7 Gen 4 launched by Qualcomm 1:26
                News 3:  Microsoft cuts 6,000 jobs  02:00
                News 4: Android 16 rollout  03:04
                News 5: iOS 19 to feature AI for better iPhone battery life 04:17
                News 6: NZ plans under-16 social media ban  4:38
                News 7: Nothing Phone (3)  5:43
                News 8: Realme GT 7 6:18
                News 9:Alcatel V3 Series 6:50<br />
                News 10: Galaxy S25 FE leak reveals Exynos 2400 chipset 7:15
                News 11: Sony launches WH-1000XM6 ANC headphones 7:48
                News 12: OnePlus 13s   8:22
                Outro 9:25<br />

                Buy in amazon :https://amzn.to/2TDphWC
                Buy in flipkart : https://fkrt.co/INRPpf

                kannada tech videos
                tech in kannada <br />
                Subscribe for More Videos..
                ♥ Email us at : techinkannada@gmail.com﻿
                ▬▬▬▬▬ Share, Support, Subscribe▬▬▬▬▬▬▬▬▬
                ♥ instagram:   / sandeepvlogs  
                ♥ Telegram: https://t.me/realtechinkannada
                ♥ Email us at : techinkannada@gmail.com﻿
                ♥ subscribe : https://www.youtube.com/subscription_...<br />
                ♥ Facebook :    / techinkannada  
                ♥ YouTube :     / techinkannada360  
                ♥ twitter:    / sandeepvlogs  </p>
            </div>

            <button 
              onClick={() => setIsMore(!isMore)}
              className='outline-none mt-5 text-blue-400 hover:underline'
              > 
              { isMore ? "Show Less" : "Show More" }
            </button>
          </div>


          {/* Comments Placeholder */}
          <div className=' flex-col gap-10 px-3 hidden md:flex'>
            <h1 className='text-3xl font-bold'>{video.comments} Comments</h1>      

            {/* Comments */}
            <div className='flex gap-5 py-1'>
              <img
              src={assets.Subscription}
              alt="Profile"
              className="h-12 w-12 rounded-full object-cover cursor-pointer"
              />

              <div className='flex flex-col gap-1 py-1'>
                <p className='text-lg'>@dhanush</p>
                <p className='text-xl'>That's what a explanation beginner require for these type of problems</p>
              </div>

            </div>

            <div className='flex gap-5'>
              <img
              src={assets.Subscription}
              alt="Profile"
              className="h-12 w-12 rounded-full object-cover cursor-pointer"
              />

              <div className='flex flex-col gap-1'>
                <p className='text-lg'>@dhanush</p>
                <p className='text-xl'>That's what a explanation beginner require for these type of problems</p>
              </div>

            </div>
            <div className='flex gap-5'>
              <img
              src={assets.Subscription}
              alt="Profile"
              className="h-12 w-12 rounded-full object-cover cursor-pointer"
              />

              <div className='flex flex-col gap-1'>
                <p className='text-lg'>@dhanush</p>
                <p className='text-xl'>That's what a explanation beginner require for these type of problems</p>
              </div>

            </div>
            <div className='flex gap-5'>
              <img
              src={assets.Subscription}
              alt="Profile"
              className="h-12 w-12 rounded-full object-cover cursor-pointer"
              />

              <div className='flex flex-col gap-1'>
                <p className='text-lg'>@dhanush</p>
                <p className='text-xl'>That's what a explanation beginner require for these type of problems</p>
              </div>

            </div>
            <div className='flex gap-5'>
              <img
              src={assets.Subscription}
              alt="Profile"
              className="h-12 w-12 rounded-full object-cover cursor-pointer"
              />

              <div className='flex flex-col gap-1'>
                <p className='text-lg'>@dhanush</p>
                <p className='text-xl'>That's what a explanation beginner require for these type of problems</p>
              </div>

            </div>
            <div className='flex gap-5'>
              <img
              src={assets.Subscription}
              alt="Profile"
              className="h-12 w-12 rounded-full object-cover cursor-pointer"
              />

              <div className='flex flex-col gap-1'>
                <p className='text-lg'>@dhanush</p>
                <p className='text-xl'>That's what a explanation beginner require for these type of problems</p>
              </div>

            </div>
            <div className='flex gap-5'>
              <img
              src={assets.Subscription}
              alt="Profile"
              className="h-12 w-12 rounded-full object-cover cursor-pointer"
              />

              <div className='flex flex-col gap-1'>
                <p className='text-lg'>@dhanush</p>
                <p className='text-xl'>That's what a explanation beginner require for these type of problems</p>
              </div>

            </div>
          </div>

        </div>
        )}
    {/* ))} */}

        {/* Recommended Videos Placeholder */}
        <div className="w-full md:w-[35%] h-full bg-[#1a1b1c] rounded-xl overflow-auto shadow-md p-4"> 
          <h1 className='text-3xl font-bold text-center mb-2'>Recommended Video</h1>
            <RecommendedVideo/>
        </div>
      </div>
    </div>
  );
}

export default VideoPage;
