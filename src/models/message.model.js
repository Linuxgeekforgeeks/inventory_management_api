import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      trim: true,
    },
    image: {
      type: String, // URL or file path to the image
    },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

const Message = mongoose.model("Message", messageSchema);

export {Message};
