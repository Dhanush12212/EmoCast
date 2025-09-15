import sys
import json
import base64
import cv2
import os
import numpy as np
from tensorflow.keras.models import load_model

# Paths
script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, "facialemotionmodel.h5")

# Load model
try:
    model = load_model(model_path)
    sys.stderr.write("✅ Model loaded successfully\n")
    sys.stderr.flush()
except Exception as e:
    sys.stderr.write(f"❌ Failed to load model: {e}\n")
    sys.stderr.flush()
    sys.exit(1)

# Emotion labels (must match training dataset order)
emotion_labels = ["angry", "disgust", "fear", "happy", "sad", "surprise", "neutral"]

# Haar cascade for face detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

def base64_to_image(img_base64):
    """Decode base64 image to OpenCV format."""
    try:
        img_data = base64.b64decode(img_base64.split(",")[1])
        np_arr = np.frombuffer(img_data, np.uint8)
        return cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    except Exception as e:
        sys.stderr.write(f"❌ Error decoding image: {e}\n")
        sys.stderr.flush()
        return None

def preprocess_frame(img):
    """Convert image to grayscale, detect face, resize to 48x48."""
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)

    if len(faces) == 0:
        return None  # 🚨 no face detected

    (x, y, w, h) = faces[0]
    roi_gray = gray[y:y+h, x:x+w]
    roi_resized = cv2.resize(roi_gray, (48, 48))
    roi_normalized = roi_resized.astype("float32") / 255.0
    roi_reshaped = np.expand_dims(roi_normalized, axis=(0, -1))  # shape (1,48,48,1)
    return roi_reshaped

def detect_single_frame(img_base64):
    """Run emotion detection on a single frame."""
    img = base64_to_image(img_base64)
    if img is None:
        return {"emotion": "unknown", "confidence": 0.0}

    processed = preprocess_frame(img)
    if processed is None:  # 🚨 no face detected
        return {"emotion": "unknown", "confidence": 0.0}

    preds = model.predict(processed, verbose=0)[0]
    best_idx = int(np.argmax(preds))
    confidence = float(preds[best_idx])

    if confidence < 0.2:  # 👈 threshold check
        return {"emotion": "unknown", "confidence": round(confidence, 3)}

    return {
        "emotion": emotion_labels[best_idx],
        "confidence": round(confidence, 3)
    }

def detect_emotion(images_base64_list):
    """Process frames (here usually only 1) and return best prediction."""
    frame_results = [detect_single_frame(img) for img in images_base64_list if img]

    if not frame_results:
        return {"frames": [], "best": {"emotion": "unknown", "confidence": 0.0}}

    # Select best prediction by confidence
    best_result = max(frame_results, key=lambda r: r["confidence"])

    # Apply threshold again to best result
    if best_result["confidence"] < 0.2:
        best_result = {"emotion": "unknown", "confidence": best_result["confidence"]}

    return {"frames": frame_results, "best": best_result}

# Main loop
for line in sys.stdin:
    try:
        data = json.loads(line)
        req_id = data.get("id")
        images = data.get("images")

        if not images:
            result = {"frames": [], "best": {"emotion": "unknown", "confidence": 0.0}}
        else:
            result = detect_emotion(images)

        sys.stdout.write(json.dumps({
            "id": req_id,
            "result": result
        }) + "\n")
        sys.stdout.flush()

    except Exception as e:
        sys.stderr.write(f"Exception in main loop: {e}\n")
        sys.stderr.flush()
        sys.stdout.write(json.dumps({
            "id": data.get("id") if 'data' in locals() else None,
            "result": {"frames": [], "best": {"emotion": "unknown", "confidence": 0.0}},
            "error": str(e),
            "status": 500
        }) + "\n")
        sys.stdout.flush()
