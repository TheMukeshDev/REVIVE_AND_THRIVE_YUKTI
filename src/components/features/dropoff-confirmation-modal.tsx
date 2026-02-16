"use client"

import { useState, useRef, useEffect } from "react"
import { Check, X, Camera } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useUserLocation } from "@/hooks/use-user-location"
import { useTranslation } from "@/context/language-context"

interface DropoffConfirmationModalProps {
    binId: string
    binName: string
    binAddress: string
    acceptedItems: string[]
    isOpen: boolean
    onClose: () => void
    onSuccess: (pointsEarned: number) => void
}

const ITEM_TEMPLATES = [
    { itemName: "Smartphone", itemType: "smartphone", value: 50 },
    { itemName: "Laptop", itemType: "laptop", value: 100 },
    { itemName: "Battery (Li-ion)", itemType: "battery", value: 20 },
    { itemName: "Charger", itemType: "charger", value: 10 },
    { itemName: "Plastic Bottle", itemType: "plastic_bottle", value: 5 },
    { itemName: "Headphones", itemType: "headphones", value: 15 },
]

export function DropoffConfirmationModal({
    binId,
    binName,
    binAddress,
    acceptedItems,
    isOpen,
    onClose,
    onSuccess
}: DropoffConfirmationModalProps) {
    const { user } = useAuth()
    const { t } = useTranslation()
    const userLocation = useUserLocation()
    const [selectedItems, setSelectedItems] = useState<typeof ITEM_TEMPLATES>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string>("")

    // VERIFICATION FLOW STATE
    const [step, setStep] = useState<"SELECT" | "RESCAN" | "VERIFYING">("SELECT")
    const [initialImage, setInitialImage] = useState<string | null>(null)
    const [permissionDenied, setPermissionDenied] = useState(false)

    // CAMERA STATE (For Rescan)
    const videoRef = useRef<HTMLVideoElement>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)

    useEffect(() => {
        if (!isOpen) return

        // Check if we are in a drop flow
        const storedImage = sessionStorage.getItem("pending_drop_image")
        if (storedImage) {
            setInitialImage(storedImage)
        }
    }, [isOpen])

    // Cleanup camera on close
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach((t: MediaStreamTrack) => t.stop())
            }
        }
    }, [stream])

    const startCamera = async () => {
        setPermissionDenied(false)
        setError("")
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
            setStream(mediaStream)
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream
            }
        } catch (e) {
            console.error(e)
            setError("Camera access is required")
            setPermissionDenied(true)
        }
    }

    const captureAndVerify = async () => {
        if (!videoRef.current) return

        setStep("VERIFYING")

        // Mock AI Verification Process
        setTimeout(() => {
            // We assume "Match" for MVP
            // In real app: Compare captured frame with `initialImage`
            completeDropoff()

            // Cleanup
            if (stream) stream.getTracks().forEach((t: MediaStreamTrack) => t.stop())
            sessionStorage.removeItem("pending_drop_image")
            sessionStorage.removeItem("drop_flow_active")
        }, 2000)
    }

    if (!isOpen) return null

    const toggleItem = (item: typeof ITEM_TEMPLATES[0]) => {
        setSelectedItems((prev) => {
            const exists = prev.find((i) => i.itemName === item.itemName)
            if (exists) {
                return prev.filter((i) => i.itemName !== item.itemName)
            }
            return [...prev, item]
        })
    }

    // Calculate total points
    const totalPoints = selectedItems.reduce((sum: number, item) => sum + (item.value * 2), 0)

    const handleNext = () => {
        if (selectedItems.length === 0) {
            setError("Please select at least one item")
            return
        }

        if (initialImage) {
            setStep("RESCAN")
            startCamera()
        } else {
            // Standard flow (no pre-scan)
            completeDropoff()
        }
    }

    const completeDropoff = async () => {
        if (!user) {
            setError("You must be logged in")
            return
        }

        setIsSubmitting(true)
        setError("")

        try {
            const response = await fetch("/api/dropoff/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user._id,
                    binId,
                    items: selectedItems,
                    verificationMethod: initialImage ? "ai_vision_verified" : "self_report",
                    userLocation: {
                        latitude: userLocation.latitude,
                        longitude: userLocation.longitude
                    },
                    capturedAt: new Date().toISOString() // Include current timestamp for validation
                })
            })

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(data.error || "Failed to verify drop-off")
            }

            // Success!
            onSuccess(data.data.pointsEarned)
            onClose()

        } catch (err: any) {
            setError(err.message || "Something went wrong")
            setStep("SELECT")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden">
            <div className="bg-background rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-border flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold">
                            {step === "SELECT" ? t("drop_items_title") : "Verify Item"}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            {step === "SELECT" ? binName : "Rescan item to confirm drop"}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* CONTENT AREA */}
                <div className="flex-1 overflow-y-auto p-6">
                    {step === "SELECT" && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-muted-foreground mb-3">{t("select_items_instruction")}</h3>
                            {ITEM_TEMPLATES.map((item) => {
                                const isSelected = selectedItems.some((i) => i.itemName === item.itemName)
                                const isAccepted = acceptedItems.length === 0 || acceptedItems.some(ai =>
                                    ai.toLowerCase().includes(item.itemType.toLowerCase()) ||
                                    item.itemType.toLowerCase().includes(ai.toLowerCase())
                                )

                                return (
                                    <button
                                        key={item.itemName}
                                        onClick={() => isAccepted && toggleItem(item)}
                                        disabled={!isAccepted}
                                        className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center justify-between ${isSelected
                                            ? "border-primary bg-primary/10"
                                            : isAccepted
                                                ? "border-border hover:border-primary/50 bg-secondary/30"
                                                : "border-border/50 bg-secondary/10 opacity-50 cursor-not-allowed"
                                            }`}
                                    >
                                        <div className="flex-1">
                                            <div className="font-semibold">{item.itemName}</div>
                                            <div className="text-xs text-muted-foreground">+{item.value * 2} points</div>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? "border-primary bg-primary" : "border-border"}`}>
                                            {isSelected && <Check className="h-4 w-4 text-white" />}
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    )}

                    {step === "RESCAN" && (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-full aspect-3/4 bg-black rounded-2xl overflow-hidden relative shadow-inner">
                                {permissionDenied ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 text-white p-6 text-center z-10">
                                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                                            <Camera className="w-8 h-8 text-red-500" />
                                        </div>
                                        <h4 className="font-bold mb-2">Camera Disabled</h4>
                                        <p className="text-sm text-zinc-400 mb-6">We need camera access to verify your items.</p>
                                        <button
                                            onClick={startCamera}
                                            className="bg-white text-black px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform"
                                        >
                                            Enable Camera
                                        </button>
                                    </div>
                                ) : (
                                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                                )}
                                <div className="absolute inset-0 border-2 border-primary/50 rounded-2xl pointer-events-none"></div>
                                {!permissionDenied && (
                                    <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm bg-black/50 py-1">
                                        Align item in frame
                                    </div>
                                )}
                            </div>

                            {/* GPS Warning / Enable Button */}
                            {userLocation.usingDefault && (
                                <div className="w-full p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center gap-3 animate-pulse">
                                    <div className="p-2 bg-orange-500/20 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-orange-700 dark:text-orange-400">GPS is Disabled</p>
                                        <p className="text-xs text-orange-600/80 dark:text-orange-400/80">Location required for verification.</p>
                                    </div>
                                    <button
                                        // @ts-ignore
                                        onClick={userLocation.retryLocation}
                                        className="px-3 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-lg hover:bg-orange-600 transition-colors"
                                    >
                                        Enable
                                    </button>
                                </div>
                            )}

                            <div className="text-sm text-center text-muted-foreground">
                                Rescan the exact same item you snapped earlier to verify ownership.
                            </div>
                        </div>
                    )}

                    {step === "VERIFYING" && (
                        <div className="flex flex-col items-center justify-center h-64 gap-4">
                            <div className="relative w-20 h-20">
                                <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <h3 className="text-xl font-bold">Verifying Match...</h3>
                            <p className="text-muted-foreground text-center">Comparing with initial scan.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="shrink-0 p-6 border-t border-border bg-secondary/20">
                    {error && (
                        <div className="mb-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {step === "SELECT" && (
                        <>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-muted-foreground">{t("total_points")}:</span>
                                <span className="text-2xl font-bold text-primary">+{totalPoints}</span>
                            </div>
                            <button
                                onClick={handleNext}
                                disabled={selectedItems.length === 0 || isSubmitting}
                                className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Processing..." : (initialImage ? "Continue to Verification" : t("confirm_drop"))}
                            </button>
                        </>
                    )}

                    {step === "RESCAN" && (
                        <button
                            onClick={captureAndVerify}
                            disabled={isSubmitting}
                            className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Camera className="inline w-5 h-5 mr-2" />
                            {isSubmitting ? "Verifying..." : "Verify & Drop"}
                        </button>
                    )}

                    {step === "VERIFYING" && (
                        <button
                            disabled
                            className="w-full bg-primary/50 text-primary-foreground font-bold py-3 rounded-xl opacity-50 cursor-not-allowed"
                        >
                            Verifying...
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
