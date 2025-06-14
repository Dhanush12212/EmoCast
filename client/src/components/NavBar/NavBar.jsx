import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdMic } from 'react-icons/md'; 
import { IoSearchOutline, IoReorderThreeOutline } from 'react-icons/io5';
import { FaRegBell } from 'react-icons/fa';  
import { assets } from '../../assets/assets';
import SideFullBar from './SideFullBar'; 
import ProfileBar from './ProfileBar';

function NavBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      navigate(`/search/${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const startListening = () => {
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchTerm(transcript);
        handleSearchSubmit(); // auto-submit after speech
      };

      recognitionRef.current.onend = () => {
        setListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event);
        setListening(false);
      };
    }

    recognitionRef.current.start();
    setListening(true);
  };

  return (
    <div className="flex items-center justify-between w-full px-6 py-0 z-10 fixed top-0 bg-[#121212]">

      {/* div #1 - Left section */}
      <div className='flex w-[12%] items-center justify-around'>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <IoReorderThreeOutline className="w-10 h-10 text-white hover:bg-[#222222] rounded-full cursor-pointer hover:p-2" />
        </button>  

        {isSidebarOpen && (
          <div className="fixed top-20 left-0 h-full z-40">
            <SideFullBar />
          </div>
        )}

        <img className="w-42" src={assets.YouTube} alt="YouTube Logo" />
      </div> 

      {/* div #2 - Center section */}
      <div className='flex min-w-[50%] items-center'> 
        {/* Search bar */}
        <div className="flex mx-5 border border-[#383838] w-full h-14 bg-[#222222] pr-4 rounded-full items-center">
          <input
            className="border border-[#222222] w-full outline-none pl-10 pr-2 py-2 h-14 text-xl rounded-l-full bg-[#121212] hover:border-blue-700 text-white"
            placeholder="Search"
            type="search"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
          <IoSearchOutline 
            className="w-9 h-10 text-white ml-5 mr-3 cursor-pointer"  
            onClick={handleSearchSubmit}  
          /> 
        </div>

        {/* Mic button */}
        <button
          onClick={startListening}
          className={`border-0 rounded-full bg-[#222222] p-2 h-12 hover:bg-[#3F3F3F] transition-colors ${
            listening ? "animate-pulse bg-red-600" : ""
          }`}
          title={listening ? "Listening..." : "Start voice input"}
        >
          <MdMic className="w-8 h-8 text-white" />
        </button>
      </div>

      {/* div #3 - Right section */}
      <div className="flex items-center justify-end gap-6 w-[25%]"> 
        <div className='p-2 h-12 hover:bg-[#3F3F3F] hover:rounded-full'>
          <FaRegBell className="w-8 h-8 text-white" />
        </div>

        <button onClick={() => setIsProfileOpen(!isProfileOpen)}>
          <img
            src={assets.Profile}
            alt="Profile"
            className="h-12 w-12 rounded-full object-cover cursor-pointer"
          />
          
        </button>  

        {isProfileOpen && (
          <div className="fixed top-3 right-25 z-40"> 
            <ProfileBar />
          </div>
        )}
      </div>
    </div>
  );
}

export default NavBar;
