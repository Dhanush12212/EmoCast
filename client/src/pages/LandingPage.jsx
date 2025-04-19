import React from 'react';
import NavBar from '../components/NavBar';
import FilterBar from '../components/FilterBar';
import HomeFeed from '../components/HomeFeed';
import SideBar from '../components/SideBar';

function LandingPage() {
  return (
    <div className="flex flex-col h-screen"> 
      <NavBar />

      <div className="flex flex-1"> 
        {/* Sidebar */}
        <SideBar />

        {/* Main Content Section */}
        <div className="flex-1 overflow-x-hidden">
          {/* Filter Bar */}
          <FilterBar />
          
          {/* Home Feed */}
          <HomeFeed />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
