
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { QrCode, Recycle, CheckCircle, Smartphone, Battery, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function BinSimulatorPage() {
    const [step, setStep] = useState<"idle" | "scanning" | "processing" | "result">("idle")
    const [fillLevel, setFillLevel] = useState(42)

    // Simulate flow
    const handleStart = () => {
        setStep("scanning")
        // Simulate User Scan Delay
        setTimeout(() => setStep("processing"), 2000)
        // Simulate Processing Delay
        setTimeout(() => {
            setStep("result")
            setFillLevel(prev => Math.min(prev + 5, 100))
        }, 5000)
    }

    const handleReset = () => {
        setStep("idle")
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4 font-mono">
            <div className="w-full max-w-md border-4 border-zinc-800 rounded-3xl overflow-hidden shadow-2xl bg-black relative">
                {/* Physical Device Frame Mockup */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-zinc-900 flex justify-center items-center gap-2">
                    <div className="w-16 h-4 bg-black rounded-b-xl"></div>
                </div>

                <div className="h-150 flex flex-col relative">
                    {/* Header Status Bar */}
                    <div className="p-4 pt-8 flex justify-between items-center bg-zinc-900/50">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-xs uppercase tracking-widest text-zinc-400">System Online</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 bg-zinc-800 rounded-md p-1">
                                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-zinc-700 rounded text-white cursor-pointer">EN</span>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 text-zinc-500 cursor-pointer hover:text-white">HI</span>
                            </div>
                            <div className="text-xs text-zinc-500">
                                BIN ID: <span className="text-white">PRJ-001</span>
                            </div>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === "idle" && (
                            <motion.div
                                key="idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 flex flex-col items-center justify-center p-8 text-center"
                            >
                                <div className="mb-8 relative">
                                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
                                    <Recycle className="w-32 h-32 text-primary relative z-10" />
                                </div>
                                <h1 className="text-3xl font-bold mb-2">EcoDrop Smart Bin</h1>
                                <p className="text-zinc-400 mb-8">Touch, Scan QR, or Deposit Item</p>

                                <Button size="lg" className="w-full h-16 text-lg rounded-xl" onClick={handleStart}>
                                    <QrCode className="mr-2 h-6 w-6" /> Start Recycling
                                </Button>

                                <div className="mt-12 w-full">
                                    <div className="flex justify-between text-xs text-zinc-500 mb-1">
                                        <span>Current Fill Level</span>
                                        <span>{fillLevel}%</span>
                                    </div>
                                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-500 transition-all duration-1000"
                                            style={{ width: `${fillLevel}%` }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === "scanning" && (
                            <motion.div
                                key="scanning"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="flex-1 flex flex-col items-center justify-center p-8 text-center"
                            >
                                <div className="relative w-48 h-48 border-2 border-primary rounded-lg flex items-center justify-center mb-6 overflow-hidden">
                                    <div className="absolute inset-0 bg-primary/10 animate-scan"></div>
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-primary shadow-[0_0_20px_rgba(34,197,94,1)] animate-scan-line"></div>
                                    <QrCode className="w-24 h-24 text-primary/50" />
                                </div>
                                <h2 className="text-xl font-semibold">Identifying User...</h2>
                                <p className="text-zinc-500">Please verify via EcoDrop App</p>
                            </motion.div>
                        )}

                        {step === "processing" && (
                            <motion.div
                                key="processing"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 flex flex-col items-center justify-center p-8 text-center"
                            >
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-zinc-900 p-4 rounded-xl flex flex-col items-center animate-pulse">
                                        <Smartphone className="w-8 h-8 text-purple-400 mb-2" />
                                        <span className="text-xs">Visual Scan</span>
                                    </div>
                                    <div className="bg-zinc-900 p-4 rounded-xl flex flex-col items-center animate-pulse delay-100">
                                        <Battery className="w-8 h-8 text-yellow-400 mb-2" />
                                        <span className="text-xs">Material Check</span>
                                    </div>
                                </div>
                                <h2 className="text-xl font-semibold">Analyzing Waste...</h2>
                                <p className="text-zinc-500 mt-2">Determining value and recyclability</p>
                            </motion.div>
                        )}

                        {step === "result" && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 flex flex-col items-center justify-center p-8 text-center"
                            >
                                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/20">
                                    <CheckCircle className="w-10 h-10 text-black" />
                                </div>
                                <h2 className="text-2xl font-bold text-green-400">Accepted!</h2>
                                <p className="text-lg text-white mt-1">Old Smartphone Component</p>

                                <div className="mt-8 bg-zinc-900 rounded-xl p-4 w-full">
                                    <p className="text-zinc-400 text-sm">Credits Earned</p>
                                    <p className="text-3xl font-mono text-primary font-bold">+150 pts</p>
                                </div>

                                <Button className="mt-8 w-full" variant="outline" onClick={handleReset}>
                                    Done
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Physical Buttons Mock (Bottom) */}
                <div className="h-16 bg-zinc-900 flex justify-around items-center px-8 border-t border-zinc-800">
                    <div className="w-12 h-12 rounded-full border border-zinc-700 flex items-center justify-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes scan-line {
                    0% { top: 0; }
                    50% { top: 100%; }
                    100% { top: 0; }
                }
                .animate-scan-line {
                    animation: scan-line 2s linear infinite;
                }
            `}</style>
        </div>
    )
}
