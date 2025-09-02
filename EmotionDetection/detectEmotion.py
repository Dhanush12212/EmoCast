import sys, json, base64, cv2, numpy as np, os
from keras.models import load_model

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model = load_model(os.path.join(BASE_DIR, "facialemotionmodel.h5"))
haar_file = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
face_cascade = cv2.CascadeClassifier(haar_file)

labels = {
    0: 'angry', 1: 'disgust', 2: 'fear',
    3: 'happy', 4: 'neutral', 5: 'sad', 6: 'surprise'
}

def extract_features(image):
    feature = np.array(image).reshape(1, 48, 48, 1) / 255.0
    return feature

def detect_emotion(image_base64):
    if "," in image_base64:
        image_base64 = image_base64.split(",")[1]

    img_bytes = base64.b64decode(image_base64)
    frame = cv2.imdecode(np.frombuffer(img_bytes, np.uint8), cv2.IMREAD_COLOR)

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)

    best_result = {"emotion": "unknown", "confidence": 0.0}
    for (x,y,w,h) in faces:
        roi = cv2.resize(gray[y:y+h, x:x+w], (48,48))
        pred = model.predict(extract_features(roi), verbose=0)
        label = labels[pred.argmax()]
        conf = float(np.max(pred))
        if conf > best_result["confidence"]:
            best_result = {"emotion": label, "confidence": conf}
    return best_result

# Keep service alive
for line in sys.stdin:
    try:
        data = json.loads(line)
        req_id = data.get("id")
        image = data.get("image")
        result = detect_emotion(image)
        sys.stdout.write(json.dumps({"id": req_id, "result": result}) + "\n")
        sys.stdout.flush()
    except Exception as e:
        sys.stdout.write(json.dumps({"id": data.get("id"), "error": str(e)}) + "\n")
        sys.stdout.flush()
