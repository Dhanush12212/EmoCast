import React, { useState } from 'react';
import NavBar from '../components/NavBar/NavBar'; 
import SideBar from '../components/NavBar/SideBar'; 
import { assets } from '../assets/assets';
import SampleVideo from '../components/SampleVideo'

function AuthorProfile() { 
  
  return (
    <div className="flex flex-col h-screen">
      {/* Fixed NavBar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <NavBar />
      </div>

      <div className="flex flex-1 pt-25"> 
        {/* Fixed Sidebar */}
        <div className="fixed left-0 top-0 w-64 ">
          <SideBar />
        </div>

        {/* Main Content */}
        <div className="flex w-full ml-25 overflow-x-hidden  p-10 flex-col gap-5">    
          <div className='flex justify-center'>

            <img className="w-[80%] h-40 rounded-2xl" src={assets.banner} alt="YouTube Logo" /> 
          </div>

            <div className="flex justify-center gap-10 p-2">
              <img src={assets.Subscription} alt="Subscription Icon" className="h-40 w-40 p-1 bg-white rounded-full" />

              <div className='flex flex-col gap-3'>
                <h1 className='font-bold text-3xl'>SamSameer_Insta</h1>  
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque laudanti ae ratione voluptates   obcaecati odit? Cum!</p>
                <button className='px-3 py-1 bg-white rounded-full border w-40 text-black font-medium text-lg cursor-pointer'>Subscribe</button>
              </div>
            </div>
              <div className='border-1 border-[#3c3c3c] w-full h-0 left-0'></div>
              <SampleVideo/>
        </div>
      </div>
    </div>
  );
}

export default AuthorProfile;