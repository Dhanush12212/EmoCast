import React from 'react';
import NavBar from '../components/NavBar';
import FilterBar from '../components/FilterBar';
import HomeFeed from '../components/HomeFeed';
import SideBar from '../components/SideBar';

function LandingPage() {
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

        {/* Main Content */}
        <div className="flex-1 ml-25 overflow-x-hidden">
          {/* Fixed Filter Bar */}
          <div className="fixed top-0 left-25 z-30 right-0 bg-[#121212]">
            <FilterBar />
          </div>

          {/* Home Feed */}
          <div className="pt-16"> 
            <HomeFeed />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
