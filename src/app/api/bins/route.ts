import { NextRequest, NextResponse } from "next/server"
import { SUPPORTED_CITIES } from "@/lib/constants"

export const dynamic = 'force-dynamic'

// Static bin data — no database needed
const STATIC_BINS = [
    // {
    //     _id: "bin-001",
    //     name: "B Block Bin",
    //     address: "B Block, Near Main Gate, Prayagraj",
    //     city: "Prayagraj",
    //     latitude: 25.5268525,
    //     longitude: 81.8481018,
    //     qrCode: "BIN-PRJ-001",
    //     acceptedItems: ["all", "smartphone", "laptop", "battery", "e-waste"],
    //     fillLevel: 30,
    //     status: "operational",
    //     createdAt: new Date().toISOString(),
    //     updatedAt: new Date().toISOString()
    // },
    {
        _id: "bin-002",
        name: "Civil Lines E-Bin",
        address: "Civil Lines, Near Hanuman Mandir, Prayagraj",
        city: "Prayagraj",
        latitude: 25.4534,
        longitude: 81.8340,
        qrCode: "BIN-PRJ-002",
        acceptedItems: ["smartphone", "laptop", "battery"],
        fillLevel: 45,
        status: "operational",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "bin-003",
        name: "Teliyarganj E-Bin",
        address: "Teliyarganj, Near MNNIT, Prayagraj",
        city: "Prayagraj",
        latitude: 25.4624,
        longitude: 81.8605,
        qrCode: "BIN-PRJ-003",
        acceptedItems: ["smartphone", "cable", "battery", "e-waste"],
        fillLevel: 20,
        status: "operational",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "bin-004",
        name: "Radhe Motor E-Waste Bin",
        address: "Motor, Near SantiPuram, Prayagraj",
        city: "Prayagraj",
        latitude: 25.5283335,
        longitude: 81.8478447,
        qrCode: "BIN-PRJ-004",
        acceptedItems: ["all"],
        fillLevel: 50,
        status: "operational",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "bin-005",
        name: "Santipuram E-Waste Bin",
        address: "Santipuram, Near Bus Stop, Prayagraj",
        city: "Prayagraj",
        latitude: 25.525979,
        longitude: 81.8426996,
        qrCode: "BIN-PRJ-005",
        acceptedItems: ["mobile", "accessories", "battery"],
        fillLevel: 75,
        status: "operational",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "bin-006",
        name: "Phaphamau Bridge E-Bin",
        address: "Phaphamau Main Market, Prayagraj",
        city: "Prayagraj",
        latitude: 25.4988,
        longitude: 81.8596,
        qrCode: "BIN-PRJ-006",
        acceptedItems: ["battery", "smartphone"],
        fillLevel: 80,
        status: "operational",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "bin-007",
        name: "Jhunsi E-Bin",
        address: "Jhunsi, Near Sangam, Prayagraj",
        city: "Prayagraj",
        latitude: 25.4180,
        longitude: 81.8700,
        qrCode: "BIN-PRJ-007",
        acceptedItems: ["heavy-electronics", "large-appliances"],
        fillLevel: 15,
        status: "operational",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "bin-008",
        name: "Bamrauli Airport E-Bin",
        address: "Near Airport Road, Prayagraj",
        city: "Prayagraj",
        latitude: 25.4399,
        longitude: 81.7360,
        qrCode: "BIN-PRJ-008",
        acceptedItems: ["all"],
        fillLevel: 90,
        status: "full",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "bin-009",
        name: "Naini Industrial Area E-Bin",
        address: "Naini Industrial Area, Prayagraj",
        city: "Prayagraj",
        latitude: 25.3820,
        longitude: 81.8850,
        qrCode: "BIN-PRJ-009",
        acceptedItems: ["laptop", "smartphone", "tablet"],
        fillLevel: 30,
        status: "operational",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
]

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const city = searchParams.get("city")

        if (!city) {
            return NextResponse.json({ success: true, data: STATIC_BINS })
        }

        const isSupported = SUPPORTED_CITIES.some(
            supportedCity =>
                supportedCity.toLowerCase() === city.toLowerCase().trim()
        )

        if (!isSupported) {
            return NextResponse.json({
                supported: false,
                city: city,
                message: `${city} is not yet supported`
            })
        }

        return NextResponse.json({
            supported: true,
            city: city,
            bins: STATIC_BINS,
            count: STATIC_BINS.length
        })

    } catch (error) {
        console.error("Error fetching bins:", error)
        return NextResponse.json(
            { error: "Failed to fetch bins" },
            { status: 500 }
        )
    }
}
