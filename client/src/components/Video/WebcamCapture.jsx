import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';

const WebcamCapture = forwardRef(({ className, style }, ref) => {
  const videoRef = useRef();
  let streamRef = null;
  let intervalRef = null;

  const startSync = async () => {
    try {
      streamRef = await navigator.mediaDevices.getUserMedia({ video: true }); // 🔹 Permission popup here
      videoRef.current.srcObject = streamRef;

      // Start sending frames every 3s
      intervalRef = setInterval(async () => {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
        const imageBase64 = canvas.toDataURL('image/jpeg');

        await axios.post('http://localhost:5000/detect_emotion', { image: imageBase64 });
      }, 3000);
    } catch (error) {
      console.error("Camera access denied or unavailable", error);
      alert("Camera permission is required for syncing.");
    }
  };

  const stopSync = () => {
    if (intervalRef) {
      clearInterval(intervalRef);
      intervalRef = null;
    }
    if (streamRef) {
      streamRef.getTracks().forEach(track => track.stop());
      streamRef = null;
    }
    videoRef.current.srcObject = null;
  };

  useImperativeHandle(ref, () => ({
    toggleSync: async (active) => {
      if (active) {
        await startSync();
      } else {
        stopSync();
      }
    }
  }));

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      style={style}
      className={className}
    />
  );
});

export default WebcamCapture;
