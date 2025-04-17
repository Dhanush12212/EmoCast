
# EmoCast - Emotion-Based Video Recommendation Platform

**EmoCast** is a mood-based video recommendation platform that analyzes the user's emotional state through real-time facial expression detection and suggests videos accordingly. EmoCast aims to enhance user experience by matching content to their current mood, whether they’re happy, sad, or anything in between.

---

## Features

- **Emotion Detection**: Detects the user's mood through facial expression analysis.
- **Real-time Video Suggestions**: Suggests YouTube videos based on the detected emotion.
- **YouTube API Integration**: Fetches relevant videos using the YouTube Data API.
- **Responsive UI**: A clean and intuitive user interface for seamless interaction.
- **User Authentication**: Secure login and registration system using JWT.
- **Real-time Updates**: Continuously update video suggestions based on real-time mood changes.

---
    
## Tech Stack

### Frontend

- **React.js**: For building the user interface.
- **Tailwind CSS**: For styling and layout.
- **Axios**: For making API requests to fetch video suggestions.
- **React Router**: For smooth navigation across different pages.
- **YouTube API**: To fetch and display videos based on the user's mood.

### Backend

- **Node.js**: JavaScript runtime for server-side logic.
- **Express.js**: Web framework for handling API routes.
- **MongoDB**: NoSQL database to store user data, moods, and preferences.
- **JWT & bcrypt.js**: For secure authentication and password hashing.
- **dotenv**: For environment variable management.

### Emotion Detection (Python)

- **Flask / FastAPI**: For real-time facial emotion detection.
- **OpenCV**: Used in Python for capturing webcam images and processing facial expressions.

---

## Tools & Libraries Used

- **Socket.io**: For enabling real-time bi-directional communication between the frontend and backend.
- **Monaco Editor**: A powerful, fast code editor for real-time collaboration.
- **JWT (JSON Web Token)**: For implementing secure user authentication.
- **bcrypt.js**: For hashing and securing user passwords.
- **dotenv**: To manage environment variables securely.

---

## Installation & Setup

### 1. Install Dependencies

#### Frontend

```bash
cd frontend
npm install
```

#### Backend

```bash
cd backend
npm install
```

---

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory and add the following:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
YOUTUBE_API_KEY=your_youtube_api_key
```

---

### 3. Set Up Python (Emotion Detection)

Make sure Python is installed along with `OpenCV` and your chosen emotion detection library (`fer`, `deepface`, etc.).

Run your Flask or FastAPI service:

```bash
cd emotion-service
python app.py
```

---

### 4. Start the Backend Server

```bash
cd backend
npm start
```

---

### 5. Start the Frontend Application

```bash
cd frontend
npm run dev
```

---

### 6. Access the Application

Open your browser and go to:

```
http://localhost:5173
```

---

## Contributing

We welcome contributions! To contribute to **EmoCast**:

1. Fork the repository.
2. Create a new branch:

```bash
git checkout -b feature-branch
```

3. Make your changes and commit them:

```bash
git commit -m 'Add feature'
```

4. Push to your branch:

```bash
git push origin feature-branch
```

5. Open a pull request.
