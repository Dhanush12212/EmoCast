import React, { useState, useRef, useEffect } from "react";
import { LuScanFace } from "react-icons/lu";
import axios from "axios"; 
import { API_URL } from '../../../config';
import { useEmotion } from '../Contexts/EmotionContext'

function WebCamCapture({ onEmotion }) {
  const [syncActive, setSyncActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);

  const { emotion, setEmotion } = useEmotion();

  // Start webcam
  useEffect(() => {
    let stream;

    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          // Ensure video starts playing
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play()
              .then(() => console.log("Video started playing"))
              .catch(err => console.error("Video play error:", err));
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
  }, []);

  // Handle sync toggle
  const handleCaptureClick = () => {
    const newState = !syncActive;
    setSyncActive(newState);

    if (newState) startSendingFrames();
    else stopSendingFrames();
  };

  const startSendingFrames = () => {
    intervalRef.current = setInterval(sendFrame, 3000); 
  };

  const stopSendingFrames = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const sendFrame = async () => {
    const video = videoRef.current;
    if (!video) return;

    // Check if dimensions are valid
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.warn("⚠️ Video dimensions are zero. Waiting...");
      return;
    }

    const canvas = canvasRef.current || document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw full frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to Base64
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
        if (data && data.emotion) {
          onEmotion(data);
        } else {
          onEmotion({ emotion: "unknown", confidence: 0.0 });
        }
      }
    } catch (err) {
      console.error(" Error sending frame:", err);
      if (onEmotion) onEmotion({ emotion: "error", confidence: 0.0 });
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Sync Button */}
      <div
        className={`flex flex-col items-center justify-center px-5 py-2 cursor-pointer transition-all duration-300 
          ${
            syncActive
              ? "bg-green-600 rounded-2xl shadow-lg transform scale-105 animate-pulse"
              : "bg-transparent rounded-2xl "
          }`}
        onClick={handleCaptureClick}  
        title={syncActive ? "Stop Sync" : "Start Sync"}
      >
        <LuScanFace
          className={`w-6 h-6 mb-1 ${
            syncActive ? "text-white" : "text-gray-200"
          }`}
        />
        <span
          className={`text-md font-medium ${
            syncActive ? "text-white" : "text-gray-200"
          }`}
        >
          {syncActive ? "Stop" : "Sync"}
        </span>
      </div>

      {/* Video container (only visible when syncActive) */}
      <div className={`mt-3 ${syncActive ? "flex" : "hidden"} items-center justify-center`}>
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          playsInline 
          className="border border-green-500 w-26  rounded-lg"
        />
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

export default WebCamCapture;
