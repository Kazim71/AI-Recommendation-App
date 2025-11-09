import User from "../models/User.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// ---------------------- REGISTER ----------------------
export const registerUser = async (req, res) => {
  // Double-check DB connection
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      message: "Database connection not available. Please try again.",
      error: "Database not connected"
    });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "Email already registered" });
  }

  // Create and save user
  const user = new User({ name, email, password });
  await user.save();

  return res.status(201).json({ message: "User registered successfully" });
};

// ---------------------- LOGIN ----------------------
export const loginUser = async (req, res) => {
  // Double-check DB connection
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      message: "Database connection not available. Please try again.",
      error: "Database not connected"
    });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (!process.env.JWT_SECRET) {
    console.error("❌ Missing JWT_SECRET in environment variables!");
    return res.status(500).json({ message: "Server configuration error" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  return res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email }
  });
};
