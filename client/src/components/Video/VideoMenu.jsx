import React from 'react';
import { MdOutlineWatchLater } from "react-icons/md";
import { RiPlayListAddFill } from "react-icons/ri";
import { LiaDownloadSolid } from "react-icons/lia";
import { PiShareFat } from "react-icons/pi";
import { MdNotInterested, MdOutlineDoNotDisturbOn } from "react-icons/md";
import { GoReport } from "react-icons/go";

const menuItemClasses = "flex gap-3 hover:bg-[#535353] cursor-pointer w-full px-3 py-2 items-center";

function VideoMenu() {
  return (
    <div className='w-76 bg-[#282828] h-[250px] rounded-lg text-[#F1F1F1] text-lg font-md py-2'>
      {/* Watch Later */}
      <div className={menuItemClasses}>
        <MdOutlineWatchLater className="w-6 h-6" />
        <label>Save to Watch Later</label>
      </div>

      {/* Add to Playlist */}
      <div className={menuItemClasses}>
        <RiPlayListAddFill className="w-6 h-6" />
        <label>Save to Playlist</label>
      </div>

      {/* Download */}
      <div className={menuItemClasses}>
        <LiaDownloadSolid className="w-6 h-6" />
        <label>Download</label>
      </div>

      {/* Share */}
      <div className={menuItemClasses}>
        <PiShareFat className="w-6 h-6" />
        <label>Share</label>
      </div>

      {/* Not Interested */}
      <div className={menuItemClasses}>
        <MdNotInterested className="w-6 h-6" />
        <label>Not Interested</label>
      </div>

      {/* Don’t Recommend Channel */}
      <div className={menuItemClasses}>
        <MdOutlineDoNotDisturbOn className="w-6 h-6" />
        <label>Don't Recommend Channel</label>
      </div>

      {/* Report */}
      <div className={menuItemClasses}>
        <GoReport className="w-6 h-6" />
        <label>Report</label>
      </div>
    </div>
  );
}

export default VideoMenu;
