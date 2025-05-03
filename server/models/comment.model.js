 import mongoose, { Schema } from 'mongoose';

const commentSchema = new Schema(
    {
        videoId: {
            type: String,
            required: true,
        },
        userId: {
            type:mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
            required: true,
            trim: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }
    }
);


export const Comment = mongoose.model(Comment, "commentSchema");