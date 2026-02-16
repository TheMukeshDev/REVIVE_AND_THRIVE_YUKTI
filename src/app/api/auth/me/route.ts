import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

// No database — user data is managed client-side in localStorage
// This endpoint just validates the request and returns a consistent response
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 })
        }

        // Return a minimal success response — actual user data lives in localStorage
        // The client will use its local copy if this succeeds
        return NextResponse.json({
            success: true,
            data: {
                _id: id,
                points: 100,
                totalItemsRecycled: 0,
                totalCO2Saved: 0
            }
        })

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
