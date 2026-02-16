import mongoose, { Schema, Document, Model } from "mongoose"

export interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId
    binId?: mongoose.Types.ObjectId
    transactionId: string // Unique transaction identifier
    type: "scan" | "recycle" | "sell"
    itemName: string
    itemType: string
    confidence: number
    value: number
    pointsEarned: number
    verificationMethod?: 'qr_scan' | 'self_report' | 'admin_confirm' | 'ai_vision_verified'
    status: 'pending' | 'approved' | 'rejected'
    verifiedAt?: Date
    verificationLocation?: { latitude: number; longitude: number }
    capturedAt?: Date // Timestamp when item was captured
    createdAt: Date
    updatedAt: Date
}

const TransactionSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        binId: { type: Schema.Types.ObjectId, ref: "Bin", required: false }, // Optional for scans
        transactionId: { type: String, required: true, unique: true, index: true }, // Unique transaction identifier
        type: { type: String, enum: ["scan", "recycle", "sell"], default: "recycle" },
        itemName: { type: String, required: true },
        itemType: { type: String, required: true }, // category e.g. "e-waste"
        confidence: { type: Number, required: true },
        value: { type: Number, required: true }, // e.g. estimated recycling value
        pointsEarned: { type: Number, required: true },
        verificationMethod: { type: String, enum: ['qr_scan', 'self_report', 'admin_confirm', 'ai_vision_verified'], required: false },
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
        verifiedAt: { type: Date, required: false },
        verificationLocation: {
            latitude: Number,
            longitude: Number
        },
        capturedAt: { type: Date, required: false } // When item was captured/verified
    },
    {
        timestamps: true,
    }
)

const Transaction: Model<ITransaction> = mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema)

export default Transaction
