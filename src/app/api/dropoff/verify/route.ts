import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Bin from "@/models/Bin"
import Transaction from "@/models/Transaction"
import User from "@/models/User"
import { isWithinRadius } from "@/lib/geo"
import crypto from "crypto"

const PROXIMITY_RADIUS_METERS = 100 // User must be within 100m of bin
const MAX_DROPOFFS_PER_DAY = 5
const MAX_TIMESTAMP_AGE_MINUTES = 15 // Reject timestamps older than 15 minutes

// Generate unique transaction ID
function generateTransactionId(): string {
    return `TXN-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`
}

export async function POST(request: Request) {
    try {
        await dbConnect()

        const body = await request.json()
        const { userId, binId, items, verificationMethod, userLocation, capturedAt } = body

        // Validation
        if (!userId || !binId || !items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({
                success: false,
                error: "Missing required fields: userId, binId, items"
            }, { status: 400 })
        }

        if (!userLocation || typeof userLocation.latitude !== 'number' || typeof userLocation.longitude !== 'number') {
            return NextResponse.json({
                success: false,
                error: "Valid userLocation (latitude, longitude) is required"
            }, { status: 400 })
        }

        // Timestamp validation - reject old timestamps
        if (capturedAt) {
            const capturedTime = new Date(capturedAt)
            const currentTime = new Date()
            const ageInMinutes = (currentTime.getTime() - capturedTime.getTime()) / (1000 * 60)

            if (ageInMinutes > MAX_TIMESTAMP_AGE_MINUTES) {
                return NextResponse.json({
                    success: false,
                    error: `Timestamp is too old (${Math.floor(ageInMinutes)} minutes). Please capture items within ${MAX_TIMESTAMP_AGE_MINUTES} minutes of drop-off.`
                }, { status: 400 })
            }

            // Reject future timestamps
            if (capturedTime > currentTime) {
                return NextResponse.json({
                    success: false,
                    error: "Invalid timestamp: Future dates are not allowed"
                }, { status: 400 })
            }
        }

        // 1. Check if user exists
        const user = await User.findById(userId)
        if (!user) {
            return NextResponse.json({
                success: false,
                error: "User not found"
            }, { status: 404 })
        }

        // 2. Check if bin exists and is operational
        const bin = await Bin.findById(binId)
        if (!bin) {
            return NextResponse.json({
                success: false,
                error: "Bin not found"
            }, { status: 404 })
        }

        if (bin.status !== 'operational') {
            return NextResponse.json({
                success: false,
                error: `Bin is currently ${bin.status}. Please choose another bin.`
            }, { status: 400 })
        }

        // 3. Location validation (for QR scans, enforce proximity)
        if (verificationMethod === 'qr_scan') {
            const isNearBin = isWithinRadius(
                userLocation.latitude,
                userLocation.longitude,
                bin.latitude,
                bin.longitude,
                PROXIMITY_RADIUS_METERS
            )

            if (!isNearBin) {
                return NextResponse.json({
                    success: false,
                    error: `You must be within ${PROXIMITY_RADIUS_METERS}m of the bin to drop off items.`
                }, { status: 400 })
            }
        }

        // 4. Rate limiting check (max 5 drop-offs per day)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const todaysDropoffs = await Transaction.countDocuments({
            userId: user._id,
            type: 'recycle',
            status: 'approved',
            createdAt: { $gte: today, $lt: tomorrow }
        })

        if (todaysDropoffs >= MAX_DROPOFFS_PER_DAY) {
            return NextResponse.json({
                success: false,
                error: `Daily limit reached (${MAX_DROPOFFS_PER_DAY} drop-offs per day). Try again tomorrow!`
            }, { status: 429 })
        }

        // 5. Calculate points and create transactions
        const transactions: any[] = []
        let totalPoints = 0
        let totalItems = 0
        let totalCO2 = 0

        for (const item of items) {
            const { itemName, itemType, value } = item

            if (!itemName || !itemType || typeof value !== 'number') {
                continue // Skip invalid items
            }

            // Points calculation (value × 2)
            const pointsEarned = Math.round(value * 2)

            // CO2 estimation (rough: 0.5kg per item)
            const co2Saved = 0.5

            const tx = await Transaction.create({
                userId: user._id,
                binId: bin._id,
                transactionId: generateTransactionId(),
                type: 'recycle',
                itemName,
                itemType,
                confidence: 1.0, // Manual drop-off has 100% confidence
                value,
                pointsEarned,
                verificationMethod: verificationMethod || 'self_report',
                status: 'approved',
                verifiedAt: new Date(),
                capturedAt: capturedAt ? new Date(capturedAt) : new Date(),
                verificationLocation: userLocation
            })

            transactions.push(tx)
            totalPoints += pointsEarned
            totalItems += 1
            totalCO2 += co2Saved
        }

        // Validate that at least one valid item was processed
        if (totalItems === 0 || transactions.length === 0) {
            return NextResponse.json({
                success: false,
                error: "No valid items to recycle. Please select at least one item."
            }, { status: 400 })
        }

        // 6. Update user stats atomically
        await User.findByIdAndUpdate(user._id, {
            $inc: {
                points: totalPoints,
                totalItemsRecycled: totalItems,
                totalCO2Saved: totalCO2
            }
        })

        return NextResponse.json({
            success: true,
            data: {
                pointsEarned: totalPoints,
                itemsRecycled: totalItems,
                co2Saved: totalCO2,
                transactionIds: transactions.map(tx => tx.transactionId),
                transactions
            },
            message: `🎉 Drop-off verified! You earned ${totalPoints} points! Transaction IDs: ${transactions.map(tx => tx.transactionId).join(', ')}`
        })

    } catch (error) {
        console.error("Drop-off verification error:", error)
        return NextResponse.json({
            success: false,
            error: "Failed to verify drop-off"
        }, { status: 500 })
    }
}
