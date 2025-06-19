import mongoose, { Schema } from 'mongoose';

const WatchLaterSchema = new Schema(
{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    video: [
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
        cahnnelThumbnail: {
          type: String,  
        },
        channelTitle: {
          type: String,  
        },
        channelId: {
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
 
export const WatchLater = mongoose.model('WatchLater', WatchLaterSchema); 