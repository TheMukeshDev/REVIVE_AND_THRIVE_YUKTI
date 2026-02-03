"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useUserLocation } from "@/hooks/use-user-location"
import { useEWDropVerification } from "@/hooks/use-ew-drop-verification"
import { calculateDistance } from "@/lib/geo-verification"
import { detectCityFromCoordinates, isCitySupported } from "@/lib/city-detection"
import { BinMap } from "@/components/features/bin-map"
import { BinList } from "@/components/features/bin-list"
import { DropoffConfirmationModal } from "@/components/features/dropoff-confirmation-modal"
import { VerificationBanner } from "@/components/features/verification-banner"
import { VerificationSuccessModal } from "@/components/features/verification-success-modal"
import { ComingSoon } from "@/components/features/coming-soon"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin } from "lucide-react"
import { IBin } from "@/models/Bin"
import { toast } from "sonner"
import { useTranslation } from "@/context/language-context"
import { useSearchParams } from "next/navigation"

// Fix for type mismatch between Mongoose Document and Client JSON
type ClientBin = Omit<IBin, "_id"> & { _id: string }

export default function FindBinPage() {
    const { t } = useTranslation()
    const searchParams = useSearchParams()
    // Logic to detect drop flow
    const isDropFlow = searchParams.get("dropFlow") === "true" || (typeof window !== 'undefined' && sessionStorage.getItem("drop_flow_active") === "true")

    const loc = useUserLocation()
    const [bins, setBins] = useState<ClientBin[]>([])
    const [filteredBins, setFilteredBins] = useState<ClientBin[]>([])
    const [loadingBins, setLoadingBins] = useState(true)
    const [selectedBinId, setSelectedBinId] = useState<string | null>(null)
    const [filter, setFilter] = useState("all")
    const [destination, setDestination] = useState<{ lat: number, lng: number } | null>(null)
    const [dropoffBin, setDropoffBin] = useState<ClientBin | null>(null)
    const [showDropoffModal, setShowDropoffModal] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [successData, setSuccessData] = useState<any>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [city, setCity] = useState("Prayagraj")
    const [isCitySupported, setIsCitySupported] = useState(true)
    const [isListening, setIsListening] = useState(false)
    const [isMapExpanded, setIsMapExpanded] = useState(false)
    const hasAutoSelected = useRef(false)

    // EW Drop Verification System
    // Stabilize callbacks to prevent infinite loops in VerificationBanner
    const onVerificationSuccess = useCallback((data: any) => {
        setSuccessData(data)
        setShowSuccessModal(true)
    }, [])

    const onVerificationError = useCallback((error: string) => {
        console.error("Verification error:", error)
    }, [])

    const verification = useEWDropVerification({
        onVerificationSuccess,
        onVerificationError
    })

    const fetchBinsForCity = useCallback(async (searchCity: string) => {
        try {
            setLoadingBins(true)
            const res = await fetch(`/api/bins?city=${encodeURIComponent(searchCity)}`)
            const data = await res.json()

            if (data.supported === false) {
                setIsCitySupported(false)
                setCity(searchCity)
                setBins([])
                setFilteredBins([])
            } else if (data.success || data.supported === true) {
                setIsCitySupported(true)
                setCity(searchCity)
                const binData = data.data || data.bins || []
                setBins(binData)
                setFilteredBins(binData)
            }
        } catch (error) {
            console.error("Failed to fetch bins:", error)
            toast.error("Failed to load bins")
            setIsCitySupported(true)
        } finally {
            setLoadingBins(false)
        }
    }, [])

    useEffect(() => {
        // Auto-detect city from user location
        if (loc.latitude && loc.longitude && !loc.usingDefault) {
            const detectedCity = detectCityFromCoordinates(loc.latitude, loc.longitude)
            if (detectedCity !== "Unknown" && detectedCity !== "Prayagraj") {
                fetchBinsForCity(detectedCity)
                return
            }
        }

        // Default to Prayagraj
        fetchBinsForCity("Prayagraj")
    }, [loc.latitude, loc.longitude, loc.usingDefault, fetchBinsForCity])

    useEffect(() => {
        let result = bins

        if (filter !== "all") {
            result = result.filter(bin =>
                bin.acceptedItems.some(item => item.toLowerCase().includes(filter))
            )
        }

        if (searchQuery) {
            result = result.filter(bin =>
                bin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (bin.address && bin.address.toLowerCase().includes(searchQuery.toLowerCase()))
            )
        }
        setFilteredBins(result)
    }, [filter, searchQuery, bins])


    const handleNavigate = useCallback(async (lat: number, lng: number, shouldExpand = true) => {
        const bin = bins.find(b => b.latitude === lat && b.longitude === lng)
        if (!bin) return

        // Activate destination for verification system
        const success = await verification.activateDestination(
            bin._id,
            bin.name,
            lat,
            lng,
            bin.address // Pass address for banner display
        )

        if (success) {
            setDestination({ lat, lng })
            if (shouldExpand) {
                setIsMapExpanded(true) // Expand map on navigation only if requested
            }
            toast.success("🧭 Navigation started! Stay within 50m to verify your drop.")
        }
    }, [bins, verification])

    // Auto-navigate to nearest bin
    useEffect(() => {
        if (bins.length > 0 && loc.latitude && !hasAutoSelected.current) {
            let minDist = Infinity
            let nearest: ClientBin | null = null

            for (const bin of bins) {
                if (typeof bin.latitude === 'number' && typeof bin.longitude === 'number') {
                    const d = calculateDistance(loc.latitude, loc.longitude, bin.latitude, bin.longitude)
                    if (d < minDist) {
                        minDist = d
                        nearest = bin
                    }
                }
            }

            if (nearest) {
                console.log("Auto-navigating to nearest bin:", nearest.name)
                // @ts-ignore
                handleNavigate(nearest.latitude, nearest.longitude, false)
                hasAutoSelected.current = true
            }
        }
    }, [bins, loc, handleNavigate])

    const handleDropoff = (bin: ClientBin) => {
        setDropoffBin(bin)
        setShowDropoffModal(true)
    }

    const handleDropoffSuccess = (pointsEarned: number) => {
        toast.success(`🎉 Drop-off verified! You earned ${pointsEarned} points!`)
        setShowDropoffModal(false)
        setDropoffBin(null)
    }

    const handleVoiceSearch = () => {
        setIsListening(!isListening)
        toast.info("Voice search feature coming soon!")
    }

    const handleBinSelect = (bin: ClientBin) => {
        setSelectedBinId(bin._id)
        setDropoffBin(bin)
    }

    const handleCitySearch = async (searchCity: string) => {
        if (!searchCity.trim()) {
            await fetchBinsForCity("Prayagraj")
            return
        }
        await fetchBinsForCity(searchCity.trim())
    }

    const handleNotifyMe = async (email?: string) => {
        try {
            const res = await fetch("/api/city-requests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    city,
                    email
                })
            })

            if (!res.ok) {
                throw new Error("Failed to submit request")
            }

            return Promise.resolve()
        } catch (error) {
            console.error("Failed to submit notification request:", error)
            throw error
        }
    }

    const filters = [
        { id: "all", label: t("filter_all") },
        { id: "smartphone", label: t("filter_phones") },
        { id: "battery", label: t("filter_batteries") },
        { id: "laptop", label: t("filter_laptops") },
        { id: "plastic_bottle", label: t("filter_bottles") },
    ]

    if (!isCitySupported) {
        return (
            <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-background relative">
                <ComingSoon city={city} onNotifyMe={handleNotifyMe} />
            </div>
        )
    }

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-background relative">
            {/* 1. Map Section (Top Card) */}
            <div className={`w-full shrink-0 relative z-0 transition-all duration-500 ease-in-out ${isMapExpanded ? "h-full" : "h-[55vh] px-4 pt-4"}`}>
                <div className={`w-full h-full overflow-hidden shadow-2xl relative transition-all duration-500 ${isMapExpanded ? "rounded-none" : "rounded-[2rem] ring-1 ring-black/5 dark:ring-white/10"}`}>
                    <BinMap
                        bins={filteredBins}
                        userLocation={loc}
                        usingDefaultLocation={loc.usingDefault}
                        onBinSelect={handleBinSelect}
                        onNavigate={handleNavigate}
                        selectedBinId={selectedBinId}
                        destination={destination}
                    />

                    {/* Back Button (Only when expanded) */}
                    {isMapExpanded && (
                        <button
                            onClick={() => setIsMapExpanded(false)}
                            className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-black/90 backdrop-blur-md p-3 rounded-full shadow-lg border border-border/50 text-foreground hover:scale-105 active:scale-95 transition-all"
                        >
                            <span className="sr-only">Back to list</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        </button>
                    )}
                </div>
            </div>

            {/* 2. Content Section (Bottom) - Scrollable */}
            <div className={`flex-1 flex flex-col overflow-hidden bg-background shadow-[0_-5px_20px_rgba(0,0,0,0.2)] relative z-10 border-t border-white/5 transition-all duration-500 ease-in-out ${isMapExpanded ? "translate-y-full opacity-0" : "rounded-t-[2.5rem] -mt-6 translate-y-0 opacity-100"}`}>
                {/* Drag Handle (Visual only) */}
                <div className="w-full flex justify-center pt-3 pb-1">
                    <div className="w-12 h-1.5 bg-muted rounded-full" />
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-20">
                    {/* Header Controls (Search & Filter) */}
                    <div className="space-y-4 mb-4">
                        {/* Current City Indicator */}
                        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-900">
                                    {isCitySupported ? `Showing bins in ${city}` : city}
                                </span>
                            </div>
                            {!isCitySupported && (
                                <button
                                    onClick={() => fetchBinsForCity("Prayagraj")}
                                    className="text-xs text-green-600 hover:text-green-700 underline"
                                >
                                    Switch to Prayagraj
                                </button>
                            )}
                        </div>

                        {/* Active Drop Flow Banner */}
                        {isDropFlow && (
                            <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
                                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                                    {(typeof window !== 'undefined' && sessionStorage.getItem("ai_confidence")
                                        ? Math.round(parseFloat(sessionStorage.getItem("ai_confidence")!) * 100)
                                        : "?")}
                                    <span className="text-[10px]">%</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm text-primary-900 dark:text-primary-100">
                                        Found similar bins for: <span className="capitalize">{typeof window !== 'undefined' ? sessionStorage.getItem("scanned_item_type") || "Item" : "Item"}</span>
                                    </h3>
                                    <p className="text-xs text-muted-foreground">Navigate to a bin to complete your drop.</p>
                                </div>
                            </div>
                        )}

                        {/* Search Bar */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={t("search_bins_placeholder")}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleCitySearch(searchQuery)
                                    }
                                }}
                                className="w-full bg-secondary/50 border border-border/50 rounded-xl pl-9 pr-10 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/70"
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">🔍</span>

                            <button
                                onClick={handleVoiceSearch}
                                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-muted-foreground hover:bg-white hover:shadow-sm'}`}
                            >
                                <span className="text-lg">🎙️</span>
                            </button>
                        </div>

                        {/* Filter Chips */}
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
                            <button
                                onClick={() => setFilter("all")}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${filter === "all"
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background border-border text-muted-foreground hover:bg-secondary"
                                    }`}
                            >
                                {t("filter_all")}
                            </button>
                            {filters.filter(f => f.id !== "all").map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => {
                                        if (isCitySupported) {
                                            setFilter(f.id)
                                        } else {
                                            toast.info("Available once EcoDrop launches in this city")
                                        }
                                    }}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${!isCitySupported
                                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                            : filter === f.id
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "bg-background border-border text-muted-foreground hover:bg-secondary"
                                        }`}
                                    title={!isCitySupported ? "Available once EcoDrop launches in this city" : undefined}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bin List */}
                    <div className="pb-4">
                        <BinList
                            bins={filteredBins}
                            userLocation={loc}
                            usingDefaultLocation={loc.usingDefault}
                            onBinSelect={handleBinSelect}
                            onNavigate={handleNavigate}
                            onDropoff={handleDropoff}
                            selectedBinId={selectedBinId}
                        />
                    </div>
                </div>
            </div>

            {/* Drop-off Confirmation Modal */}
            {
                showDropoffModal && dropoffBin && (
                    <DropoffConfirmationModal
                        binId={dropoffBin._id}
                        binName={dropoffBin.name}
                        binAddress={dropoffBin.address || "N/A"}
                        acceptedItems={dropoffBin.acceptedItems}
                        isOpen={showDropoffModal}
                        onClose={() => setShowDropoffModal(false)}
                        onSuccess={handleDropoffSuccess}
                    />
                )
            }

            {/* EW Drop Verification Banner */}
            <VerificationBanner
                activeDestination={verification.destination}
                onCancel={verification.cancelVerification}
                onVerificationComplete={(data) => {
                    verification.confirmDrop(data.binId, data.location, data.timeSpent)
                }}
                onTrackingError={verification.handleTrackingError}
            />

            {/* Verification Success Modal */}
            {
                showSuccessModal && successData && (
                    <VerificationSuccessModal
                        isOpen={showSuccessModal}
                        onClose={() => setShowSuccessModal(false)}
                        data={successData}
                    />
                )
            }
        </div >
    )
}
