import mongoose, { Schema, Document } from "mongoose"

export interface IScanLog extends Document {
    itemType: string
    category: string
    confidence: number
    detectedAt: Date
    userId?: string
}

const ScanLogSchema = new Schema({
    itemType: { type: String, required: true },
    category: { type: String, required: true },
    confidence: { type: Number, required: true },
    detectedAt: { type: Date, default: Date.now },
    userId: { type: String }
})

export const ScanLog = mongoose.models.ScanLog || mongoose.model<IScanLog>("ScanLog", ScanLogSchema)
