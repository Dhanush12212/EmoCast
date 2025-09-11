import React, { useState, useRef, useEffect } from "react";
import { LuScanFace } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

function WebCamCapture({ onEmotion }) {
  const [syncActive, setSyncActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

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

    if (!syncActive) {
      setSyncActive(true);
      captureThreeFrames();
    } else {
      stopCamera();
      setSyncActive(false);
    }
  };

  const captureFrame = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) return null;

    const canvas = canvasRef.current || document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.7);
  };

  const captureThreeFrames = async () => {
    const video = videoRef.current;
    if (!video) {
      console.error("Video element not found");
      return;
    }

    if (video.readyState < 2) {  
      console.warn("Video not ready yet, waiting...");
      await new Promise(resolve => {
        video.onloadeddata = resolve;
      });
    }

    const frames = [];
    for (let i = 0; i < 3; i++) {
      const frame = captureFrame();
      if (frame) {
        frames.push(frame); 
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log("Captured Frames:", frames);

    if (frames.length === 0) {
      console.error("No frames captured");
    } else if (onEmotion) {
      // Pass frames to parent (parent will handle API call or anything else)
      onEmotion(frames);
    }

    stopCamera();
    setSyncActive(false);
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
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
