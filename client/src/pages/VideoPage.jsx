import React, { useState, useEffect } from 'react'; 
import NavBar from '../components/NavBar/NavBar';
import axios from 'axios';
import { API_URL } from '../../config';
import { useParams } from 'react-router-dom';
import VideoPlayer from '../components/Video/VideoPlayer';
import RecommendedVideo from '../components/Video/RecommendedVideo'; 
import LoaderOrError from '../components/Reausables/LoaderOrError';

function VideoPage() { 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [video, setVideo] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true);
      setError(null); 

      try {
        const response = await axios.get(`${API_URL}/allVideos/video/${id}`);
        setVideo(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch the video!!");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);  

  return (
    <>
      <LoaderOrError loading={loading} error={error} />
        {!loading && !error && (
          <div className="w-full h-screen bg-[#101111] text-white flex flex-col mt-15">
        <NavBar />

        <div className="flex flex-1 overflow-hidden p-12 gap-5 flex-col md:flex-row">
          {video && (
            <>
              <VideoPlayer video={video} />
              <div className="w-[30%] h-full bg-[#1a1b1c] rounded-xl overflow-auto shadow-md  ">
                <h1 className='text-3xl font-bold text-center mb-2 text-gray-400'>Recommended Videos</h1>
                <RecommendedVideo videos={video.recommendedVideos} />
              </div>
            </>
          )}
        </div>
      </div>
      )}
    </>
  );
}

export default VideoPage;
