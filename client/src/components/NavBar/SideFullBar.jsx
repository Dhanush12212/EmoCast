import React, {useEffect, useState} from 'react'   
import {sidebarItems} from '../../constants';
import {Link} from 'react-router-dom'
import axios from 'axios';
import { API_URL } from '../../../config';
import { useNavigate } from 'react-router-dom';
import WebCamCapture from '../WebCam/WebCamCapture';
 
function SideFullBar() {

  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("user"));

  useEffect(() => {
    const fetchChannels = async() => {

      try {
        const response = await axios.get(`${API_URL}/subscribe/fetchChannels`, {
          withCredentials: true,
        });

        setChannels(response.data.subscribedChannels || [] );
      }
      catch(error) {
        console.log("failed to fetch the channels", error);
      } finally {
        setLoading(false);
      }
    }

    fetchChannels();
  }, []);
  

  return ( 
    <div className='bg-[#121212] w-80 px-6 py-3 h-full'> 

        {sidebarItems.map((item, idx) => { 
            if(item.divider) return  <div key={idx} className='border-[2px] border-[#222222]'></div>;
            
            return (
              <Link to={item.path} key={idx} className='flex items-center gap-5 hover:bg-[#3D3D3D] p-3 rounded-xl cursor-pointer'>
                <item.icon className='w-8 h-8' />
                <span className='text-xl font-medium'>{item.label}</span>
              </Link>
            );
        })}
        <div className='mt-2'>
          <WebCamCapture/>
        </div>
        <p className='m-5 text-xl'>Subscriptions</p>

        {/* SubScriptions */}
        {loading ? (
          <p className='text-gray-400 text-sm mt-2'>Loading subscriptions...</p>
          ) : channels.length === 0 ? (
          <p
            className={`m-4 px-4 py-2 rounded-lg text-sm font-medium w-fit
              ${isLoggedIn ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
                           : "bg-red-500/10 text-red-400 border border-red-500/20"}`}
          >
            {isLoggedIn ? "📭 No Channel Subscribed" : "Login is required"}
          </p>
            ) : (
          channels.map((channel) => (
            <div 
              key={channel.channelId}
              onClick={() => navigate(`/channel/${channel.channelId}`)}
              className='flex items-center gap-5 hover:bg-[#3D3D3D] p-3 rounded-xl cursor-pointer'>
              <img
                src={channel.channelThumbnail}
                alt="Profile"
                className="h-10 w-10 rounded-full object-cover cursor-pointer"
              />
              <span className='text-lg font-medium'>{channel.channelTitle}</span>
            </div>
          ))
        )}

    </div>
  )
}

export default SideFullBar