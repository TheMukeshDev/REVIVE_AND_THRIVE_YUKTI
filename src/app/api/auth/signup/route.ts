import { NextResponse } from "next/server"
import crypto from "crypto"

// No database — create user object directly and return it for client-side storage
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, username, email, password } = body

        if (!name || !username || !email || !password) {
            return NextResponse.json(
                { success: false, error: "All fields are required" },
                { status: 400 }
            )
        }

        if (password.length < 8) {
            return NextResponse.json(
                { success: false, error: "Password must be at least 8 characters" },
                { status: 400 }
            )
        }

        // Generate a unique user ID without database
        const userId = crypto.randomBytes(12).toString('hex')

        const userResponse = {
            _id: userId,
            name,
            username,
            email,
            role: "user",
            isActive: true,
            points: 100, // Welcome bonus
            totalItemsRecycled: 0,
            totalCO2Saved: 0,
            suspiciousFlags: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        return NextResponse.json({ success: true, data: userResponse })

    } catch (error: any) {
        console.error("Signup error:", error)
        return NextResponse.json(
            { success: false, error: error.message || "Signup failed" },
            { status: 500 }
        )
    }
}
