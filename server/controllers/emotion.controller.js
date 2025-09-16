import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import ApiError from "../utils/ApiError.utils.js";
import { formatNumber, timeAgo, parseDuration } from "../utils/Formatters.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import axios from "axios";

const SEARCH_API_URL = process.env.SEARCH_API_URL;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = process.env.YOUTUBE_API_URL;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const scriptPath = path.join(__dirname, "../../EmotionDetection/detectEmotion.py");

let py = null;
const pending = new Map();
let restarting = false;

function startPython() {
  py = spawn("python", [scriptPath], { stdio: ["pipe", "pipe", "pipe"] });
  attachPythonListeners();
  console.log("Python process started (PID:", py.pid, ")");
}

function restartPython() {
  if (restarting) return;
  restarting = true;

  setTimeout(() => {
    startPython();
    restarting = false;
  }, 1000);
}

function attachPythonListeners() {
  py.stdout.on("data", (data) => {
    const lines = data.toString().trim().split("\n");
    for (const line of lines) {
      try {
        const msg = JSON.parse(line);
        const { id, result, error, status } = msg;

        if (pending.has(id)) {
          if (error) {
            pending.get(id).reject(new ApiError(status || 500, error));
          } else {
            pending.get(id).resolve(result);
          }
          pending.delete(id);
        }
      } catch (err) {
        console.error("Failed to parse Python output:", line);
        console.error("Raw data from Python:", data.toString());
      }
    }
  });

  py.stderr.on("data", (data) => {
    console.error("Python stderr:", data.toString().trim());
  });

  py.on("exit", (code, signal) => {
    console.error(`Python exited (code: ${code}, signal: ${signal})`);
    for (const [id, { reject }] of pending) {
      reject(new ApiError(500, "Python process crashed"));
    }
    pending.clear();
    restartPython();
  });
}

startPython();

function detectEmotion(images) {
  return new Promise((resolve, reject) => {
    if (!py || py.exitCode !== null || !py.stdin.writable) {
      return reject(new ApiError(500, "Python process not available"));
    }

    const id = randomUUID();
    pending.set(id, { resolve, reject });

    const payload = JSON.stringify({ id, images }) + "\n";

    try {
      py.stdin.write(payload, (err) => {
        if (err) {
          console.error("Failed to write to Python stdin:", err);
          pending.delete(id);
          reject(new ApiError(500, "Failed to communicate with Python"));
        }
      });
    } catch (err) {
      console.error("Exception writing to Python:", err);
      pending.delete(id);
      reject(new ApiError(500, "Python communication error"));
    }

    setTimeout(() => {
      if (pending.has(id)) {
        pending.get(id).reject(new ApiError(504, "Python response timeout"));
        pending.delete(id);
      }
    }, 10000);
  });
}

const detectEmotionRoute = asyncHandler(async (req, res) => {
  let { image, images } = req.body;

  if (image && !images) images = [image];
  if (!images || !Array.isArray(images) || images.length === 0) {
    console.error("No image(s) provided to detectEmotionRoute");
    return res.status(400).json({ error: "No image(s) provided" });
  }

  console.log(`📸 Received ${images.length} frame(s) in route`);

  try {
    const result = await detectEmotion(images);

    let best = result.best || { emotion: "unknown", confidence: 0.0 };

    // Only accept if confidence > 0.2
    if (!best.emotion || best.confidence <= 0.2) {
      best = { emotion: "unknown", confidence: 0.0 };
    }

    console.log("Best result:", best);

    return res.status(200).json({
      success: true,
      emotion: best,
      frames: result.frames || [],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in detectEmotionRoute:", error.message);
    return res.status(error.status || 500).json({
      success: false,
      error: error.message || "Error detecting emotion",
    });
  }
});

const fetchVideosByEmotionRoute = asyncHandler(async (req, res) => {
  const { emotion, pageToken } = req.query;

  if (!emotion || emotion.toLowerCase() === "unknown" || emotion.toLowerCase() === "none") {
    console.error("No face detected (emotion unknown/none)");
    return res.status(404).json({ success: false, error: "No Face Detected" });
  }

  const emotionKey = emotion.toLowerCase();

  const emotionQueries = {
    happy: "happy songs OR feel-good videos OR fun vlogs OR comedy",
    sad: "sad songs OR emotional music OR comforting videos OR motivational talks",
    angry: "calming music OR anger management tips OR relaxing nature sounds",
    surprise: "surprising facts OR amazing videos OR shocking moments OR wow content",
    disgust: "funny videos OR wholesome content OR uplifting videos",
    fear: "motivational talks OR confidence boosting OR relaxation music",
    neutral: "popular trending videos OR chill content OR relaxing playlists",
  };

  const query = emotionQueries[emotionKey] || emotionKey;

  try {
    // Step 1: Search videos
    const searchResponse = await axios.get(SEARCH_API_URL, {
      params: {
        part: "snippet",
        regionCode: "IN",
        q: query,
        type: "video",
        videoDuration: "medium",
        maxResults: 30,
        pageToken: pageToken || "", // <-- support pagination
        key: YOUTUBE_API_KEY,
      },
    });

    const items = searchResponse?.data?.items || [];
    if (items.length === 0) {
      console.error(`No videos found for emotion: ${emotion}`);
      return res.status(404).json({ success: false, error: `No videos for ${emotion}` });
    }

    const videoIds = items.map((item) => item.id.videoId).filter(Boolean);
    if (videoIds.length === 0) {
      console.error("No valid video IDs returned from YouTube API");
      return res.status(404).json({ success: false, error: "No valid video IDs" });
    }

    // Step 2: Fetch video details
    const detailsResponse = await axios.get(YOUTUBE_API_URL, {
      params: {
        part: "snippet,contentDetails,statistics",
        id: videoIds.join(","),
        key: YOUTUBE_API_KEY,
      },
    });

    const videos = detailsResponse.data.items.map((item) => ({
      videoId: item.id,
      thumbnailUrl: item.snippet?.thumbnails?.high?.url || "",
      title: item.snippet?.title || "No title",
      description: item.snippet?.description || "No description",
      channelTitle: item.snippet?.channelTitle || "Unknown Channel",
      channelThumbnail:
        item.snippet?.thumbnails?.high?.url ||
        item.snippet?.thumbnails?.medium?.url ||
        item.snippet?.thumbnails?.default?.url,
      publishDate: timeAgo(item.snippet?.publishedAt || ""),
      publishAt: item.snippet?.publishedAt || "",
      viewCount: formatNumber(item.statistics?.viewCount ?? "0"),
      duration: item.contentDetails?.duration
        ? parseDuration(item.contentDetails.duration)
        : "0:00",
      channelId: item.snippet.channelId,
    }));

    return res.status(200).json({
      success: true,
      bestEmotion: emotion,
      videos,
      nextPageToken: searchResponse.data.nextPageToken || null, // <-- return nextPageToken
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in fetchVideosByEmotionRoute:", error.message);
    const status = error.response?.status || error.status || 500;
    const message = error.response?.data?.error || error.message || "Error fetching videos";

    return res.status(status).json({
      success: false,
      error: message,
    });
  }
});


export { detectEmotionRoute, fetchVideosByEmotionRoute };
