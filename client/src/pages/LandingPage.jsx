import React, { useState } from 'react';
import NavBar from '../components/NavBar/NavBar';
import FilterBar from '../components/NavBar/FilterBar'; 
import SideBar from '../components/NavBar/SideBar';
import VideoCard from '../components/Video/VideoCard';

function LandingPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  return (
    <div className="flex flex-col h-screen bg-[#121212]">
      {/* Fixed NavBar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <NavBar />
      </div>

      <div className="flex flex-1 pt-20 sm:pt-25">
        {/* Fixed Sidebar */}
        <div className="fixed left-0 top-0 w-16 sm:w-64">
          <SideBar />
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-16 sm:ml-25 overflow-x-hidden">
          {/* FilterBar — Only for larger screens */}
          <div className="hidden sm:block fixed top-0 left-25 z-30 right-0 bg-[#121212] pt-3">
            <FilterBar
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>

          {/* Home Feed — reduced top padding */}
          <div className="pt-2 sm:pt-20 px-3 sm:px-10 transition-all duration-300">
            <VideoCard
              selectedCategory={selectedCategory?.id}
              category={selectedCategory?.title}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
