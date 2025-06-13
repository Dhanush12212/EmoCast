import React, { useState } from 'react';
import NavBar from '../components/NavBar/NavBar';
import FilterBar from '../components/NavBar/FilterBar'; 
import SideBar from '../components/NavBar/SideBar';
import VideoCard from '../components/Video/VideoCard';

function LandingPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  
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
          <div className="fixed top-0 left-25 z-30 right-0 bg-[#121212]">
            <FilterBar selectedCategory={selectedCategory} onSelect={setSelectedCategory}/>
          </div>

          {/* Home Feed */}
          <div className="pt-16 px-10"> 
            <VideoCard selectedCategory={selectedCategory.id} category={selectedCategory.title}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
