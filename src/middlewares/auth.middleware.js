import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

export const adminAuth = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin Access Denied." });
  }
  next();
};

export const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "No token Provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not Found." });
    }

    req.user = {
      id: user._id,
      role: user.role,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided." });
    }
    const decorded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decorded) {
      return res.status(401).json({ message: "Unauthorized -Invalid Token." });
    }

    const user = await User.findById(decorded.userId).select('-password');
    if (!user) return res.status(404).json({ message: "User is not found." });
    req.user=user
    next();
  } catch (error) {
    console.log("Error in the protected Routes middleware",error)
    res.status(500).json({message:"Internal Server Error."})
  }
};
