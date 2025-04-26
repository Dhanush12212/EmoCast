import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import connectDB from './db/connectDB.js';
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 8000;
  
app.get('/', (req,res) => {
    res.send('Hello');
})

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