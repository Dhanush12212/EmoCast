import mongoose, { Schema } from 'mongoose';

const ChannelSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subscribedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  
      }
    ],
  },
  {
    timestamps: true,
  }
);

export const Channel = mongoose.model("Channel", ChannelSchema);
