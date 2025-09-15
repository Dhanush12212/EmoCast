import React, { useState, useRef, useEffect } from "react";
import { LuScanFace } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config";

function WebCamCapture({ onEmotion }) {
  const [syncActive, setSyncActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  const isLoggedIn = Boolean(localStorage.getItem("user"));

  // Setup webcam stream when sync is active
  useEffect(() => {
    if (!syncActive) return;

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current
              .play()
              .catch((err) => console.error("Video play error:", err));
          };
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    })();

    return () => {
      stopCamera();
    };
  }, [syncActive]);

  // Ensure video is ready before capturing
  const waitForVideo = () => {
    return new Promise((resolve) => {
      const check = () => {
        if (
          videoRef.current &&
          videoRef.current.videoWidth > 0 &&
          videoRef.current.videoHeight > 0
        ) {
          resolve();
        } else {
          requestAnimationFrame(check);
        }
      };
      check();
    });
  };
 
  const captureFrame = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      console.warn("Video not ready or closed.");
      return null;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.5);
    console.log(
      `Captured frame (${canvas.width}x${canvas.height}) length: ${dataUrl.length}`
    );
    return dataUrl;
  };

  const captureThreeFrames = async () => {
    const frames = [];

    for (let i = 0; i < 3; i++) {
      const frame = captureFrame();
      if (frame) frames.push(frame);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    stopCamera();
    setSyncActive(false);
    setIsCapturing(false);

    if (frames.length === 0) {
      if (onEmotion) onEmotion({ emotion: "unknown", confidence: 0.0 });
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/emotion/detectEmotion`,
        { images: frames },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log("Server response:", response.data.emotion);

      if (onEmotion) {
        onEmotion(
          response.data?.emotion
            ? response.data.emotion
            : { emotion: "unknown", confidence: 0.0 }
        );
      }
    } catch (err) {
      console.error(" Error sending frames:", err);
      if (onEmotion) onEmotion({ emotion: "error", confidence: 0.0 });
    }
  };

  // Handle click
  const handleCaptureClick = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (syncActive || isCapturing) return;

    setSyncActive(true);
    setIsCapturing(true);
    await waitForVideo();
    captureThreeFrames();  
  };

  // Stop webcam completely
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Sync Button */}
      <div
        className={`flex flex-col items-center justify-center px-4 py-2 cursor-pointer transition-all duration-300  w-24
          ${
            syncActive
              ? "bg-green-600 rounded-2xl shadow-lg transform scale-105 animate-pulse"
              : "bg-transparent rounded-2xl"
          } ${isCapturing ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={handleCaptureClick}
        title={syncActive ? "Capturing..." : "Start Sync"}
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
          {syncActive ? "Capturing..." : "Sync"}
        </span>
      </div>

      {/* Video container */}
      <div
        className={`mt-3 ${
          syncActive ? "flex" : "hidden"
        } items-center justify-center`}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="border border-green-500 w-24 rounded-lg"
        />
      </div>
    </div>
  );
}

export default WebCamCapture;
