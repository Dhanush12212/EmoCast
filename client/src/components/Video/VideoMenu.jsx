import React from 'react';
import { MdOutlineWatchLater } from "react-icons/md";
import { PiShareFat } from "react-icons/pi"; 
import axios from 'axios';
import { API_URL } from '../../../config'

const menuItemClasses = "flex gap-3 hover:bg-[#535353] cursor-pointer w-full px-3 py-2 items-center";

function VideoMenu({ video, closeMenu}) {

  const handleWatchLater = async () => {

    if(!video) {
      console.log("Video data is missing!");
      return;
    }
    
    const {
      videoId,
      title,
      thumbnailUrl,
      channelId,
      publishAt,
      duration,
      channelTitle,
      viewCount,
      channelThumbnail,
    } = video; 
    
    try {
      await axios.post(`${API_URL}/watchLater/add`, {
        video: {
          videoId,
          title,
          thumbnailUrl,
          channelId,
          publishAt: video.publishAt,
          duration,
          channelTitle,
          viewCount,
          channelThumbnail,
        }
      },
      { 
        withCredentials: true
      });
      console.log("Added to Watch Later");
      closeMenu();
    } catch(err) { 
      console.log(err.response?.data?.message || 'Failed to add to Watch Later');
    }
  }


  return (
    <div className="w-72 bg-[#282828] rounded-lg text-[#F1F1F1] text-lg font-medium py-2 shadow-lg">
      <div 
        className={menuItemClasses}
        onClick={(e) => handleWatchLater()}
      >
        <MdOutlineWatchLater className="w-6 h-6" />
        <span>Save to Watch Later</span>
      </div>
      <div 
        className={menuItemClasses}
      >
        <PiShareFat className="w-6 h-6" />
        <span>Share</span>
      </div> 
    </div>
  );
}

export default VideoMenu;
