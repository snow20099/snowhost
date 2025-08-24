import { Schema, model, models } from 'mongoose'

const serverSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'inactive', 'deleted', 'restarting'], default: 'inactive' },
  deletedAt: Date
}, { timestamps: true })

export const Server = models.Server || model('Server', serverSchema)
