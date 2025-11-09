import mongoose from "mongoose";

let connectionPromise = null;

export const connectDB = async () => {
  // If already connected, return
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If already connecting, return the existing promise
  if (connectionPromise) {
    return connectionPromise;
  }

  // Check if MONGO_URI is set
  if (!process.env.MONGO_URI) {
    const error = new Error("MONGO_URI is not defined in environment variables");
    console.error("❌", error.message);
    throw error;
  }

  // Clean up any existing connection that's in a bad state
  if (mongoose.connection.readyState === 2 || mongoose.connection.readyState === 3) {
    try {
      await mongoose.connection.close();
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (e) {
      // Ignore cleanup errors
    }
  }

  // Start connection
  console.log("🔄 Connecting to MongoDB...");
  console.log("📋 Connection details:", {
    hasURI: !!process.env.MONGO_URI,
    uriLength: process.env.MONGO_URI?.length || 0,
    uriStart: process.env.MONGO_URI?.substring(0, 30) || "N/A"
  });
  
  connectionPromise = mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    maxPoolSize: 1,
    minPoolSize: 0,
    bufferCommands: false,
    retryWrites: true,
  })
    .then(() => {
      console.log("✅ MongoDB connected successfully");
      connectionPromise = null;
      return mongoose.connection;
    })
    .catch((error) => {
      connectionPromise = null;
      console.error("❌ DB connection failed:", {
        message: error.message,
        name: error.name,
        code: error.code,
        stack: error.stack?.substring(0, 200)
      });
      throw error;
    });

  return connectionPromise;
};