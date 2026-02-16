import { NextRequest, NextResponse } from "next/server"
import { detectWaste } from "@/lib/ai-service"
import dbConnect from "@/lib/mongodb"
import { ScanLog } from "@/models/ScanLog"
import crypto from "crypto"
import fs from "fs"
import path from "path"

export async function POST(req: NextRequest) {
    try {
        const { image, userId } = await req.json()

        if (!image) {
            return NextResponse.json({ success: false, error: "No image provided" }, { status: 400 })
        }

        // 1. Analyze with Gemini
        const result = await detectWaste(image)

        // 2. Generate Transaction ID
        const transactionId = `TXN-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`

        // 2b. Log to local JSON file
        try {
            const logDir = path.join(process.cwd(), "logs")
            if (!fs.existsSync(logDir)) {
                fs.mkdirSync(logDir, { recursive: true })
            }
            
            const logFile = path.join(logDir, "scans.json")
            let logs: any[] = []
            
            if (fs.existsSync(logFile)) {
                const fileContent = fs.readFileSync(logFile, "utf-8")
                try {
                    logs = JSON.parse(fileContent)
                } catch (e) {
                    console.error("Error parsing log file, starting fresh")
                }
            }

            logs.push({
                transactionId,
                productType: result.type,
                confidenceScore: result.confidence,
                timestamp: new Date().toISOString()
            })

            fs.writeFileSync(logFile, JSON.stringify(logs, null, 2))
        } catch (fileError) {
            console.error("Failed to write to local log file:", fileError)
            // Non-blocking error, continue with DB logic
        }

        // 3. Log to Database (for "Scan Item" stats)
        await dbConnect()

        await ScanLog.create({
            itemType: result.type,
            category: result.category,
            confidence: result.confidence,
            detectedAt: new Date(),
            userId: userId || undefined,
            transactionId // Optionally log it here too if schema supports it
        })

        return NextResponse.json({
            success: true,
            result,
            transactionId
        })

    } catch (error) {
        console.error("Scan analysis failed:", error)
        return NextResponse.json({
            success: false,
            error: "Analysis failed"
        }, { status: 500 })
    }
}
