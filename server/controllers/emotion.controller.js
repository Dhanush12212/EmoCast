import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const detectEmotion = (req, res) => {
  const { image } = req.body;

  // Absolute path to Python script
  const scriptPath = path.join(__dirname, "../../EmotionDetection/detectEmotion.py");

  const py = spawn("python3", [scriptPath]);

  let dataString = "";

  py.stdout.on("data", (data) => {
    dataString += data.toString();
  });

  py.stderr.on("data", (data) => {
    console.error("Python error:", data.toString());
  });

  py.on("close", () => {
    try {
      const result = JSON.parse(dataString);
      res.json(result);
    } catch (err) {
      console.error("Failed to parse Python response:", err);
      res.status(500).json({ error: "Emotion detection failed" });
    }
  });

  // Send base64 image to Python script
  py.stdin.write(JSON.stringify({ image }));
  py.stdin.end();
};
