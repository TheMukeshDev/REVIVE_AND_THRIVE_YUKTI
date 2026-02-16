"use client"

import { useEffect, useState, useRef } from "react"
import { useMap } from "@vis.gl/react-google-maps"
import { DirectionsRenderer } from "@/components/features/directions-renderer" // Assuming this wrapper exists/updates

interface RouteLayerProps {
    userLocation: { latitude: number; longitude: number }
    destination: { lat: number; lng: number } | null | undefined
    onDirectionsFetched?: (result: google.maps.DirectionsResult) => void
}

export function RouteLayer({ userLocation, destination, onDirectionsFetched }: RouteLayerProps) {
    const map = useMap()
    const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null)
    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null)
    const lastOrigin = useRef<{ lat: number; lng: number } | null>(null)
    const lastDest = useRef<{ lat: number; lng: number } | null>(null)

    // Initialize DirectionsService
    useEffect(() => {
        if (!map) return
        setDirectionsService(new google.maps.DirectionsService())
    }, [map])

    // Calculate Route
    useEffect(() => {
        if (!directionsService || !destination || !userLocation) return

        // 1. Check if destination changed
        const destChanged = !lastDest.current ||
            Math.abs(destination.lat - lastDest.current.lat) > 0.00001 || // Exact match usually
            Math.abs(destination.lng - lastDest.current.lng) > 0.00001

        // 2. Check if user moved significantly (approx 20 meters)
        // 0.0002 degrees is roughly 22 meters
        const originChanged = !lastOrigin.current ||
            Math.abs(userLocation.latitude - lastOrigin.current.lat) > 0.0002 ||
            Math.abs(userLocation.longitude - lastOrigin.current.lng) > 0.0002

        // If nothing changed significantly and we already have a response, skip API call
        if (!destChanged && !originChanged && directionsResponse) {
            return
        }

        directionsService.route({
            origin: { lat: Number(userLocation.latitude), lng: Number(userLocation.longitude) },
            destination: { lat: Number(destination.lat), lng: Number(destination.lng) },
            travelMode: google.maps.TravelMode.DRIVING,
        }, (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
            if (status === google.maps.DirectionsStatus.OK && result) {
                setDirectionsResponse(result)
                onDirectionsFetched?.(result)

                // Update refs
                lastOrigin.current = { lat: userLocation.latitude, lng: userLocation.longitude }
                lastDest.current = { lat: destination.lat, lng: destination.lng }
            } else {
                console.error(`Error fetching directions: ${status}`)
            }
        })
    }, [directionsService, destination, userLocation, onDirectionsFetched])

    if (!directionsResponse) return null

    return (
        <DirectionsRenderer
            directions={directionsResponse}
            options={{
                suppressMarkers: true, // We have our own custom markers
                polylineOptions: {
                    strokeColor: "#3b82f6",
                    strokeOpacity: 0.8,
                    strokeWeight: 5,
                }
            }}
        />
    )
}
