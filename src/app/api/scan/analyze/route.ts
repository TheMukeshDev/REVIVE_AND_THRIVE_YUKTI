import { NextRequest, NextResponse } from "next/server"
import { detectWaste } from "@/lib/ai-service"
import dbConnect from "@/lib/mongodb"
import { ScanLog } from "@/models/ScanLog"

export async function POST(req: NextRequest) {
    try {
        const { image } = await req.json()

        if (!image) {
            return NextResponse.json({ success: false, error: "No image provided" }, { status: 400 })
        }

        // 1. Analyze with Gemini
        const result = await detectWaste(image)

        // 2. Log to Database (for "Scan Item" stats)
        await dbConnect()

        // We'll trust the AI result, but if confidence is low, we might flag it
        // Note: In a real app, we'd get the user ID from the session here
        await ScanLog.create({
            itemType: result.type,
            category: result.category,
            confidence: result.confidence,
            detectedAt: new Date(),
            // userId: session?.user?.id 
        })

        return NextResponse.json({
            success: true,
            result
        })

    } catch (error) {
        console.error("Scan analysis failed:", error)
        return NextResponse.json({
            success: false,
            error: "Analysis failed"
        }, { status: 500 })
    }
}
