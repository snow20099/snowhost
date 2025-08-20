// ==============================================================================
// File: models/Order.ts (if using MongoDB/Mongoose)
// ==============================================================================
import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  orderID: { type: String, required: true, unique: true },
  userEmail: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['created', 'completed', 'failed', 'cancelled'], 
    default: 'created' 
  },
  captureId: { type: String },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  failedAt: { type: Date }
})

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema)
