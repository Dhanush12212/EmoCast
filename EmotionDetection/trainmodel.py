import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from tqdm import tqdm

from sklearn.preprocessing import LabelEncoder
from keras.utils import to_categorical
from tensorflow.keras.preprocessing.image import load_img
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import Input, Conv2D, MaxPooling2D, Dropout, Flatten, Dense

# -----------------------------
# Dataset paths
# -----------------------------
TRAIN_DIR = 'images/train'
TEST_DIR = 'images/test'

def createdataframe(dir):
    image_paths, labels = [], []
    for label in os.listdir(dir):
        for imagename in os.listdir(os.path.join(dir, label)):
            image_paths.append(os.path.join(dir, label, imagename))
            labels.append(label)
        print(label, "completed")
    return image_paths, labels

train = pd.DataFrame()
train['image'], train['label'] = createdataframe(TRAIN_DIR)

test = pd.DataFrame()
test['image'], test['label'] = createdataframe(TEST_DIR)

# -----------------------------
# Feature extraction
# -----------------------------
def extract_features(images):
    features = []
    for image in tqdm(images):
        img = load_img(image, color_mode="grayscale", target_size=(48, 48))
        img = np.array(img)
        features.append(img)
    features = np.array(features)
    features = features.reshape(len(features), 48, 48, 1)
    return features

train_features = extract_features(train['image'])
test_features = extract_features(test['image'])

x_train = train_features / 255.0
x_test = test_features / 255.0

# -----------------------------
# Encode labels
# -----------------------------
le = LabelEncoder()
le.fit(train['label'])

y_train = le.transform(train['label'])
y_test = le.transform(test['label'])

y_train = to_categorical(y_train, num_classes=7)
y_test = to_categorical(y_test, num_classes=7)

# -----------------------------
# Model definition
# -----------------------------
model = Sequential([
    Input(shape=(48, 48, 1)),

    Conv2D(128, kernel_size=(3, 3), activation='relu'),
    MaxPooling2D(pool_size=(2, 2)),
    Dropout(0.4),

    Conv2D(256, kernel_size=(3, 3), activation='relu'),
    MaxPooling2D(pool_size=(2, 2)),
    Dropout(0.4),

    Conv2D(512, kernel_size=(3, 3), activation='relu'),
    MaxPooling2D(pool_size=(2, 2)),
    Dropout(0.4),

    Conv2D(512, kernel_size=(3, 3), activation='relu'),
    MaxPooling2D(pool_size=(2, 2)),
    Dropout(0.4),

    Flatten(),
    Dense(512, activation='relu'),
    Dropout(0.4),
    Dense(256, activation='relu'),
    Dropout(0.3),
    Dense(7, activation='softmax')
])

model.compile(optimizer='adam',
              loss='categorical_crossentropy',
              metrics=['accuracy'])   # ✅ fixed

# -----------------------------
# Train model
# -----------------------------
model.fit(x=x_train, y=y_train, batch_size=128, epochs=100, validation_data=(x_test, y_test))

# -----------------------------
# Save model in modern format
# -----------------------------
model.save("emotiondetector.keras")   # ✅ new recommended format

# -----------------------------
# Reload model for testing
# -----------------------------
model = load_model("emotiondetector.keras")

labels = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']

def ef(image_path):
    img = load_img(image_path, color_mode="grayscale", target_size=(48, 48))
    feature = np.array(img)
    feature = feature.reshape(1, 48, 48, 1)
    return feature / 255.0

# -----------------------------
# Quick test predictions
# -----------------------------
for test_img, true_label in [
    ("images/train/sad/42.jpg", "sad"),
    ("images/train/fear/2.jpg", "fear"),
    ("images/train/disgust/299.jpg", "disgust"),
    ("images/train/happy/7.jpg", "happy"),
    ("images/train/surprise/15.jpg", "surprise"),
]:
    print(f"Original image is of {true_label}")
    img = ef(test_img)
    pred = model.predict(img)
    pred_label = labels[pred.argmax()]
    print("Model prediction is:", pred_label)
    plt.imshow(img.reshape(48, 48), cmap='gray')
    plt.show()
