import React, { useState, useEffect } from 'react'; 
import NavBar from '../components/NavBar/NavBar';
import { SlLike, SlDislike } from "react-icons/sl";
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

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null); 

      try {
        const response = await axios.get(`${API_URL}/playlist/video/${id}`);
        setVideo(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch the video!!");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [id]);

  if (loading) return <p className='flex text-2xl font-semibold justify-center'>Loading Videos.....</p>;
  if (error) return <p className='flex text-2xl font-semibold justify-center text-red-700'>Error: {error}</p>;

  return (
    <div className="w-full h-screen bg-[#101111] text-white flex flex-col mt-20">
      <NavBar />

      <div className="flex flex-1 overflow-hidden p-12 gap-5 flex-col md:flex-row">
        {video && (
          <>
            {/* Video Section */}
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
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>

              <h1 className="text-2xl font-bold">{video.title}</h1>

              {/* Video Info & Actions */}
              <div className="flex items-center justify-between flex-wrap gap-4 cursor-pointer">
                <div className="flex items-center gap-4">
                  <img
                    src={video.channelThumbnailUrl}
                    alt="Profile"
                    className="h-14 w-14 rounded-full object-cover cursor-pointer"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{video.channelTitle}</h2>
                    <p className="text-md text-gray-400">{video.subscribers} subscribers</p>
                  </div>
                  <button className="ml-4 px-6 py-2 bg-white text-black rounded-full text-ld font-medium hover:bg-gray-200 cursor-pointer">
                    Subscribe
                  </button>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2 bg-[#252728] px-4 py-2 rounded-full cursor-pointer text-lg font-extrabold">
                    <SlLike className="w-6 h-6" /> {video.likes}
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
                  <p>{video.views} views</p>  
                  <p>{video.publishDate}</p>
                </div>

                <div className={`transition-all duration-300 ${isMore ? 'max-h-[1000px]' : 'max-h-40 overflow-hidden'}`}>
                  <p>{video.description}</p>
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
                <h1 className='text-3xl font-bold'>{video.commentsCount} Comments</h1>
                {video.comments.map((comment, index) => (
                  <div key={index} className='flex gap-5 py-1'>
                    <img
                      src={comment.commentThumbnail}
                      alt="Profile"
                      className="h-12 w-12 rounded-full object-cover cursor-pointer"
                    />
                    <div className='flex flex-col gap-1 py-1'>
                      <div className='flex gap-2 items-center'>
                        <p className='text-lg'>{comment.author}</p>
                        <span className='text-[#999595]'>{comment.publishedAt}</span>
                      </div>
                      <p className='text-xl'>{comment.text}</p>
                      <div className='flex gap-5'>
                        <div className='flex gap-2'>
                          <SlLike className='w-5 h-5 cursor-pointer'/>
                          <p>{comment.likeCount}</p>
                        </div>
                        <SlDislike className='w-5 h-5 cursor-pointer'/>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Videos Section */}
            <div className="w-full md:w-[35%] h-full bg-[#1a1b1c] rounded-xl overflow-auto shadow-md p-4">
              <h1 className='text-3xl font-bold text-center mb-2'>Recommended Video</h1>
              <RecommendedVideo videos={video.recommendedVideos}/>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default VideoPage;
