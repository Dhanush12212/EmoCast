import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar/NavBar';
import SideBar from '../components/NavBar/SideBar';
import { API_URL } from '../../config';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import LoaderOrError from '../components/Reausables/LoaderOrError';
import ChannelVideos from '../components/Video/ChannelVideos';
import SubscribeButton from '../components/Reausables/SubscribeButton';

function AuthorProfile() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { channelId } = useParams();
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    const fetchChannel = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/channel/${channelId}`);
        setChannel(response.data.channel);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch channel data.');
      } finally {
        setLoading(false);
      }
    };

    fetchChannel();
  }, [channelId]);

  return (
    <>
      <LoaderOrError loading={loading} error={error} />
      {!loading && !error && channel && (
        <div className="flex flex-col min-h-screen bg-[#121212] text-white ">
          {/* Fixed Navbar */}
          <div className="fixed top-0 left-0 w-full z-50">
            <NavBar />
          </div>

          <div className="flex pt-[72px]">
            {/* Sidebar */}
            <div className="fixed left-0 top-0 z-40 bg-[#181818]">
              <SideBar />
            </div>

            {/* Main Content */}
            <div className="ml-30 w-full px-10 pb-8">
              {/* Banner */}
              <div className="mt-4 rounded-xl overflow-hidden shadow-lg">
                <img src={channel.banner} alt={channel.title} className="w-full h-60 object-cover rounded-xl" />
              </div>

              {/* Channel Info */}
              <div className="flex flex-col md:flex-row items-center gap-10 mt-6">
                <img
                  src={channel.thumbnail}
                  alt={channel.title}
                  className="h-40 w-40 md:h-60 md:w-60 rounded-full border-2 border-white"
                />

                <div className="flex flex-col gap-3 text-center md:text-left">
                  <h1 className="text-4xl font-bold">{channel.title}</h1>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 text-lg text-gray-300">
                    <p>{channel.customUrl}</p>
                    <span>&bull;</span>
                    <p>{channel.subscribers} Subscribers</p>
                    <span>&bull;</span>
                    <p>{channel.videos.length} Videos</p>
                  </div>
                  <p className="text-gray-400 max-w-4xl">{channel.description}</p>

                  <div onClick={(e) => e.stopPropagation()}>
                    <SubscribeButton channelId={channelId} />
                  </div>
                </div>

              </div>

              {/* Divider */}
              <div className="border-b border-gray-600 my-8"></div>

              {/* Videos Section */}
              <h2 className="text-3xl font-semibold mb-6 text-gray-400">Videos</h2>
                <ChannelVideos videos={channel.videos}/>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AuthorProfile;
