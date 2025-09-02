// detectEmotionController.js
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const scriptPath = path.join(__dirname, "../../EmotionDetection/detectEmotion.py");
const py = spawn("python", [scriptPath]);

const pending = new Map();

// Handle ALL python responses in one place
py.stdout.on("data", (data) => {
  const lines = data.toString().trim().split("\n");
  for (const line of lines) {
    try {
      const msg = JSON.parse(line);
      const { id, result, error } = msg;
      if (pending.has(id)) {
        if (error) pending.get(id).reject(error);
        else pending.get(id).resolve(result);
        pending.delete(id);
      }
    } catch (err) {
      console.error("❌ Failed to parse Python output:", line, err);
    }
  }
});

py.stderr.on("data", (data) => {
  console.error("🐍 Python error:", data.toString());
});

function detectEmotion(image) {
  return new Promise((resolve, reject) => {
    const id = randomUUID();
    pending.set(id, { resolve, reject });
    py.stdin.write(JSON.stringify({ id, image }) + "\n");
  });
}

// Controller
export const detectEmotionRoute = async (req, res) => {
  const { image } = req.body;
  if (!image) return res.status(400).json({ error: "No image provided" });

  try {
    const result = await detectEmotion(image);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
};
