def detect_emotion(images_base64_list):
    frame_results = []
    for img in images_base64_list:
        result = detect_single_frame(img)
        frame_results.append(result)

    if not frame_results:
        return {"error": "No frames processed", "status": 400}

    # If all 3 results are unknown → return error with status
    if all(r["emotion"] == "unknown" for r in frame_results):
        return {"error": "No emotion detected", "status": 422}

    # Otherwise, pick the most confident result
    best_result = max(frame_results, key=lambda r: r["confidence"])
    return best_result

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
