"use client"

import { useEffect, useState, useMemo } from "react"
import { APIProvider, Map, AdvancedMarker, InfoWindow, useMap } from "@vis.gl/react-google-maps"
import { IBin } from "@/models/Bin"
import { DEFAULT_LOCATION, GOOGLE_MAPS_LIBRARIES } from "@/lib/constants"
import { BinMarker, MapBin } from "./map/bin-marker"
import { RouteLayer } from "./map/route-layer"

// Re-export or use type locally if needed, but imported form bin-marker is better.
// However, props use `Bin` type defined in this file. Let's align types.
type Bin = MapBin

interface BinMapProps {
    bins: Bin[]
    userLocation: { latitude: number; longitude: number }
    usingDefaultLocation: boolean
    onBinSelect?: (bin: Bin) => void
    onNavigate?: (lat: number, lng: number) => void
    selectedBinId?: string | null
    destination?: { lat: number; lng: number } | null
}

export function BinMap({ bins, userLocation, usingDefaultLocation, onBinSelect, onNavigate, selectedBinId, destination }: BinMapProps) {
    const defaultCenter = { lat: DEFAULT_LOCATION.lat, lng: DEFAULT_LOCATION.lng }
    const center = usingDefaultLocation ? defaultCenter : { lat: userLocation.latitude, lng: userLocation.longitude }

    const [activeBin, setActiveBin] = useState<Bin | null>(null)
    const [routeInfo, setRouteInfo] = useState<{ distance: string, duration: string } | null>(null)

    // Update active bin when selectedBinId prop changes
    useEffect(() => {
        if (selectedBinId) {
            const bin = bins.find(b => b._id === selectedBinId)
            if (bin) setActiveBin(bin)
        }
    }, [selectedBinId, bins])

    // Clear route info when destination changes
    useEffect(() => {
        setRouteInfo(null)
    }, [destination])

    const handleMarkerClick = (bin: Bin) => {
        setActiveBin(bin)
        if (onBinSelect) onBinSelect(bin)
    }

    const handleDirectionsFetched = (result: google.maps.DirectionsResult) => {
        const leg = result.routes[0]?.legs[0]
        if (leg) {
            setRouteInfo({
                distance: leg.distance?.text || "",
                duration: leg.duration?.text || ""
            })
        }
    }

    const validBins = useMemo(() => {
        return bins.filter(bin =>
            typeof bin.latitude === 'number' &&
            typeof bin.longitude === 'number' &&
            !isNaN(bin.latitude) &&
            !isNaN(bin.longitude)
        )
    }, [bins])

    // Check if active bin is the current destination
    const isDestinationActive = activeBin && destination &&
        activeBin.latitude === destination.lat &&
        activeBin.longitude === destination.lng

    return (
        <div className="w-full h-full relative">
            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""} libraries={GOOGLE_MAPS_LIBRARIES}>
                <Map
                    defaultCenter={defaultCenter}
                    defaultZoom={12}
                    gestureHandling={"greedy"}
                    disableDefaultUI={true}
                    mapId={"ecodrop-map-id"}
                    className="w-full h-full"
                    style={{ width: "100%", height: "100%" }}
                >
                    {/* User Location Marker */}
                    {!usingDefaultLocation && (
                        <AdvancedMarker position={center} title="You are here">
                            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg pulse-animation" />
                        </AdvancedMarker>
                    )}

                    {/* Bin Markers */}
                    {validBins.map((bin) => (
                        <BinMarker
                            key={bin._id}
                            bin={bin}
                            onClick={handleMarkerClick}
                        />
                    ))}

                    {/* Info Window */}
                    {activeBin && (
                        <InfoWindow
                            position={{ lat: activeBin.latitude, lng: activeBin.longitude }}
                            onCloseClick={() => setActiveBin(null)}
                            pixelOffset={[0, -30]}
                        >
                            <div className="text-zinc-900 p-0 min-w-40 max-w-50">
                                <div className="flex justify-between items-start mb-1.5">
                                    <h3 className="font-bold text-xs pr-2 leading-tight">{activeBin.name}</h3>
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider text-white ${activeBin.status === 'operational' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                                        {activeBin.status === 'operational' ? 'Open' : activeBin.status}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1.5 mb-2">
                                    <div className="h-1 flex-1 bg-zinc-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${activeBin.fillLevel}%` }} />
                                    </div>
                                    <span className="text-[9px] font-medium text-zinc-500">{activeBin.fillLevel}% Full</span>
                                </div>

                                {/* Route Info */}
                                {isDestinationActive && routeInfo && (
                                    <div className="mb-2 p-1.5 bg-blue-50 border border-blue-100 rounded text-center">
                                        <p className="text-[10px] text-blue-600 font-bold">
                                            {routeInfo.distance} • {routeInfo.duration}
                                        </p>
                                    </div>
                                )}

                                <div className="flex gap-1 mb-2 overflow-hidden flex-wrap">
                                    {activeBin.acceptedItems.slice(0, 4).map(item => (
                                        <span key={item} className="text-[9px] bg-zinc-50 text-zinc-600 px-1 py-px rounded border border-zinc-200 leading-none">
                                            {item.includes('bottle') ? 'Bottle' : item.split('_').pop()}
                                        </span>
                                    ))}
                                </div>

                                <button
                                    onClick={() => onNavigate?.(activeBin.latitude, activeBin.longitude)}
                                    className="block w-full text-center bg-zinc-900 text-white text-[10px] font-bold py-1.5 rounded hover:bg-zinc-800 transition-colors"
                                >
                                    {isDestinationActive ? 'Navigating...' : 'Get Directions'}
                                </button>
                            </div>
                        </InfoWindow>
                    )}

                    <RouteLayer
                        userLocation={userLocation}
                        destination={destination}
                        onDirectionsFetched={handleDirectionsFetched}
                    />

                </Map>
                <MapHandler selectedBin={activeBin} userLocation={userLocation} usingDefaultLocation={usingDefaultLocation} />
            </APIProvider>
        </div>
    )
}

function MapHandler({ selectedBin, userLocation, usingDefaultLocation }: {
    selectedBin: Bin | null,
    userLocation: { latitude: number; longitude: number },
    usingDefaultLocation: boolean
}) {
    const map = useMap()
    const [hasPannedToUser, setHasPannedToUser] = useState(false)

    useEffect(() => {
        if (!map) return
        if (selectedBin) {
            map.panTo({ lat: selectedBin.latitude, lng: selectedBin.longitude })
        }
    }, [map, selectedBin])

    useEffect(() => {
        if (!map || usingDefaultLocation || hasPannedToUser) return
        map.panTo({ lat: userLocation.latitude, lng: userLocation.longitude })
        setHasPannedToUser(true)
    }, [map, userLocation, usingDefaultLocation, hasPannedToUser])

    return null
}
