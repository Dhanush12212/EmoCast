import sys
import json

# Dummy function - replace with your actual ML detection
def detect_single_frame(img_base64):
    # Example: returns fake results
    import random
    emotions = ["happy", "sad", "neutral", "angry", "surprised", "unknown"]
    emotion = random.choice(emotions)
    confidence = round(random.uniform(0.5, 0.99), 2)
    return {"emotion": emotion, "confidence": confidence}

def detect_emotion(images_base64_list):
    frame_results = []
    for img in images_base64_list:
        result = detect_single_frame(img)
        frame_results.append(result)

    if not frame_results:
        return {"error": "No frames processed", "status": 400}

    if all(r["emotion"] == "unknown" for r in frame_results):
        return {"error": "No emotion detected", "status": 422}

    best_result = max(frame_results, key=lambda r: r["confidence"])

    return {
        "frames": frame_results,   # ✅ all frames
        "best": best_result        # ✅ most confident result
    }

# Keep service alive
for line in sys.stdin:
    try:
        data = json.loads(line)
        req_id = data.get("id")
        images = data.get("images")

        if not images:
            result = {"error": "No images provided", "status": 400}
        else:
            result = detect_emotion(images)

        if "error" in result:
            sys.stdout.write(json.dumps({
                "id": req_id,
                "error": result["error"],
                "status": result.get("status", 500)
            }) + "\n")
        else:
            sys.stdout.write(json.dumps({
                "id": req_id,
                "result": result
            }) + "\n")

        sys.stdout.flush()
    except Exception as e:
        sys.stdout.write(json.dumps({
            "id": data.get("id"),
            "error": str(e),
            "status": 500
        }) + "\n")
        sys.stdout.flush()
