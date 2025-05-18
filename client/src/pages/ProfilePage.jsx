import React from 'react';
import NavBar from '../components/Navabr/NavBar'; 
import SideBar from '../components/Navabr/SideBar';
import ProfileFeed from '../components/Feed/ProfileFeed';

function Profile() { 
  
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

          {/* Home Feed */}
          <div className=""> 
            <ProfileFeed/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
