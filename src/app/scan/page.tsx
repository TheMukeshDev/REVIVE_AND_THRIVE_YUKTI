"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { QRScanner } from "@/components/features/qr-scanner"
import { DropoffConfirmationModal } from "@/components/features/dropoff-confirmation-modal"
import { QrCode, Camera, ArrowRight, X } from "lucide-react"
import { toast } from "sonner"
import { Logo } from "@/components/ui/logo"
import { useAuth } from "@/context/auth-context"

export default function ScanPage() {
    const router = useRouter()
    const { user } = useAuth()
    const [mode, setMode] = useState<"menu" | "product_scan" | "bin_scan">("menu")

    // Bin Scan State
    const [scannedBin, setScannedBin] = useState<any>(null)
    const [showDropoffModal, setShowDropoffModal] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Product Scan State
    const videoRef = useRef<HTMLVideoElement>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)

    // Check authentication
    useEffect(() => {
        if (!user) {
            router.push("/auth/login?redirect=/scan")
        }
    }, [user, router])

    // Start Camera for Product Scan
    useEffect(() => {
        if (mode === "product_scan") {
            startCamera()
        } else {
            stopCamera()
        }
        return () => stopCamera()
    }, [mode])

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" }
            })
            setStream(mediaStream)
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream
            }
        } catch (err) {
            toast.error("Camera access denied")
            setMode("menu")
        }
    }

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop())
            setStream(null)
        }
    }

    const captureProduct = async () => {
        if (!videoRef.current) return

        const canvas = document.createElement("canvas")
        canvas.width = videoRef.current.videoWidth
        canvas.height = videoRef.current.videoHeight
        const ctx = canvas.getContext("2d")
        if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0)
            const imageData = canvas.toDataURL("image/jpeg")

            // Show analyzing state
            setIsLoading(true)

            try {
                // Call AI detection API
                const res = await fetch("/api/scan/analyze", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image: imageData, userId: user?._id })
                })

                const data = await res.json()

                if (data.success) {
                    // Store detailed AI results
                    sessionStorage.setItem("pending_drop_image", imageData)
                    sessionStorage.setItem("drop_flow_active", "true")
                    sessionStorage.setItem("scanned_item_type", data.result.type)
                    sessionStorage.setItem("scanned_category", data.result.category)
                    sessionStorage.setItem("ai_confidence", data.result.confidence.toString())
                    
                    if (data.transactionId) {
                        sessionStorage.setItem("pending_transaction_id", data.transactionId)
                    }

                    toast.success(`Identified: ${data.result.type} (${(data.result.confidence * 100).toFixed(0)}% confidence)`)

                    // Stop camera before redirecting
                    stopCamera()

                    // Redirect to map with filter pre-selected
                    router.push(`/find-bin?dropFlow=true&filter=${data.result.category === 'e-waste' ? 'all' : 'all'}&item=${encodeURIComponent(data.result.type)}`)
                } else {
                    toast.error("Could not identify item. Please try again.")
                }
            } catch (error) {
                console.error("Scan error:", error)
                toast.error("Failed to analyze image")
            } finally {
                setIsLoading(false)
            }
        }
    }

    const handleQRScan = async (qrCode: string) => {
        setMode("menu")
        setIsLoading(true)

        try {
            const response = await fetch(`/api/bins/${qrCode}`)
            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(data.error || "Bin not found")
            }

            setScannedBin(data.data)
            setShowDropoffModal(true)

        } catch (error: any) {
            toast.error(error.message || "Failed to find bin")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDropoffSuccess = (pointsEarned: number) => {
        toast.success(`🎉 Drop-off verified! You earned ${pointsEarned} points!`)
        setShowDropoffModal(false)
        setScannedBin(null)
    }

    return (
        <div className="flex flex-col items-center min-h-[80vh] p-6 gap-6 relative">
            {/* Header */}
            <div className="text-center space-y-2 mt-8">
                <div className="flex justify-center mb-2">
                    <Logo className="w-16 h-16" />
                </div>
                <h1 className="text-3xl font-bold">
                    {mode === "menu" ? "Start Recycling" :
                        mode === "product_scan" ? "Scan Product" : "Scan Bin QR"}
                </h1>
                <p className="text-muted-foreground max-w-xs mx-auto">
                    {mode === "menu" ? "Choose how you want to recycle today." :
                        mode === "product_scan" ? "Take a photo of the item you want to recycle." :
                            "Scan the QR code on the Smart Bin."}
                </p>
            </div>

            {/* Menu Mode */}
            {mode === "menu" && (
                <div className="flex flex-col gap-4 w-full max-w-md mt-8">
                    <button
                        onClick={() => setMode("product_scan")}
                        className="flex items-center justify-between bg-linear-to-r from-primary to-green-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-xl">
                                <Camera className="w-8 h-8" />
                            </div>
                            <div className="text-left">
                                <span className="block text-lg font-bold">New Drop-off</span>
                                <span className="text-sm opacity-90">Scan item & find bin</span>
                            </div>
                        </div>
                        <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-muted/30"></span></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or</span></div>
                    </div>

                    <button
                        onClick={() => setMode("bin_scan")}
                        className="flex items-center justify-between bg-card border-2 border-dashed border-muted p-6 rounded-2xl hover:bg-secondary/50 transition-all text-muted-foreground hover:text-foreground"
                    >
                        <div className="flex items-center gap-4">
                            <QrCode className="w-8 h-8 opacity-70" />
                            <div className="text-left">
                                <span className="block font-semibold">I'm already at a Bin</span>
                                <span className="text-sm opacity-70">Scan Bin QR Code</span>
                            </div>
                        </div>
                    </button>
                </div>
            )}

            {/* Product Camera Mode */}
            {mode === "product_scan" && (
                <div className="w-full max-w-md bg-black rounded-3xl overflow-hidden shadow-2xl relative aspect-3/4">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                    />

                    {/* Camera Controls */}
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-8">
                        <button
                            onClick={() => setMode("menu")}
                            className="bg-white/20 backdrop-blur p-4 rounded-full text-white hover:bg-white/30"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <button
                            onClick={captureProduct}
                            className="w-20 h-20 bg-white rounded-full border-4 border-primary/50 flex items-center justify-center hover:scale-105 transition-transform"
                        >
                            <div className="w-16 h-16 bg-primary rounded-full border-2 border-white"></div>
                        </button>
                    </div>
                </div>
            )}

            {/* Bin QR Scanner Mode */}
            {mode === "bin_scan" && (
                <div className="w-full max-w-md h-400 bg-black rounded-3xl overflow-hidden relative">
                    <QRScanner
                        onScan={handleQRScan}
                        onError={(error) => toast.error(error)}
                        onClose={() => setMode("menu")}
                    />
                </div>
            )}

            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-white">
                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p>Verifying Bin...</p>
                </div>
            )}

            {/* Drop-off Confirmation Modal */}
            {showDropoffModal && scannedBin && (
                <DropoffConfirmationModal
                    binId={scannedBin._id}
                    binName={scannedBin.name}
                    binAddress={scannedBin.address || "N/A"}
                    acceptedItems={scannedBin.acceptedItems}
                    isOpen={showDropoffModal}
                    onClose={() => {
                        setShowDropoffModal(false)
                        setScannedBin(null)
                    }}
                    onSuccess={handleDropoffSuccess}
                />
            )}
        </div>
    )
}
