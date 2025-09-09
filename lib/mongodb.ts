import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!process.env.MONGODB_URI) {
  console.warn("Warning: MONGODB_URI environment variable is not set. Using default localhost connection.");
}

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => {
      console.log("Connected to MongoDB successfully");
      return mongoose;
    }).catch((error) => {
      console.error("MongoDB connection error:", error);
      throw error;
    });
  }
  cached.conn = await cached.promise;
  (global as any).mongoose = cached;
  return cached.conn;
}
