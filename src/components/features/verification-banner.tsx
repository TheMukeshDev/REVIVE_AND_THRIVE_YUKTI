"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Clock, CheckCircle, AlertCircle, Navigation, Timer } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LocationPermissionFallback } from "@/components/features/location-permission-fallback"
import {
    locationTracker,
    destinationStorage,
    ActiveDestination,
    LocationState
} from "@/lib/geo-verification"

interface VerificationBannerProps {
    onVerificationComplete: (data: {
        binId: string
        location: { latitude: number; longitude: number }
        timeSpent: number
    }) => void
    onTrackingError: (error: string) => void
    activeDestination: ActiveDestination | null
    onCancel: () => void
}

export function VerificationBanner({
    onVerificationComplete,
    onTrackingError,
    activeDestination,
    onCancel
}: VerificationBannerProps) {
    const [locationState, setLocationState] = useState<LocationState>({
        isNearBin: false,
        withinRadiusTime: 0,
        canConfirm: false
    })
    const [locationDenied, setLocationDenied] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Use activeDestination directly
    const destination = activeDestination

    const startVerification = useCallback(async (dest: ActiveDestination) => {
        try {
            setError(null)

            await locationTracker.startTracking(dest, (state) => {
                setLocationState(state)
            })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to start location tracking'

            // Check if it's a permission denied error
            if (errorMessage.includes('permission denied') || errorMessage.includes('PERMISSION_DENIED')) {
                setLocationDenied(true)
            } else {
                setError(errorMessage)
            }

            onTrackingError(errorMessage)
        }
    }, [onTrackingError])



    const handleConfirmDrop = useCallback(() => {
        if (!destination || !locationState.canConfirm) return

        // Get current location for verification
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const verificationData = {
                    binId: destination.binId,
                    location: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    },
                    timeSpent: locationState.withinRadiusTime
                }

                // Stop tracking
                locationTracker.stopTracking()
                destinationStorage.clear()

                onVerificationComplete(verificationData)
            },
            (error) => {
                onTrackingError('Failed to get final location for verification')
            }
        )
    }, [destination, locationState.canConfirm, locationState.withinRadiusTime, onVerificationComplete, onTrackingError])

    const handleCancel = useCallback(() => {
        onCancel()
    }, [onCancel])

    // Start/Stop verification when destination changes
    useEffect(() => {
        if (activeDestination) {
            startVerification(activeDestination)
        } else {
            locationTracker.stopTracking()
        }
    }, [activeDestination, startVerification])

    // Don't render if no active destination
    if (!destination) return null

    // Show location permission fallback if location is denied
    if (locationDenied) {
        return (
            <LocationPermissionFallback
                onRetry={() => {
                    setLocationDenied(false)
                    startVerification(destination)
                }}
                onManualVerification={() => {
                    // Fallback to existing dropoff modal
                    onTrackingError("Location verification unavailable")
                }}
            />
        )
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="fixed bottom-4 left-4 right-4 z-50 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-96"
            >
                <Card className="shadow-lg border-2 bg-background/95 backdrop-blur-sm">
                    <CardContent className="p-4 space-y-4">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Navigation className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="font-semibold text-sm truncate">Verifying Drop</h3>
                                    <p className="text-xs text-muted-foreground truncate">{destination.binName}</p>
                                    {destination.address && (
                                        <p className="text-[10px] text-muted-foreground truncate">{destination.address}</p>
                                    )}
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </div>

                        {/* Error State */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="p-3 bg-red-50 border border-red-200 rounded-lg"
                            >
                                <div className="flex items-center gap-2 text-red-700">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-sm">{error}</span>
                                </div>
                            </motion.div>
                        )}

                        {/* Proximity Status */}
                        <div className="space-y-3">
                            {/* Distance Indicator */}
                            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        {locationState.isNearBin ? "You're nearby!" : "Distance to bin"}
                                    </span>
                                </div>
                                <span className="text-sm font-medium">
                                    {locationState.distance !== undefined
                                        ? `${Math.round(locationState.distance)}m`
                                        : "Calculating..."
                                    }
                                </span>
                            </div>

                            {/* Time in Radius */}
                            {locationState.isNearBin && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                                >
                                    <div className="flex items-center gap-2">
                                        <Timer className="w-4 h-4 text-green-600" />
                                        <span className="text-sm text-green-700">
                                            Time in verification zone
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-green-700">
                                        {locationState.withinRadiusTime}s / 30s
                                    </span>
                                </motion.div>
                            )}

                            {/* Progress Bar */}
                            {locationState.isNearBin && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Verification Progress</span>
                                        <span>{Math.min(100, Math.round((locationState.withinRadiusTime / 30) * 100))}%</span>
                                    </div>
                                    <div className="w-full bg-secondary rounded-full h-2">
                                        <motion.div
                                            className="bg-green-500 h-2 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(100, (locationState.withinRadiusTime / 30) * 100)}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirmation Button */}
                        <AnimatePresence mode="wait">
                            {locationState.canConfirm ? (
                                <motion.div
                                    key="confirm"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                >
                                    <Button
                                        onClick={handleConfirmDrop}
                                        className="w-full bg-green-600 hover:bg-green-700"
                                        size="lg"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Create Drop Location
                                    </Button>
                                    <p className="text-xs text-muted-foreground text-center mt-2">
                                        You&apos;ve been verified! Confirm after dropping your e-waste.
                                    </p>
                                </motion.div>
                            ) : locationState.isNearBin ? (
                                <motion.div
                                    key="waiting"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <Button disabled className="w-full" size="lg">
                                        <Clock className="w-4 h-4 mr-2" />
                                        Please wait {Math.max(0, 30 - locationState.withinRadiusTime)}s
                                    </Button>
                                    <p className="text-xs text-muted-foreground text-center mt-2">
                                        Stay within 50 meters of bin to verify
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="navigating"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    {/* Show Address instead of Disabled Button */}
                                    <div className="p-3 bg-secondary/20 rounded-lg text-center -mt-1">
                                        <p className="text-xs font-semibold text-muted-foreground mb-1">GO TO:</p>
                                        <p className="text-sm font-medium">{destination.address || destination.binName}</p>
                                    </div>
                                    <p className="text-xs text-blue-600 text-center mt-1.5 animate-pulse">
                                        Get within 50 meters to begin verification
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>
            </motion.div>
        </AnimatePresence>
    )
}