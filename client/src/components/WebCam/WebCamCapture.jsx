import React, { useState, useRef, useEffect } from "react";
import { LuScanFace } from "react-icons/lu";
import axios from "axios"; 
import { API_URL } from "../../../config";
import { useEmotion } from "../Contexts/EmotionContext";
import { useNavigate } from "react-router-dom";

function WebCamCapture({ onEmotion }) {
  const [syncActive, setSyncActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  const { emotion, setEmotion } = useEmotion();
 
  const isLoggedIn = Boolean(localStorage.getItem("user"));  
 
  useEffect(() => {
    let stream;
    if (!syncActive) return;

    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch(err => console.error("Video play error:", err));
          };
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    })();

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [syncActive]);
 
  const handleCaptureClick = () => {
    if (!isLoggedIn) {
      navigate("/login");  
      return;
    }

    const newState = !syncActive;
    setSyncActive(newState);

    if (newState) startSendingFrames();
    else stopSendingFrames();
  };

  const startSendingFrames = () => {
    intervalRef.current = setInterval(sendFrame, 3000); 

    setTimeout(() => {
      stopSendingFrames();
      setSyncActive(false);  
    }, 6000);
  };

  const stopSendingFrames = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const sendFrame = async () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) return;

    const canvas = canvasRef.current || document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL("image/jpeg", 0.9);

    try { 
      const response = await axios.post(
        `${API_URL}/emotion/detectEmotion`,
        { image: dataURL },
        { withCredentials: true }
      );

      const data = response.data;
      if (data?.emotion) {
        setEmotion(data.emotion); 
      }

      if (onEmotion) {
        onEmotion(data?.emotion ? data : { emotion: "unknown", confidence: 0.0 });
      }
    } catch (err) {
      console.error("Error sending frame:", err);
      if (onEmotion) onEmotion({ emotion: "error", confidence: 0.0 });
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Sync Button */}
      <div
        className={`flex flex-col items-center justify-center px-5 py-2 cursor-pointer transition-all duration-300 
          ${syncActive
            ? "bg-green-600 rounded-2xl shadow-lg transform scale-105 animate-pulse"
            : "bg-transparent rounded-2xl "
          }`}
        onClick={handleCaptureClick}  
        title={syncActive ? "Stop Sync" : "Start Sync"}
      >
        <LuScanFace
          className={`w-6 h-6 mb-1 ${syncActive ? "text-white" : "text-gray-200"}`}
        />
        <span
          className={`text-md font-medium ${syncActive ? "text-white" : "text-gray-200"}`}
        >
          {syncActive ? "Stop" : "Sync"}
        </span>
      </div>

      {/* Video container */}
      <div className={`mt-3 ${syncActive ? "flex" : "hidden"} items-center justify-center`}>
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          playsInline 
          className="border border-green-500 w-26 rounded-lg"
        />
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

export default WebCamCapture; 