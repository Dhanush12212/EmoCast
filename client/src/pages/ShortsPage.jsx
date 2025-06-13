import React from 'react'
import NavBar from '../components/NavBar/NavBar'
import SideBar from '../components/NavBar/SideBar'

function ShortsPage() {
  return (
    <div className='w-full h-screen'>
      <div className="fixed top-0 left-0 w-full z-50">
        <NavBar />
      </div>
      <div className="fixed top-0 left-0 w-full z-50">
        <SideBar/> 
      </div>
      <div className="flex justify-center items-center h-full">
        <div className="w-[500px] max-w-[90%] aspect-[9/12] mt-10 bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/PhcJ0kltQpI?autoplay=1&mute=1"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  )
}

export default ShortsPage 
