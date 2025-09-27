import express from "express";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { auth } from "../lib/firebase.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { generateToken } from "../lib/token.js";
const router = express.Router();


router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // ✅ Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // ✅ Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // ✅ Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Create and save user
    user = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10)|| "1233456",
      role: role || "user",
    });

    await user.save();

    // ✅ Generate token
    const token = generateToken(user._id, res);

    res.status(201).json({ token , user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profilePic: user.profilePic,
  },});
  } catch (error) {
    console.error("Error in Registering NewUser"+error.message);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // ✅ Input validation
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Generate token
    const token = generateToken(user._id, res);

    // ✅ Return token + user data
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error in login route" });
  }
});

router.get("/authStatus", async (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "No token Provided." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      message: "Auth Status is ok",
      userId: decoded.id,
      role: decoded.role,
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

router.post("/google", async (req, res) => {
  const { idToken } = req.body;
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const { email, name, uid } = decodedToken;
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, role: "user", firebaseUid: uid });
      await user.save();
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (error) {
    res.status(401).json({ message: "Google auth failed" });
  }
});

router.get("/profile", authMiddleware,async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export { router as userRoutes };
