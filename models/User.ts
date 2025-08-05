import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Account Information
  balance: { type: Number, default: 0 },
  currency: { type: String, default: "USD" },
  accountType: { type: String, default: "user", enum: ["user", "admin", "moderator"] },
  isActive: { type: Boolean, default: true },
  // Profile Information
  phone: { type: String },
  country: { type: String },
  timezone: { type: String },
  // Services & Servers
  servers: [{ 
    id: String,
    name: String,
    type: String, // vps, vds, gaming, web
    status: String, // active, suspended, terminated
    ip: String,
    location: String,
    createdAt: { type: Date, default: Date.now }
  }],
  // Resource Usage
  resourceUsage: {
    cpu: { type: Number, default: 0 }, // CPU usage percentage
    memory: { type: Number, default: 0 }, // Memory usage percentage
    storage: { type: Number, default: 0 }, // Storage usage percentage
    network: { type: Number, default: 0 }, // Network usage percentage
    totalStorage: { type: Number, default: 500 }, // Total storage in GB
    totalMemory: { type: Number, default: 16 }, // Total memory in GB
    totalNetwork: { type: Number, default: 1000 }, // Total network in GB
    lastUpdated: { type: Date, default: Date.now }
  },
  // Billing Information
  invoices: [{
    id: String,
    amount: Number,
    status: String, // paid, pending, overdue
    service: String,
    date: { type: Date, default: Date.now }
  }],
  // Settings
  preferences: {
    theme: { type: String, default: "dark" },
    language: { type: String, default: "en" },
    notifications: { type: Boolean, default: true }
  },
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default models.User || model("User", UserSchema); 
