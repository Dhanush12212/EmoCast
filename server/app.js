import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import connectDB from './db/connectDB.js';
import cookieParser from 'cookie-parser';
import authRoute from './routes/auth.routes.js';
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static("public"));

const PORT = process.env.PORT || 8000;
  
app.get('/', (req,res) => {
    res.send(`Server listening on Port ${PORT} || 8000`);
})

app.use('/api/v1/auth', authRoute);

const startServer = async() => {
    try{
        await connectDB();
        app.listen(PORT,"0.0.0.0", () =>{
            console.log(`Server running on ${PORT}`);
        })
    } catch(error) {
        console.log(`Server failed: ${error.message}`);
        process.exit(1);
    }
}

startServer();