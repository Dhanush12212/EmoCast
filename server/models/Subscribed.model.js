import mongoose, { Schema } from 'mongoose';

const ChannelSchema = new Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    subscribedTo: [
      {
        type: String,
        ref: "User",  
      }
    ],
  },
  {
    timestamps: true,
  }
);

export const Channel = mongoose.model("Channel", ChannelSchema);
