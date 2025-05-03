import mongoose, { Schema } from 'mongoose';

const playlistSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: 'No description provided.',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  
      required: true,
    },
    videos: [
      {
        videoId: {
          type: String,  
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
        },
        thumbnail: {
          type: String,  
        },
        publishedAt: {
          type: Date, 
        },
        addedAt: {
          type: Date,
          default: Date.now,  
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,  
  }
);
 
export const Playlist = mongoose.model('Playlist', playlistSchema); 