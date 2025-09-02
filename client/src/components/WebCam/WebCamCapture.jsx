import React, { useState, useRef, useEffect } from "react";
import { LuScanFace } from "react-icons/lu";
import axios from "axios";

function WebCamCapture({ onEmotion }) {
  const [syncActive, setSyncActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);

  // Start webcam
  useEffect(() => {
    let stream;

    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
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
    intervalRef.current = setInterval(sendFrame,3000); 
  };

  const stopSendingFrames = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const sendFrame = async () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = canvasRef.current || document.createElement("canvas");
    canvas.width = 224;
    canvas.height = 224;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw center-cropped frame
    const s = Math.min(video.videoWidth, video.videoHeight);
    ctx.drawImage(
      video,
      (video.videoWidth - s) / 2,
      (video.videoHeight - s) / 2,
      s,
      s,
      0,
      0,
      224,
      224
    );

    // Convert to Base64
    const dataURL = canvas.toDataURL("image/jpeg", 0.7);

    try { 
      const response = await axios.post( "/api/emotion", 
        { image: dataURL },
        { withCredentials: true }
      );

      // Call callback with emotion data
      if (onEmotion) onEmotion(response.data);
    } catch (err) {
      console.error("Error sending frame:", err);
    }
  };

  return (
    <div>
      <div
        className={`flex flex-col items-center justify-center px-5 py-2 cursor-pointer transition-all duration-300 mt-2
          ${
            syncActive
              ? "bg-red-600 rounded-2xl shadow-lg transform scale-105 animate-pulse"
              : "bg-gray-800 rounded-2xl hover:bg-gray-700"
          }`}
        onClick={handleCaptureClick}
        title={syncActive ? "Stop Sync" : "Start Sync"}
      >
        <LuScanFace
          className={`w-8 h-8 mb-1 ${
            syncActive ? "text-white" : "text-gray-200"
          }`}
        />
        <span
          className={`text-sm font-medium ${
            syncActive ? "text-white" : "text-gray-200"
          }`}
        >
          {syncActive ? "Stop" : "Sync"}
        </span>
      </div>

      <video ref={videoRef} autoPlay muted playsInline className="hidden" />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

export default WebCamCapture;
