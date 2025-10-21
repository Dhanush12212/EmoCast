import React, { useState, useRef, useEffect } from "react";
import { LuScanFace } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config";
import { useEmotion } from "../Contexts/EmotionContext";
import Swal from "sweetalert2";

function WebCamCapture({ onEmotion }) {
  const [syncActive, setSyncActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();
  const { setEmotion } = useEmotion();

  const isLoggedIn = Boolean(localStorage.getItem("user"));

  // Setup webcam stream
  useEffect(() => {
    if (!syncActive) return;

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => videoRef.current.play().catch(console.error);
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    })();

    return () => stopCamera();
  }, [syncActive]);

  // Ensure video is ready before capturing
  const waitForVideo = () =>
    new Promise((resolve) => {
      const check = () => {
        if (videoRef.current && videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
          resolve();
        } else {
          requestAnimationFrame(check);
        }
      };
      check();
    });

  // Capture a single frame from video
  const captureFrame = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) return null;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg", 0.5);
  };

  // Capture 3 frames
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
      const unknown = "unknown";
      onEmotion?.({ emotion: unknown, confidence: 0 });
      setEmotion(unknown);
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/emotion/detectEmotion`,
        { images: frames },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      const detected = response.data?.emotion || { emotion: "unknown", confidence: 0 };
      const emotionStr = detected.emotion || "unknown";

      // Update context and callback
      setEmotion(emotionStr);
      onEmotion?.({ emotion: emotionStr, confidence: detected.confidence });

      console.log("Detected emotion:", detected);
    } catch (err) {
      console.error("Error sending frames:", err);
      const errorEmotion = "error";
      setEmotion(errorEmotion);
      onEmotion?.({ emotion: errorEmotion, confidence: 0 });
    }
  };

  const handleCaptureClick = async () => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: "info",
        title: "🔒 Login Required",
        text: "You need to log in before syncing your emotions.",
        confirmButtonText: "Okay",
        confirmButtonColor: "#e50914",
        background: "#1e1e1e",
        color: "#fff",
        customClass: {
          popup: "max-w-[90%] sm:max-w-[400px] md:max-w-[480px] rounded-2xl px-4 py-6", // responsive sizing
          title: "text-base sm:text-lg md:text-xl font-semibold text-center",
          htmlContainer: "text-xs sm:text-sm md:text-base text-gray-300 text-center",
          confirmButton: "text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg font-medium",
        },
      });
      return;
    }

    if (syncActive || isCapturing) return;

    setSyncActive(true);
    setIsCapturing(true);
    await waitForVideo();
    captureThreeFrames();
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  return (
    <div className="flex flex-col items-center">
      {/* Sync Button */}
      <div
        className={`flex flex-col items-center justify-center px-4 py-2 cursor-pointer transition-all duration-300 w-24
          ${syncActive ? "bg-green-600 rounded-2xl shadow-lg transform scale-105 animate-pulse" : "bg-transparent rounded-2xl"}
          ${isCapturing ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={handleCaptureClick}
        title={syncActive ? "Capturing..." : "Start Sync"}
      >
        <LuScanFace className={`w-6 h-6 mb-1 ${syncActive ? "text-white" : "text-gray-200"}`} />
        <span className={`hidden md:flex text-md font-medium ${syncActive ? "text-white" : "text-gray-200"}`}>
          {syncActive ? "Capturing..." : "Sync"}
        </span>
      </div>

      {/* Video preview */}
      <div className={`mt-3 ${syncActive ? "flex" : "hidden"} items-center justify-center`}>
        <video ref={videoRef} autoPlay muted playsInline className="border border-green-500 w-24 rounded-lg" />
      </div>
    </div>
  );
}

export default WebCamCapture;
