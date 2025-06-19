import React from 'react';
import { MdOutlineWatchLater } from "react-icons/md";
import { PiShareFat } from "react-icons/pi";
// import { RiPlayListAddFill } from "react-icons/ri";
// import { LiaDownloadSolid } from "react-icons/lia";
// import { MdNotInterested, MdOutlineDoNotDisturbOn } from "react-icons/md";
// import { GoReport } from "react-icons/go";

const menuItemClasses = "flex gap-3 hover:bg-[#535353] cursor-pointer w-full px-3 py-2 items-center";

function VideoMenu() {
  return (
    <div className="w-72 bg-[#282828] rounded-lg text-[#F1F1F1] text-lg font-medium py-2 shadow-lg">
      <div className={menuItemClasses}>
        <MdOutlineWatchLater className="w-6 h-6" />
        <label>Save to Watch Later</label>
      </div>
      <div className={menuItemClasses}>
        <PiShareFat className="w-6 h-6" />
        <label>Share</label>
      </div>
      {/* <div className={menuItemClasses}>
        <RiPlayListAddFill className="w-6 h-6" />
        <label>Save to Playlist</label>
      </div>
      <div className={menuItemClasses}>
        <LiaDownloadSolid className="w-6 h-6" />
        <label>Download</label>
      </div> */}
      {/* <div className={menuItemClasses}>
        <MdNotInterested className="w-6 h-6" />
        <label>Not Interested</label>
      </div>
      <div className={menuItemClasses}>
        <MdOutlineDoNotDisturbOn className="w-6 h-6" />
        <label>Don't Recommend Channel</label>
      </div>
      <div className={menuItemClasses}>
        <GoReport className="w-6 h-6" />
        <label>Report</label>
      </div> */}
    </div>
  );
}

export default VideoMenu;
