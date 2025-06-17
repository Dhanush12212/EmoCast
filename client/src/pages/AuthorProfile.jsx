import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar/NavBar'; 
import SideBar from '../components/NavBar/SideBar'; 
import { assets } from '../assets/assets';
import SampleVideo from '../components/SampleVideo'
import { API_URL } from '../../config' 
import axios from 'axios';
import { useParams } from 'react-router-dom';
import LoaderOrError from '../components/LoaderOrError';

function AuthorProfile() { 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { channelId } = useParams();
  const [channel, setChannel] = useState(null);
  
  useEffect(() => {

    const fetchChannel = async() => {

      setLoading(true);
      setError(null);
    
      try {
        const response = await axios.get(`${API_URL}/channel/${channelId}`);
        setChannel(response.data.channel);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch videos!!');
      } finally {
        setLoading(false);
      }

    } 

    fetchChannel();
  },[channelId]);

  
  return (
    <>
    <LoaderOrError loading={loading} error={error} />
      {!loading && !error && (
        <div className="flex flex-col h-screen">
          {/* Fixed NavBar */}
          <div className="fixed top-0 left-0 w-full z-50">
            <NavBar />
          </div>

          <div className="flex flex-1 pt-25"> 
            {/* Fixed Sidebar */}
            <div className="fixed left-0 top-0 w-64 ">
              <SideBar />
            </div>

            {/* Main Content */}
            {channel && (
            <div className="flex w-full ml-25 overflow-x-hidden  flex-col gap-5">    
              <div  className='flex justify-center'>
                <img className="w-[80%] h-64 rounded-2xl" src={channel.banner} alt="YouTube Logo" /> 
              </div>

                <div className="flex gap-10 p-2 ml-20 items-center">
                  <img src={channel.thumbnail} alt="Subscription Icon" className="h-56 w-56 p-1 rounded-full" />

                  <div className='flex flex-col gap-3'>
                    <h1 className='font-bold text-5xl'>{channel.title}</h1>  
                    <div className='flex gap-2 text-xl'>
                      <h1 className='font-semibold text-white'>@{channel.title}</h1> &bull;
                      <p>{channel.subscribers} Subscribers</p> &bull;
                      <p>{channel.videos} videos</p>
                    </div>
                    <p>{channel.description}</p>
                    <button className='px-2 py-2 bg-white rounded-full border w-32 text-black font-medium text-lg cursor-pointer'>Subscribe</button>
                  </div>
                </div>
                  <div className='border-1 border-[#3c3c3c] w-full h-0 left-0'></div>
                  <h1 className='text-3xl font-semibold ml-15'>Videos</h1>
                  <SampleVideo/>
            </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default AuthorProfile;