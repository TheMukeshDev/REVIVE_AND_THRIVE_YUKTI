import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Notification, { INotification } from "@/models/Notification"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

const FALLBACK_NOTIFICATIONS = [
    { title: "Battery Safety", message: "Tape battery terminals before disposal to prevent fires! 🔋", category: "action" },
    { title: "Did You Know?", message: "90% of a smartphone's materials can be recovered and reused. 📱", category: "awareness" },
    { title: "Local Impact", message: "Your city recycled 5 tons of e-waste last month! 🌱", category: "local" },
    { title: "Gamification", message: "You act, we track! Earn points for every item recycled. 🏅", category: "gamification" }
]

export async function GET() {
    try {
        // Try to connect to MongoDB with timeout
        let dbConnected = false
        try {
            await Promise.race([
                dbConnect(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('DB connection timeout')), 5000))
            ])
            dbConnected = true
        } catch (dbError) {
            console.warn("MongoDB connection unavailable, using fallback notification", dbError)
            dbConnected = false
        }

        // Generate notification
        const todayStr = new Date().toISOString().split('T')[0] // "YYYY-MM-DD"
        let notification: any = null

        // Try to fetch from DB if connected
        if (dbConnected) {
            notification = await Notification.findOne({ dateId: todayStr })
        }

        if (notification) {
            return NextResponse.json({ success: true, data: notification })
        }

        // Generate new notification
        let newContent = { ...FALLBACK_NOTIFICATIONS[Math.floor(Math.random() * FALLBACK_NOTIFICATIONS.length)] }

        try {
            if (process.env.GEMINI_API_KEY) {
                const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
                const prompt = `Generate a single short, engaging, and educational notification about e-waste recycling for a smart city app.
                Categories: Awareness (facts), Action (tips), Local (community), Gamification (points).
                Output JSON ONLY: { "title": "string", "message": "string (max 120 chars)", "category": "awareness"|"action"|"local"|"gamification" }
                Make it catchy and use emojis.`

                const result = await model.generateContent(prompt)
                const text = result.response.text()
                const jsonText = text.replace(/```json/g, "").replace(/```/g, "").trim()
                const aiContent = JSON.parse(jsonText)

                if (aiContent.title && aiContent.message && aiContent.category) {
                    newContent = aiContent
                }
            }
        } catch (aiError) {
            console.warn("AI generation failed, using fallback", aiError)
        }

        // Try to save to DB if connected
        if (dbConnected) {
            try {
                notification = await Notification.create({
                    dateId: todayStr,
                    title: newContent.title,
                    message: newContent.message,
                    category: newContent.category,
                    createdAt: new Date()
                })
            } catch (saveError) {
                console.warn("Failed to save notification to DB", saveError)
            }
        }

        return NextResponse.json({ success: true, data: newContent })

    } catch (error) {
        console.error("Daily Notification Error", error)
        // Return a fallback notification even on error
        const fallback = FALLBACK_NOTIFICATIONS[Math.floor(Math.random() * FALLBACK_NOTIFICATIONS.length)]
        return NextResponse.json({ success: true, data: fallback })
    }
}
