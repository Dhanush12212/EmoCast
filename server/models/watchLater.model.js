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
        },
        title: {
          type: String, 
        }, 
        thumbnailUrl: {
          type: String,  
        },
        channelThumbnail: {
          type: String,  
        },
        channelTitle: {
          type: String,  
        },
        channelId: {
          type: String,  
        },
        viewCount: {
          type: String,
        },
        publishAt: {
          type: Date, 
        },
        addedAt: {
          type: Date,
          default: Date.now,  
        },
      },
    ],
    default: [],
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



// import mongoose, { Schema } from 'mongoose';

// const WatchLaterSchema = new Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     video: {
//       type: [
//         {
//           videoId: { type: String },
//           title: { type: String },
//           thumbnailUrl: { type: String },
//           channelThumbnail: { type: String },
//           channelTitle: { type: String },
//           channelId: { type: String },
//           viewCount: { type: String },
//           publishAt: { type: Date },
//           addedAt: { type: Date, default: Date.now },
//         }
//       ],
//       default: []
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//     updatedAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export const WatchLater = mongoose.model('WatchLater', WatchLaterSchema);
