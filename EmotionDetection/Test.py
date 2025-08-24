#!/usr/bin/env python
# coding: utf-8

from keras.models import load_model
import cv2
import numpy as np

# Load the fixed/converted model
# (either the directory or .h5, depending on how you saved)
model = load_model("model_converted.h5")   # or "model_converted.h5"

print("✅ Model loaded successfully")
print(model.input_shape)
model.summary()

# Define your emotion labels (adjust to your training)
class_labels = ['Angry','Happy','Neutral','Sad','Surprise']

# Load Haar Cascade for face detection
face_classifier = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
print("Cascade loaded:", not face_classifier.empty())

# Start video capture
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break
    
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_classifier.detectMultiScale(gray, 1.3, 5)
    print("Faces detected:", len(faces))

    for (x, y, w, h) in faces:
        cv2.rectangle(frame,(x,y),(x+w,y+h),(255,0,0),2)
        roi_gray = gray[y:y+h, x:x+w]
        roi_gray = cv2.resize(roi_gray,(48,48), interpolation=cv2.INTER_AREA)

        if np.sum(roi_gray) != 0:
            roi = roi_gray.astype("float32") / 255.0
            roi = np.expand_dims(roi, axis=-1)   # (48,48,1)
            roi = np.expand_dims(roi, axis=0)    # (1,48,48,1)

            preds = model.predict(roi)
            print("Prediction probs:", preds)

            label = class_labels[preds.argmax()]
            cv2.putText(frame, label, (x, y-10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0,255,0), 2)

    cv2.imshow('Emotion Detector', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
