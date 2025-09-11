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
const py = spawn("python", [scriptPath]);

const pending = new Map();

function detectEmotion(images) {
  return new Promise((resolve, reject) => {
    const id = randomUUID();
    pending.set(id, { resolve, reject });
    py.stdin.write(JSON.stringify({ id, images }) + "\n");
  });
}

py.stdout.on("data", (data) => {
  const lines = data.toString().trim().split("\n");
  for (const line of lines) {
    try {
      const msg = JSON.parse(line);
      const { id, result, error, status } = msg;

      if (pending.has(id)) {
        if (error) {
          pending.get(id).reject({ message: error, status });
        } else {
          // ✅ Log all detected emotions per frame
          if (result.frames) {
            console.log("Detected emotions per frame:");
            result.frames.forEach((frame, index) => {
              console.log(
                `Frame ${index + 1}: ${frame.emotion} (confidence: ${frame.confidence})`
              );
            });
            console.log("Best result:", result.best);
          }

          pending.get(id).resolve(result);
        }
        pending.delete(id);
      }
    } catch (err) {
      console.error("Failed to parse Python output:", line, err);
    }
  }
});

const detectEmotionRoute = asyncHandler(async (req, res) => {
  const { images } = req.body;
  if (!images || !Array.isArray(images) || images.length === 0) {
    return res.status(400).json({ error: "No images provided" });
  }

  try {
    const emotion = await detectEmotion(images);

    if (!emotion) {
      throw new ApiError(422, "No emotion detected");
    }

    return res.status(200).json({
      success: true,
      emotion,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new ApiError(
      error.status || error.response?.status || 500,
      error.message || "Error detecting emotion"
    );
  }
});

// Fetch videos by emotion
const fetchVideosByEmotionRoute = asyncHandler(async (req, res) => {
  const emotion = req.query.emotion;
  console.log("Emotion:", emotion);

  if (!emotion) return res.status(400).json({ error: "No emotion provided" });

  try {
    const searchResponse = await axios.get(SEARCH_API_URL, {
      params: {
        part: "snippet",
        regionCode: "IN",
        q: `${emotion} relaxing videos`,
        type: "video",
        maxResults: 30,
        key: YOUTUBE_API_KEY,
      },
    });

    if (!searchResponse?.data?.items) {
      throw new ApiError(404, "No videos found");
    }

    const videoIds = searchResponse.data.items
      .map((item) => item.id.videoId)
      .filter(Boolean);

    if (videoIds.length === 0) {
      throw new ApiError(404, "No valid video IDs found");
    }

    const detailsResponse = await axios.get(YOUTUBE_API_URL, {
      params: {
        part: "snippet,contentDetails,statistics",
        id: videoIds.join(","),
        key: YOUTUBE_API_KEY,
      },
    });

    const videos = detailsResponse.data.items.map((item) => {
      const channelId = item.snippet.channelId;
      return {
        videoId: item.id,
        thumbnailUrl: item.snippet?.thumbnails?.high?.url || "",
        title: item.snippet?.title || "No title",
        description: item.snippet?.description || "No description available",
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
        channelId,
      };
    });

    return res.status(200).json({
      success: true,
      emotion,
      videos,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new ApiError(
      error.response?.status || 500,
      error.message || "Error fetching videos"
    );
  }
});

export { detectEmotionRoute, fetchVideosByEmotionRoute };
