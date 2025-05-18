import React from 'react';
import NavBar from '../components/Navabr/NavBar'; 
import HomeFeed from '../components/Feed/HomeFeed';
import SideBar from '../components/Navabr/SideBar';

function Subscription() {
  return (
    <div className="flex flex-col h-screen">
      {/* Fixed NavBar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <NavBar />
      </div>

      <div className="flex flex-1 pt-25"> 
        {/* Fixed Sidebar */}
        <div className="fixed  left-0 top-0 w-64 ">
          <SideBar />
        </div>
 
          {/* Home Feed */}
        <div className="flex-1 ml-25 overflow-x-hidden">  
            <h1 className='text-2xl font-bold text-white ml-22 my-2'>Latest</h1>
            <HomeFeed /> 
        </div>
      </div>
    </div>
  );
}

export default Subscription;
