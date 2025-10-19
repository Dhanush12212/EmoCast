import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdMic } from 'react-icons/md';
import { IoSearchOutline, IoReorderThreeOutline } from 'react-icons/io5';
import { FaRegBell } from 'react-icons/fa';
import { assets } from '../../assets/assets';
import SideFullBar from './SideFullBar';
import ProfileBar from './ProfileBar';
import { useAuth } from '../Contexts/AuthContext';
import WebCamCapture from '../WebCam/WebCamCapture';

function NavBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const { user } = useAuth();

  const recognitionRef = useRef(null);
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const navigate = useNavigate();

  const handleSearchChange = (event) => setSearchTerm(event.target.value);
  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      navigate(`/search/${encodeURIComponent(searchTerm.trim())}`);
    }
  };
  const handleKeyDown = (e) => e.key === 'Enter' && handleSearchSubmit();

  const startListening = () => {
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser.');
      return;
    }
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchTerm(transcript);
        handleSearchSubmit();
      };
      recognitionRef.current.onend = () => setListening(false);
      recognitionRef.current.onerror = () => setListening(false);
    }
    recognitionRef.current.start();
    setListening(true);
  };

  return (
    <div className="flex items-center justify-between w-full px-3 sm:px-6 py-2 fixed top-0 bg-[#121212] z-10">
      {/* Left Section */}
      <div className="flex items-center gap-2 sm:gap-4 w-[30%] sm:w-[15%]">
        {/* Sidebar Toggle */}
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <IoReorderThreeOutline className="w-8 h-8 sm:w-9 sm:h-9 text-white hover:bg-[#222222] rounded-full cursor-pointer p-1" />
        </button>

        {/* Sidebar */}
        {isSidebarOpen && (
          <div className="fixed top-14 sm:top-20 left-0 h-full z-40 bg-[#121212]/90 backdrop-blur-md transition-all">
            <SideFullBar />
          </div>
        )}

        {/* YouTube Logo */}
        <img
          className="w-28 sm:w-36 object-contain"
          src={assets.YouTube}
          alt="YouTube Logo"
        />
      </div>

      {/* Center Section */}
      <div className="flex items-center justify-center w-[50%] sm:w-[55%] gap-2 sm:gap-4">
        <div className="flex items-center w-full border border-[#383838] bg-[#222222] rounded-full h-10 sm:h-12 pr-2 sm:pr-4">
          <input
            className="w-full bg-[#222222] text-white text-sm sm:text-base outline-none pl-4 sm:pl-6 pr-2 sm:pr-3 rounded-l-full"
            placeholder="Search"
            type="search"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
          <IoSearchOutline
            className="w-6 h-6 sm:w-7 sm:h-7 text-white cursor-pointer"
            onClick={handleSearchSubmit}
          />
        </div>

        {/* Mic (hidden on very small devices) */}
        <button
          onClick={startListening}
          className={`hidden sm:flex items-center justify-center rounded-full bg-[#222222] p-2 sm:p-3 hover:bg-[#3F3F3F] transition-colors ${
            listening ? 'animate-pulse bg-red-600' : ''
          }`}
          title={listening ? 'Listening...' : 'Start voice input'}
        >
          <MdMic className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-end gap-3 sm:gap-6 w-[20%] sm:w-[15%]">
        {/* Notification Bell */}
        <button className="hidden sm:block">
          <FaRegBell className="w-5 h-5 sm:w-6 sm:h-6 text-white cursor-pointer" />
        </button>

        {/* Profile */}
        <button onClick={() => setIsProfileOpen(!isProfileOpen)}>
          <img
            src={assets.Profile || user?.profilePic}
            alt="Profile"
            className="h-9 w-9 sm:h-11 sm:w-11 rounded-full object-cover border border-gray-600 hover:scale-105 transition-transform"
          />
        </button>

        {/* Profile Bar */}
        {isProfileOpen && (
          <div className="fixed top-14 sm:top-3 right-3 sm:right-10 z-40">
            <ProfileBar />
          </div>
        )}
      </div>
    </div>
  );
}

export default NavBar;
