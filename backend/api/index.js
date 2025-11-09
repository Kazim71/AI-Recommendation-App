import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import authRoutes from "../routes/authRoutes.js";
import recommendationRoutes from "../routes/recommendationRoutes.js";
import productRoutes from "../routes/productRoutes.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from parent folder (backend/.env)
dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();

// -------------------- CORS Helper --------------------
const allowedOrigins = [
  "https://ai-recommendation-app-ex8f.vercel.app/",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000"
];

const setCORSHeaders = (req, res) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "86400"); // 24 hours
};

// -------------------- CORS (Must be first) --------------------
app.use((req, res, next) => {
  setCORSHeaders(req, res);
  
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  
  next();
});

// -------------------- Middleware --------------------
app.use(express.json());
app.use(morgan("dev"));

// -------------------- Routes --------------------
app.use("/api/auth", authRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/products", productRoutes);

// Health check endpoint (doesn't require DB)
app.get("/", (req, res) => {
  res.status(200).json({ 
    message: "Server running fine ✅",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString()
  });
});

// Database health check endpoint
app.get("/health", async (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };
  
  const healthData = {
    status: dbState === 1 ? "healthy" : "unhealthy",
    database: states[dbState] || "unknown",
    hasMONGO_URI: !!process.env.MONGO_URI,
    hasJWT_SECRET: !!process.env.JWT_SECRET,
    mongoURIPreview: process.env.MONGO_URI 
      ? `${process.env.MONGO_URI.substring(0, 20)}...${process.env.MONGO_URI.substring(process.env.MONGO_URI.length - 10)}`
      : "not set",
    timestamp: new Date().toISOString()
  };
  
  res.status(dbState === 1 ? 200 : 503).json(healthData);
});

// Diagnostic endpoint to test database connection
app.get("/api/test-db", async (req, res) => {
  setCORSHeaders(req, res);
  
  const diagnostic = {
    hasMONGO_URI: !!process.env.MONGO_URI,
    mongoURILength: process.env.MONGO_URI?.length || 0,
    mongoURIPreview: process.env.MONGO_URI 
      ? `${process.env.MONGO_URI.substring(0, 30)}...` 
      : "not set",
    currentState: mongoose.connection.readyState,
    stateName: {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting"
    }[mongoose.connection.readyState],
    timestamp: new Date().toISOString()
  };
  
  // Try to connect if not connected
  if (mongoose.connection.readyState !== 1) {
    try {
      diagnostic.connectionAttempt = "starting...";
      await connectDB();
      diagnostic.connectionAttempt = "success";
      diagnostic.finalState = mongoose.connection.readyState;
    } catch (error) {
      diagnostic.connectionAttempt = "failed";
      diagnostic.error = {
        message: error.message,
        name: error.name,
        code: error.code
      };
    }
  } else {
    diagnostic.connectionAttempt = "already connected";
  }
  
  res.status(200).json(diagnostic);
});

// -------------------- Error Handling Middleware --------------------
app.use((err, req, res, next) => {
  // Log full error details
  console.error("❌ Unhandled error:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body
  });
  
  // Set CORS headers even on errors
  setCORSHeaders(req, res);
  
  // Don't send stack trace in production
  const errorResponse = {
    message: err.message || "Internal server error"
  };
  
  // Add more details in development
  if (process.env.NODE_ENV !== "production") {
    errorResponse.stack = err.stack;
    errorResponse.path = req.path;
  }
  
  res.status(err.status || 500).json(errorResponse);
});

// -------------------- 404 Handler --------------------
app.use((req, res) => {
  setCORSHeaders(req, res);
  res.status(404).json({ message: "Route not found" });
});

// -------------------- Local + Vercel Compatibility --------------------
// Locally: start express server manually
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

// On Vercel: export app so Vercel can handle requests
export default app;
