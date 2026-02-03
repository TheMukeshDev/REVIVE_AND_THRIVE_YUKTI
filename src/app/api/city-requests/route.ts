import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import CityRequest from "@/models/CityRequest"

export async function POST(request: NextRequest) {
    try {
        const { city, email } = await request.json()

        if (!city) {
            return NextResponse.json(
                { error: "City is required" },
                { status: 400 }
            )
        }

        await dbConnect()

        const ip = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown'
        const userAgent = request.headers.get('user-agent') || 'unknown'

        const cityRequest = await CityRequest.create({
            city: city.trim(),
            email: email?.trim() || undefined,
            ip,
            userAgent,
        })

        return NextResponse.json({
            success: true,
            message: "Notification request saved successfully",
            data: cityRequest
        })

    } catch (error) {
        console.error("Error saving city request:", error)
        return NextResponse.json(
            { error: "Failed to save notification request" },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const city = searchParams.get("city")

        let requests
        if (city) {
            requests = await CityRequest.find({ city: city.trim() })
                .sort({ requestedAt: -1 })
                .limit(100)
        } else {
            requests = await CityRequest.find({})
                .sort({ requestedAt: -1 })
                .limit(1000)
        }

        return NextResponse.json({
            success: true,
            data: requests
        })

    } catch (error) {
        console.error("Error fetching city requests:", error)
        return NextResponse.json(
            { error: "Failed to fetch city requests" },
            { status: 500 }
        )
    }
}