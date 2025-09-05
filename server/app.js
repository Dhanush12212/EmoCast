import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import connectDB from './db/connectDB.js';
import cookieParser from 'cookie-parser';
import authRoute from './routes/auth.routes.js';
import videoRoute from './routes/video.routes.js';
import searchRoute from './routes/search.routes.js';
import channelRoute from './routes/channel.route.js';
import watchLaterRoute from './routes/watchLater.route.js';
import subscribeRoute from './routes/subscribe.route.js'; 
import emotionRoute from './routes/emotion.route.js'
import cors from 'cors';
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static("public"));

app.use(cors({
  origin: function (origin, callback) {
    const allowed = [
      "http://localhost:5173",
      "https://emo-cast.vercel.app"
    ];

    if (
      !origin ||
      allowed.includes(origin) ||
      /\.vercel\.app$/.test(new URL(origin).hostname)
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


const PORT = process.env.PORT || 8000;
  
app.get('/', (req,res) => {
    res.send(`Server listening on Port ${PORT} || 8000`);
});
 
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/allVideos', videoRoute);
app.use('/api/v1/searchVideos', searchRoute);
app.use('/api/v1/channel', channelRoute);
app.use('/api/v1/watchLater', watchLaterRoute);
app.use('/api/v1/subscribe', subscribeRoute); 
app.use('/api/v1/emotion', emotionRoute);

const startServer = async() => {
    try{
        await connectDB();
        app.listen(PORT,"0.0.0.0", () =>{
            console.log(JSON.stringify({ message:`Server running on ${PORT}`}));   
        })
    } catch(error) {
        console.log(`Server failed: ${error.message}`);
        process.exit(1);
    }
}

startServer();