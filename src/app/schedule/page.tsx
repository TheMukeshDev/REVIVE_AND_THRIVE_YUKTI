
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, CheckCircle, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { DateTimeSelection } from "@/components/features/date-time-selection"
import { AddressManagement } from "@/components/features/address-management"
import { ConfirmationFlow } from "@/components/features/confirmation-flow"

type Step = "details" | "datetime" | "address" | "confirmation" | "success"

interface PickupDetails {
  wasteType: string
  date: string
  time: string
  address: string
  specialInstructions?: string
}

export default function SchedulePage() {
    const router = useRouter()
    const [step, setStep] = useState<Step>("details")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [pickupDetails, setPickupDetails] = useState<PickupDetails>({
        wasteType: "e-waste",
        date: "",
        time: "",
        address: "",
        specialInstructions: ""
    })

    const handleWasteTypeSelect = (type: string) => {
        setPickupDetails({ ...pickupDetails, wasteType: type })
        setStep("datetime")
    }



    const handleAddressSelect = (address: string) => {
        setPickupDetails({ ...pickupDetails, address })
        setStep("confirmation")
    }

    const handleConfirmPickup = async () => {
        setIsSubmitting(true)
        await new Promise(resolve => setTimeout(resolve, 2000))
        setIsSubmitting(false)
        setStep("success")
    }

    const handleBack = () => {
        const stepOrder: Step[] = ["details", "datetime", "address", "confirmation", "success"]
        const currentIndex = stepOrder.indexOf(step)
        if (currentIndex > 0) {
            setStep(stepOrder[currentIndex - 1])
        }
    }

    const renderStepContent = () => {
        switch (step) {
            case "details":
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Select Waste Type</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {[
                                    { type: "e-waste", label: "E-Waste", description: "Electronics, batteries, cables" },
                                    { type: "furniture", label: "Large Appliances", description: "Furniture, appliances, equipment" },
                                    { type: "mixed", label: "Mixed Recyclables", description: "Paper, plastic, glass, metal" }
                                ].map((option) => (
                                    <button
                                        key={option.type}
                                        onClick={() => handleWasteTypeSelect(option.type)}
                                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                                            pickupDetails.wasteType === option.type
                                                ? 'border-primary bg-primary/10'
                                                : 'border-border hover:border-primary/50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <Package className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium">{option.label}</div>
                                                <div className="text-sm text-muted-foreground">{option.description}</div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )

            case "datetime":
                return (
                    <DateTimeSelection
                        selectedDate={pickupDetails.date}
                        selectedTime={pickupDetails.time}
                        onDateSelect={(date) => setPickupDetails({ ...pickupDetails, date })}
                        onTimeSelect={(time) => setPickupDetails({ ...pickupDetails, time })}
                    />
                )

            case "address":
                return (
                    <AddressManagement
                        selectedAddress={pickupDetails.address}
                        onAddressSelect={handleAddressSelect}
                    />
                )

            case "confirmation":
                return (
                    <ConfirmationFlow
                        pickupDetails={pickupDetails}
                        onConfirm={handleConfirmPickup}
                        onBack={handleBack}
                        isSubmitting={isSubmitting}
                    />
                )

            case "success":
                return (
                    <Card className="bg-green-50 border-green-100">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-green-800">Booking Confirmed!</h2>
                            <p className="text-green-700 mt-2 max-w-xs">
                                Our team will arrive on {new Date(pickupDetails.date).toLocaleDateString()}. Thank you for recycling!
                            </p>
                            <div className="mt-6 space-y-2">
                                <Button onClick={() => router.push("/")} className="w-full">
                                    Back to Home
                                </Button>
                                <Button variant="outline" onClick={() => router.push("/profile")} className="w-full">
                                    View My Bookings
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )

            default:
                return null
        }
    }

    const canProceed = () => {
        switch (step) {
            case "details":
                return pickupDetails.wasteType !== ""
            case "datetime":
                return pickupDetails.date !== "" && pickupDetails.time !== ""
            case "address":
                return pickupDetails.address !== ""
            default:
                return false
        }
    }

    const handleNext = () => {
        if (!canProceed()) return

        const stepOrder: Record<Step, Step> = {
            "details": "datetime",
            "datetime": "address",
            "address": "confirmation",
            "confirmation": "success",
            "success": "success"
        }
        setStep(stepOrder[step])
    }

    return (
        <div className="flex flex-col gap-4 sm:gap-5 md:gap-4 lg:gap-5 pb-4 sm:pb-6 md:pb-4 lg:pb-6">
            {/* Header with back button */}
            <div className="flex items-center gap-4">
                {step !== "details" && step !== "success" && (
                    <Button variant="ghost" size="icon" onClick={handleBack}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                )}
                <h1 className="text-3xl font-bold">Schedule Pickup</h1>
            </div>

            {/* Progress indicator */}
            {step !== "success" && (
                <div className="flex items-center gap-2">
                    {["details", "datetime", "address", "confirmation"].map((stepName, index) => (
                        <div key={stepName} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                (Object.entries({ details: 1, datetime: 2, address: 3, confirmation: 4 })
                                    .find(([name]) => name === step)?.[1] ?? 0) >= index + 1
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary text-muted-foreground"
                            }`}>
                                {index + 1}
                            </div>
                            {index < 3 && (
                                <div className={`w-8 h-0.5 mx-2 ${
                                    (Object.entries({ details: 1, datetime: 2, address: 3, confirmation: 4 })
                                        .find(([name]) => name === step)?.[1] ?? 0) > index + 1
                                        ? "bg-primary"
                                        : "bg-secondary"
                                }`} />
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Step content */}
            {renderStepContent()}

            {/* Next button for steps 1-3 */}
            {step !== "confirmation" && step !== "success" && canProceed() && (
                <Button size="lg" onClick={handleNext} className="mt-4">
                    Continue
                </Button>
            )}
        </div>
    )
}
