import { NextResponse } from "next/server"
import { isWithinRadius } from "@/lib/geo"
import crypto from "crypto"

const PROXIMITY_RADIUS_METERS = 100 // User must be within 100m of bin
const MAX_TIMESTAMP_AGE_MINUTES = 15 // Reject timestamps older than 15 minutes

// Static bin data for verification (no DB needed)
const STATIC_BINS: Record<string, { _id: string; name: string; latitude: number; longitude: number; status: string }> = {
    // "bin-001": { _id: "bin-001", name: "B Block Bin", latitude: 25.5263407, longitude: 81.8482162, status: "operational" },
    "bin-002": { _id: "bin-002", name: "Civil Lines E-Bin", latitude: 25.4534, longitude: 81.8340, status: "operational" },
    "bin-003": { _id: "bin-003", name: "Teliyarganj E-Bin", latitude: 25.4624, longitude: 81.8605, status: "operational" },
    "bin-004": { _id: "bin-004", name: "Radhe Motor E-Waste Bin", latitude: 25.5283335, longitude: 81.8478447, status: "operational" },
    "bin-005": { _id: "bin-005", name: "Santipuram E-Waste Bin", latitude: 25.525979, longitude: 81.8426996, status: "operational" },
    "bin-006": { _id: "bin-006", name: "Phaphamau Bridge E-Bin", latitude: 25.4988, longitude: 81.8596, status: "operational" },
    "bin-007": { _id: "bin-007", name: "Jhunsi E-Bin", latitude: 25.4180, longitude: 81.8700, status: "operational" },
    "bin-008": { _id: "bin-008", name: "Bamrauli Airport E-Bin", latitude: 25.4399, longitude: 81.7360, status: "full" },
    "bin-009": { _id: "bin-009", name: "Naini Industrial Area E-Bin", latitude: 25.3820, longitude: 81.8850, status: "operational" },
}

// Generate unique transaction ID
function generateTransactionId(): string {
    return `TXN-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { userId, binId, items, verificationMethod, userLocation, capturedAt, transactionId } = body

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

        // 1. Check if bin exists and is operational (static data)
        const bin = STATIC_BINS[binId]
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

        // 2. Location validation (for QR scans, enforce proximity)
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

        // 3. Calculate points and build transaction records (no DB writes)
        const transactions: any[] = []
        let totalPoints = 0
        let totalItems = 0
        let totalCO2 = 0

        let itemIndex = 0

        for (const item of items) {
            const { itemName, itemType, value } = item

            if (!itemName || !itemType || typeof value !== 'number') {
                continue // Skip invalid items
            }

            // Generate unique transaction ID for each item
            const currentTxId = (transactionId && itemIndex === 0) 
                ? transactionId 
                : (transactionId ? `${transactionId}-${itemIndex}` : generateTransactionId())

            // Points calculation (value x 2)
            const pointsEarned = Math.round(value * 2)

            // CO2 estimation (rough: 0.5kg per item)
            const co2Saved = 0.5

            const tx = {
                _id: crypto.randomBytes(12).toString('hex'),
                userId,
                binId: bin._id,
                transactionId: currentTxId,
                type: 'recycle',
                itemName,
                itemType,
                confidence: 1.0,
                value,
                pointsEarned,
                verificationMethod: verificationMethod || 'self_report',
                status: 'approved',
                verifiedAt: new Date().toISOString(),
                capturedAt: capturedAt || new Date().toISOString(),
                verificationLocation: userLocation,
                createdAt: new Date().toISOString()
            }

            transactions.push(tx)
            totalPoints += pointsEarned
            totalItems += 1
            totalCO2 += co2Saved
            itemIndex++
        }

        // Validate that at least one valid item was processed
        if (totalItems === 0 || transactions.length === 0) {
            return NextResponse.json({
                success: false,
                error: "No valid items to recycle. Please select at least one item."
            }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            data: {
                pointsEarned: totalPoints,
                itemsRecycled: totalItems,
                co2Saved: totalCO2,
                transactionIds: transactions.map(tx => tx.transactionId),
                transactions
            },
            message: `Drop-off verified! You earned ${totalPoints} points! Transaction ID: ${transactions[0].transactionId}`
        })

    } catch (error) {
        console.error("Drop-off verification error:", error)
        return NextResponse.json({
            success: false,
            error: "Failed to verify drop-off"
        }, { status: 500 })
    }
}
