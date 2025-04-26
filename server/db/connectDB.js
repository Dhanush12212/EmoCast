import mongoose from 'mongoose';

//MongoDB Connection
const connectDB = async() => {
    try {
        await mongoose
        .connect(process.env.MONGODB_URI);
        console.log(JSON.stringify({ 
            message: "Connected to MongoDB", 
            status: "success" 
        }));
    } 
    catch(error) {
        console.error(
            JSON.stringify({ 
                message: "Failed to connect with DB", 
                status: "error", 
                error: error.message 
            })
        );
        process.exit(1);  
    };
};

export default connectDB;