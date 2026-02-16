import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")

        if (!userId) {
            return NextResponse.json({ success: true, data: [] })
        }

        // Transactions are stored in localStorage on the client side.
        // This API now returns an empty array as the source of truth
        // is maintained client-side (no database dependency).
        return NextResponse.json({ success: true, data: [] })

    } catch (error) {
        console.error("Error fetching activity:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch activity" },
            { status: 500 }
        )
    }
}
