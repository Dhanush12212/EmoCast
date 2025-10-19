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
        <div className="w-full min-h-screen bg-[#101111] text-white flex flex-col mt-10">
          <NavBar />

          <div className="flex flex-col md:flex-row flex-1 gap-5 p-5 md:p-12 overflow-hidden">
            {video && (
              <>
                {/* Video Player: full width on small, 70% on md+ */}
                <div className="w-full flex flex-col">
                  <VideoPlayer video={video} />
                </div>

                {/* Recommended Videos: full width on small, 30% on md+ */}
                <div className="w-full md:w-[40%] h-full bg-[#1a1b1c] rounded-xl overflow-auto shadow-md flex flex-col">
                  <h1 className="text-2xl md:text-2xl font-bold text-center my-2 text-gray-400">
                    Recommended Videos
                  </h1>
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
