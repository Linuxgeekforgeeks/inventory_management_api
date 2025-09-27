import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      default:"1234567"
    },
    role: {
      type: String,
      enum: ["user", "shopper", "admin"],
      default: "user",
    },
    firebaseUid: { type: String },
    profilePic: {
      type: String,
      default: "",
    },

    // 👇 New fields for frontend needs
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    orderCount: {
      type: Number,
      default: 0,
    },

    // Optionally, reference actual orders if you want details
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  },
  { timestamps: true } // adds createdAt (registration date) & updatedAt
);

const User = mongoose.model("User", userSchema);

export default User;
