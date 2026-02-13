import { config } from "dotenv"
import mongoose from "mongoose"

// Load environment variables from .env.local or .env
config({ path: ".env.local" })
config({ path: ".env" })

import Bin from "../src/models/Bin.ts"
import User from "../src/models/User.ts"
import Reward from "../src/models/Reward.ts"

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL || process.env.MONGO_URL

if (!MONGODB_URI) {
    console.log("⚠️  Tip: Set MONGODB_URI, DATABASE_URL, or MONGO_URL environment variable in .env.local or .env")
}

const ITEMS = ["plastic_bottle", "glass_bottle", "aluminum_can", "smartphone", "laptop", "battery"]
const STATUSES = ["operational", "full", "maintenance"]

// Helper for random number
const random = (min: number, max: number) => Math.random() * (max - min) + min
const randomInt = (min: number, max: number) => Math.floor(random(min, max))
const randomElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)]

// Hardcoded bin data
const HARDCODED_BINS = [
    { name: "Civil Lines Main Market", lat: 25.4526, lng: 81.8340 },
    { name: "Sangam Area", lat: 25.4293, lng: 81.8841 },
    { name: "Teliyarganj", lat: 25.4746, lng: 81.8654 },
    { name: "George Town", lat: 25.4435, lng: 81.8493 },
    { name: "Allahabad University", lat: 25.4593, lng: 81.8507 },
    { name: "Chowk Market", lat: 25.4380, lng: 81.8347 },
    { name: "Naini Industrial Area", lat: 25.3952, lng: 81.8557 },
    { name: "Phaphamau Bridge", lat: 25.5034, lng: 81.8576 },
    { name: "Jhunsi", lat: 25.4312, lng: 81.9126 },
    { name: "Bamrauli Airport", lat: 25.4419, lng: 81.7456 },
    { name: "test bin location", lat: 25.4287377, lng: 82.2564541 }
]

// MongoDB connection with timeout
const connectMongo = async (timeout = 5000): Promise<boolean> => {
    if (!MONGODB_URI) {
        console.log("⚠️  MONGODB_URI not set. Using hardcoded data only.")
        return false
    }

    try {
        console.log("Connecting to MongoDB...")
        const promise = mongoose.connect(MONGODB_URI)
        
        // Create a promise that rejects after timeout
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("MongoDB connection timeout")), timeout)
        )
        
        // Race the two promises
        await Promise.race([promise, timeoutPromise])
        console.log("✅ MongoDB connected!")
        return true
    } catch (error: any) {
        console.log("⚠️  MongoDB connection failed:", error.message)
        console.log("💾 Using hardcoded bin data instead...")
        return false
    }
}

async function seed() {
    try {
        const mongoConnected = await connectMongo()

        if (mongoConnected) {
            console.log("Clearing existing data...")
            await Bin.deleteMany({})
            await User.deleteMany({})
            await Reward.deleteMany({})
        }

        console.log("\n📦 Creating bins from hardcoded data...")
        const bins = HARDCODED_BINS.map((loc, index) => ({
            name: `${loc.name} E-Bin`,
            address: `${loc.name}, Prayagraj`,
            latitude: loc.lat,
            longitude: loc.lng,
            qrCode: `BIN-PRJ-${String(index + 1).padStart(3, '0')}`,
            acceptedItems: [
                randomElement(ITEMS),
                randomElement(ITEMS),
                randomElement(ITEMS),
                randomElement(ITEMS)
            ].filter((v, i, a) => a.indexOf(v) === i), // Unique items
            fillLevel: randomInt(0, 100),
            status: Math.random() > 0.8 ? "full" : (Math.random() > 0.9 ? "maintenance" : "operational")
        }))

        if (mongoConnected) {
            await Bin.insertMany(bins)
            console.log(`✅ Created ${bins.length} bins in database`)
        } else {
            console.log(`📋 Prepared ${bins.length} bins (not inserted - MongoDB unavailable)`)
            console.log("\nSample bin data:")
            console.log(JSON.stringify(bins.slice(0, 2), null, 2))
        }

        if (mongoConnected) {
            console.log("\n👥 Creating users...")
            const users = []
            for (let i = 0; i < 5; i++) {
                users.push({
                    name: `User ${i + 1}`,
                    username: `user${i + 1}`,
                    email: `user${i + 1}@example.com`,
                    totalItemsRecycled: randomInt(5, 500),
                    totalCO2Saved: parseFloat(random(1, 50).toFixed(2)),
                    points: randomInt(100, 5000),
                })
            }
            await User.insertMany(users)
            console.log(`✅ Created ${users.length} users`)

            console.log("\n🎁 Creating rewards...")
            const rewards = [
                { title: "Coffee Voucher", pointsRequired: 500, description: "Get a free coffee at local cafes." },
                { title: "Eco Tote Bag", pointsRequired: 1000, description: "Reusable cotton tote bag." },
                { title: "$10 Gift Card", pointsRequired: 2500, description: "Redeemable at major retailers." },
                { title: "Tree Planting", pointsRequired: 3000, description: "We plant a tree in your name." },
            ]
            await Reward.insertMany(rewards)
            console.log(`✅ Created ${rewards.length} rewards`)
        }

        if (mongoConnected) {
            await mongoose.disconnect()
            console.log("\n✅ Database seeded successfully! 🌱")
        } else {
            console.log("\n⚠️  Data prepared but not persisted (MongoDB unavailable)")
            console.log("Connect MongoDB and run seed again to persist data.")
        }
        
        process.exit(0)
    } catch (error) {
        console.error("\n❌ Error during seeding:", error)
        process.exit(1)
    }
}

seed()
