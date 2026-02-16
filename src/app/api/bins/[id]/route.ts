import { NextResponse } from "next/server"

// Import the same static bins used in the main bins route
const STATIC_BINS = [
    {
        _id: "bin-001",
        name: "B Block Bin",
        address: "B Block, Near Main Gate, Prayagraj",
        city: "Prayagraj",
        latitude: 25.5263407,
        longitude: 81.8482162,
        qrCode: "BIN-PRJ-001",
        acceptedItems: ["all", "smartphone", "laptop", "battery", "e-waste"],
        fillLevel: 30,
        status: "operational"
    },
    {
        _id: "bin-002",
        name: "Civil Lines E-Bin",
        address: "Civil Lines, Near Hanuman Mandir, Prayagraj",
        latitude: 25.4534,
        longitude: 81.8340,
        qrCode: "BIN-PRJ-002",
        acceptedItems: ["smartphone", "laptop", "battery"],
        fillLevel: 45,
        status: "operational"
    },
    {
        _id: "bin-003",
        name: "Teliyarganj E-Bin",
        address: "Teliyarganj, Near MNNIT, Prayagraj",
        latitude: 25.4624,
        longitude: 81.8605,
        qrCode: "BIN-PRJ-003",
        acceptedItems: ["smartphone", "cable", "battery", "e-waste"],
        fillLevel: 20,
        status: "operational"
    },
    {
        _id: "bin-004",
        name: "Radhe Motor E-Waste Bin",
        address: "Motor, Near SantiPuram, Prayagraj",
        latitude: 25.5283335,
        longitude: 81.8478447,
        qrCode: "BIN-PRJ-004",
        acceptedItems: ["all"],
        fillLevel: 50,
        status: "operational"
    },
    {
        _id: "bin-005",
        name: "Santipuram E-Waste Bin",
        address: "Santipuram, Near Bus Stop, Prayagraj",
        latitude: 25.525979,
        longitude: 81.8426996,
        qrCode: "BIN-PRJ-005",
        acceptedItems: ["mobile", "accessories", "battery"],
        fillLevel: 75,
        status: "operational"
    },
    {
        _id: "bin-006",
        name: "Phaphamau Bridge E-Bin",
        address: "Phaphamau Main Market, Prayagraj",
        latitude: 25.4988,
        longitude: 81.8596,
        qrCode: "BIN-PRJ-006",
        acceptedItems: ["battery", "smartphone"],
        fillLevel: 80,
        status: "operational"
    },
    {
        _id: "bin-007",
        name: "Jhunsi E-Bin",
        address: "Jhunsi, Near Sangam, Prayagraj",
        latitude: 25.4180,
        longitude: 81.8700,
        qrCode: "BIN-PRJ-007",
        acceptedItems: ["heavy-electronics", "large-appliances"],
        fillLevel: 15,
        status: "operational"
    },
    {
        _id: "bin-008",
        name: "Bamrauli Airport E-Bin",
        address: "Near Airport Road, Prayagraj",
        latitude: 25.4399,
        longitude: 81.7360,
        qrCode: "BIN-PRJ-008",
        acceptedItems: ["all"],
        fillLevel: 90,
        status: "full"
    },
    {
        _id: "bin-009",
        name: "Naini Industrial Area E-Bin",
        address: "Naini Industrial Area, Prayagraj",
        latitude: 25.3820,
        longitude: 81.8850,
        qrCode: "BIN-PRJ-009",
        acceptedItems: ["laptop", "smartphone", "tablet"],
        fillLevel: 30,
        status: "operational"
    }
]

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        // Mock response for testing
        if (id === "BIN_TEST_01") {
            return NextResponse.json({
                success: true,
                data: {
                    _id: "test_bin_id_01",
                    name: "Test Recycling Bin",
                    address: "123 Green Street, Test City",
                    latitude: 25.5263407,
                    longitude: 81.8482162,
                    status: "operational",
                    fillLevel: 50,
                    acceptedItems: ["plastic", "paper", "e-waste"],
                    qrCode: "BIN_TEST_01"
                }
            })
        }

        // Find bin by ID or QR code from static data
        const bin = STATIC_BINS.find(b => b._id === id || b.qrCode === id)

        if (!bin) {
            return NextResponse.json({
                success: false,
                error: "Bin not found"
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            data: bin
        })

    } catch (error) {
        console.error("Bin fetch error:", error)
        return NextResponse.json({
            success: false,
            error: "Failed to fetch bin details"
        }, { status: 500 })
    }
}
