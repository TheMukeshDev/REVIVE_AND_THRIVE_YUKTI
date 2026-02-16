import { NextResponse } from "next/server"
import crypto from "crypto"

// No database — accept any email/password and return a user object for client-side storage
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password } = body

        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: "Email and password are required" },
                { status: 400 }
            )
        }

        // Generate a consistent user ID from email (same email = same ID)
        const userId = crypto.createHash('md5').update(email).digest('hex').slice(0, 24)

        // Extract name and username from email
        const emailParts = email.split('@')[0]
        const name = emailParts.charAt(0).toUpperCase() + emailParts.slice(1)

        const userResponse = {
            _id: userId,
            name: name,
            username: emailParts,
            email: email,
            role: "user",
            isActive: true,
            points: 100,
            totalItemsRecycled: 0,
            totalCO2Saved: 0,
            suspiciousFlags: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        return NextResponse.json({ success: true, data: userResponse })

    } catch (error: any) {
        console.error("Login error:", error)
        return NextResponse.json(
            { success: false, error: error.message || "Login failed" },
            { status: 500 }
        )
    }
}
