import { Schema, model, models } from 'mongoose'

const paymentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['completed', 'pending'], default: 'pending' }
}, { timestamps: true })

export const Payment = models.Payment || model('Payment', paymentSchema)
