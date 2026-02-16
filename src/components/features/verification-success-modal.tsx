"use client"

import { motion } from "framer-motion"
import { CheckCircle, Award, Leaf, Zap, Trophy } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface VerificationSuccessModalProps {
    isOpen: boolean
    onClose: () => void
    data: {
        pointsEarned: number
        co2Saved: number
        binName: string
        impact?: {
            itemsRecycled: number
            co2Saved: string
            energySaved: string
        }
    }
}

export function VerificationSuccessModal({ 
    isOpen, 
    onClose, 
    data 
}: VerificationSuccessModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-md"
            >
                <Card className="bg-linear-to-br from-green-50 to-emerald-50 border-green-200">
                    <CardContent className="p-6 space-y-6">
                        {/* Success Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="flex justify-center"
                        >
                            <div className="h-20 w-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                <CheckCircle className="h-10 w-10 text-white" />
                            </div>
                        </motion.div>

                        {/* Success Message */}
                        <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold text-green-800">
                            E-Waste Verified!
                        </h2>
                        <p className="text-green-600">
                            Your drop at {data.binName} has been confirmed
                        </p>
                        <p className="text-sm text-green-700 mt-2">
                            ✅ Environmental impact now updated in your profile
                        </p>
                        </div>

                        {/* Rewards Grid */}
                        <div className="grid grid-cols-3 gap-4">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-center"
                            >
                                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                                    <Award className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div className="text-lg font-bold text-gray-800">
                                    +{data.pointsEarned}
                                </div>
                                <div className="text-xs text-gray-600">Points</div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-center"
                            >
                                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                                    <Leaf className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="text-lg font-bold text-gray-800">
                                    {data.co2Saved}kg
                                </div>
                                <div className="text-xs text-gray-600">CO₂ Saved</div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-center"
                            >
                                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                                    <Trophy className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="text-lg font-bold text-gray-800">
                                    +1
                                </div>
                                <div className="text-xs text-gray-600">Item</div>
                            </motion.div>
                        </div>

                        {/* Impact Details */}
                        {data.impact && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="bg-white/50 rounded-lg p-4 space-y-3"
                            >
                                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <Zap className="h-4 w-4 text-green-500" />
                                    Your Environmental Impact
                                </h3>
                                
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Items Recycled</span>
                                        <span className="font-medium">{data.impact.itemsRecycled}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">CO₂ Saved</span>
                                        <span className="font-medium">{data.impact.co2Saved}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Energy Saved</span>
                                        <span className="font-medium">{data.impact.energySaved}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Achievement Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.7 }}
                            className="text-center"
                        >
                            <div className="inline-flex items-center gap-2 bg-linear-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full text-sm font-medium">
                                <Trophy className="h-4 w-4" />
                                Eco Warrior Achievement
                            </div>
                        </motion.div>

                        {/* Action Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <Button 
                                onClick={onClose}
                                className="w-full bg-green-600 hover:bg-green-700"
                                size="lg"
                            >
                                Continue Recycling
                            </Button>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}