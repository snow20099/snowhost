import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  emailVerified: { type: Boolean, default: false },    // هل تم التحقق من الإيميل؟
  verificationCode: { type: String, default: null },    // كود التحقق
  
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
    type: String,
    status: String,
    ip: String,
    location: String,
    createdAt: { type: Date, default: Date.now }
  }],

  // Resource Usage
  resourceUsage: {
    cpu: { type: Number, default: 0 },
    memory: { type: Number, default: 0 },
    storage: { type: Number, default: 0 },
    network: { type: Number, default: 0 },
    totalStorage: { type: Number, default: 500 },
    totalMemory: { type: Number, default: 16 },
    totalNetwork: { type: Number, default: 1000 },
    lastUpdated: { type: Date, default: Date.now }
  },

  // Billing Information
  invoices: [{
    id: String,
    amount: Number,
    status: String,
    service: String,
    date: { type: Date, default: Date.now }
  }],

  // Settings
  preferences: {
    theme: { type: String, default: "dark" },
    language: { type: String, default: "en" },
    notifications: { type: Boolean, default: true }
  }
}, { timestamps: true });

export default models.User || model("User", UserSchema);
