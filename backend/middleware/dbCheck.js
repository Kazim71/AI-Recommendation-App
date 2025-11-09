import mongoose from "mongoose";
import { connectDB } from "../config/db.js";

// Middleware to check if database is connected and attempt reconnection if needed
export const checkDBConnection = async (req, res, next) => {
  try {
    // If already connected, proceed
    if (mongoose.connection.readyState === 1) {
      return next();
    }

    // Try to connect (this handles all states: disconnected, connecting, etc.)
    await connectDB();
    
    // Verify connection succeeded
    if (mongoose.connection.readyState === 1) {
      return next();
    }
    
    // Connection failed
    throw new Error("Connection state is not ready after connect attempt");
  } catch (error) {
    const errorDetails = {
      message: error.message,
      name: error.name,
      code: error.code,
      state: mongoose.connection.readyState,
      hasMONGO_URI: !!process.env.MONGO_URI,
      mongoURILength: process.env.MONGO_URI?.length || 0,
      mongoURIPreview: process.env.MONGO_URI 
        ? `${process.env.MONGO_URI.substring(0, 20)}...` 
        : "not set"
    };
    
    console.error("❌ Database connection error:", errorDetails);
    
    // Determine the specific issue - check error name and message
    const isWhitelistError = 
      error.name === "MongooseServerSelectionError" || 
      error.name === "MongoServerSelectionError" || 
      error.code === "ENOTFOUND" ||
      error.message?.includes("security-whitelist") ||
      error.message?.includes("Could not connect to any servers") ||
      error.message?.includes("whitelist");
    
    let hint = "Unknown error";
    let solution = "";
    
    if (!process.env.MONGO_URI) {
      hint = "MONGO_URI environment variable is missing";
      solution = "1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables\n2. Add MONGO_URI with your MongoDB connection string\n3. Format: mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority\n4. Redeploy the application";
    } else if (isWhitelistError) {
      hint = "🔴 MONGODB ATLAS IP WHITELIST BLOCKING CONNECTION";
      solution = "YOUR MONGODB ATLAS IS BLOCKING THE CONNECTION!\n\n✅ FIX STEPS:\n1. Open https://cloud.mongodb.com/\n2. Login and select your project\n3. Click 'Network Access' (left sidebar, under Security)\n4. Click green 'Add IP Address' button\n5. Click 'Allow Access from Anywhere' button (adds 0.0.0.0/0)\n6. Click 'Confirm'\n7. Wait 2-3 minutes\n8. Try again\n\n⚠️ CRITICAL: Vercel serverless uses changing IPs. You MUST allow 0.0.0.0/0 (all IPs) or it will NEVER work.";
    } else if (error.name === "MongoAuthenticationError") {
      hint = "MongoDB authentication failed";
      solution = "1. Check username and password in connection string\n2. Verify database user exists in MongoDB Atlas\n3. Ensure user has correct permissions";
    } else if (error.message?.includes("timeout") || error.name === "MongoServerSelectionError") {
      hint = "Connection timeout";
      solution = "1. Check MongoDB Atlas cluster is running\n2. Verify IP whitelist allows 0.0.0.0/0\n3. Check connection string format is correct";
    } else {
      hint = `Connection failed: ${error.message}`;
      solution = "Check Vercel function logs for more details";
    }
    
    // Set CORS headers before sending error
    const allowedOrigins = [
      "https://ai-recommendation-app-zhyc.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:3000"
    ];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    
    // Return detailed error with all diagnostic info
    return res.status(503).json({ 
      message: "Database connection failed",
      error: error.message,
      errorName: error.name,
      errorCode: error.code,
      hint: hint,
      solution: solution,
      diagnostics: {
        hasMONGO_URI: !!process.env.MONGO_URI,
        mongoURILength: process.env.MONGO_URI?.length || 0,
        connectionState: mongoose.connection.readyState,
        stateName: {
          0: "disconnected",
          1: "connected", 
          2: "connecting",
          3: "disconnecting"
        }[mongoose.connection.readyState]
      },
      troubleshooting: "Visit /api/test-db endpoint for detailed diagnostics"
    });
  }
};

