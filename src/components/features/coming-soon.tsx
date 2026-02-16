"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MapPin, Bell, Mail, Send, Rocket } from "lucide-react"
import { toast } from "sonner"

interface ComingSoonProps {
    city: string
    onNotifyMe?: (email?: string) => void
}

export function ComingSoon({ city, onNotifyMe }: ComingSoonProps) {
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showEmailInput, setShowEmailInput] = useState(false)

    const handleNotifyMe = async () => {
        setIsSubmitting(true)
        try {
            await onNotifyMe?.(email || undefined)
            setShowEmailInput(false)
            setEmail("")
            toast.success("We'll notify you when EcoDrop launches in your city!")
        } catch (error) {
            toast.error("Failed to save notification request. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="mb-6"
            >
                <div className="relative">
                    <div className="absolute inset-0 bg-linear-to-r from-green-400/20 to-blue-500/20 rounded-full blur-2xl"></div>
                    <div className="relative bg-linear-to-br from-green-50 to-blue-50 p-8 rounded-full border-2 border-dashed border-green-300">
                        <MapPin className="w-16 h-16 text-green-600" />
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-center mb-8 max-w-2xl mx-auto"
            >
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    EcoDrop is coming to <span className="text-green-600 capitalize">{city}</span>
                </h1>
                <p className="text-lg text-gray-600 mb-2">
                    We're expanding fast. This city will be supported soon.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Rocket className="w-4 h-4" />
                    <span>Join thousands waiting for eco-friendly e-waste disposal</span>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="w-full max-w-md"
            >
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                        {!showEmailInput ? (
                            <div className="text-center space-y-4">
                                <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
                                    <Bell className="w-5 h-5" />
                                    <span className="font-medium">Get notified when we launch</span>
                                </div>
                                <Button 
                                    onClick={() => setShowEmailInput(true)}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                                    size="lg"
                                >
                                    <MapPin className="w-4 h-4 mr-2" />
                                    Notify me when EcoDrop launches here
                                </Button>
                                <button
                                    onClick={() => onNotifyMe?.()}
                                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                                >
                                    Notify me without email
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-green-600 mb-4">
                                    <Mail className="w-4 h-4" />
                                    <span className="font-medium">Enter your email (optional)</span>
                                </div>
                                <Input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full"
                                />
                                <div className="flex gap-2">
                                    <Button 
                                        onClick={handleNotifyMe}
                                        disabled={isSubmitting}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        <Send className="w-4 h-4 mr-2" />
                                        {isSubmitting ? "Submitting..." : "Notify Me"}
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        onClick={() => setShowEmailInput(false)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                                <button
                                    onClick={() => {
                                        setEmail("")
                                        handleNotifyMe()
                                    }}
                                    className="w-full text-sm text-gray-500 hover:text-gray-700 underline"
                                >
                                    Continue without email
                                </button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="mt-8 text-center"
            >
                <div className="text-sm text-gray-500 space-y-2">
                    <p>Currently available in: Prayagraj</p>
                    <p className="font-medium text-green-600">12 cities launching in 2025</p>
                </div>
            </motion.div>
        </motion.div>
    )
}