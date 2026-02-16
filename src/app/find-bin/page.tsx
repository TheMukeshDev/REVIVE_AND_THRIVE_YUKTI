"use client"

import { useState, useEffect, useCallback, useRef, Suspense } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useUserLocation } from "@/hooks/use-user-location"
import { useEWDropVerification } from "@/hooks/use-ew-drop-verification"
import { detectCityFromCoordinates } from "@/lib/city-detection"
import { BinList } from "@/components/features/bin-list"
import { ComingSoon } from "@/components/features/coming-soon"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Search, Mic } from "lucide-react"
import { IBin } from "@/models/Bin"
import { toast } from "sonner"
import { useTranslation } from "@/context/language-context"
import { useSearchParams, useRouter as useNextRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

// Dynamic imports - heavy components loaded only when needed (Google Maps, modals)
const BinMap = dynamic(() => import("@/components/features/bin-map").then(mod => ({ default: mod.BinMap })), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-secondary/30 animate-pulse rounded-2xl flex items-center justify-center"><MapPin className="w-8 h-8 text-muted-foreground/40" /></div>
})
const DropoffConfirmationModal = dynamic(() => import("@/components/features/dropoff-confirmation-modal").then(mod => ({ default: mod.DropoffConfirmationModal })), { ssr: false })
const VerificationBanner = dynamic(() => import("@/components/features/verification-banner").then(mod => ({ default: mod.VerificationBanner })), { ssr: false })
const VerificationSuccessModal = dynamic(() => import("@/components/features/verification-success-modal").then(mod => ({ default: mod.VerificationSuccessModal })), { ssr: false })

// Fix for type mismatch between Mongoose Document and Client JSON
type ClientBin = Omit<IBin, "_id"> & { _id: string }

function FindBinPageContent() {
    const { t } = useTranslation()
    const searchParams = useSearchParams()
    const nextRouter = useNextRouter()
    const router = useRouter()
    const { user, updateUser } = useAuth()

    // Check authentication
    useEffect(() => {
        if (!user) {
            nextRouter.push("/auth/login?redirect=/find-bin")
        }
    }, [user, nextRouter])

    // SAFE HYDRATION: Initialize only with Search Params (Server Safe)
    const [isDropFlow, setIsDropFlow] = useState(searchParams.get("dropFlow") === "true")

    // Client-only state for AI results
    const [aiConfidence, setAiConfidence] = useState<number | null>(null)
    const [scannedItemType, setScannedItemType] = useState<string | null>(null)
    const [currentTransactionId, setCurrentTransactionId] = useState<string | null>(null)

    // Location Hook
    const { latitude, longitude, error: locationError, loading: locationLoading, usingDefault, retryLocation } = useUserLocation()
    const userLocationObj = { latitude, longitude }

    const [bins, setBins] = useState<ClientBin[]>([])
    const [filteredBins, setFilteredBins] = useState<ClientBin[]>([])
    const [loadingBins, setLoadingBins] = useState(true)
    const [selectedBinId, setSelectedBinId] = useState<string | null>(null)
    const [filter, setFilter] = useState("all")
    const [destination, setDestination] = useState<{ lat: number, lng: number } | null>(null)

    // Modals
    const [dropoffBin, setDropoffBin] = useState<ClientBin | null>(null)
    const [showDropoffModal, setShowDropoffModal] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [successData, setSuccessData] = useState<any>(null)

    const [searchQuery, setSearchQuery] = useState("")
    const [city, setCity] = useState("Prayagraj")
    const [isCitySupported, setIsCitySupported] = useState(true)
    const [isListening, setIsListening] = useState(false)

    // Helper: save transaction to localStorage for home page
    const saveLocalTransaction = useCallback((pointsEarned: number, co2Saved: number, binName: string) => {
        if (typeof window === 'undefined') return
        try {
            const existing = JSON.parse(localStorage.getItem('eco_transactions') || '[]')
            const tx = {
                _id: `local_${Date.now()}`,
                type: 'recycle',
                itemType: sessionStorage.getItem('scanned_item_type') || 'e-waste',
                pointsEarned,
                status: 'approved',
                createdAt: new Date().toISOString(),
                binName,
                co2Saved
            }
            existing.unshift(tx)
            localStorage.setItem('eco_transactions', JSON.stringify(existing.slice(0, 50)))
        } catch (e) {
            console.error('Failed to save local transaction', e)
        }
    }, [])

    // Verification Hook
    const onVerificationSuccess = useCallback((data: { pointsEarned: number, co2Saved: number, binName: string }) => {
        setSuccessData(data)
        setShowSuccessModal(true)

        // Persist earned points to auth context + localStorage
        if (user) {
            updateUser({
                points: (user.points || 0) + data.pointsEarned,
                totalItemsRecycled: (user.totalItemsRecycled || 0) + 1,
                totalCO2Saved: (user.totalCO2Saved || 0) + data.co2Saved
            })
        }
        saveLocalTransaction(data.pointsEarned, data.co2Saved, data.binName)

        // Clear flow
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem("drop_flow_active")
            sessionStorage.removeItem("scanned_item_type")
            sessionStorage.removeItem("ai_confidence")
        }
        setIsDropFlow(false)
    }, [user, updateUser, saveLocalTransaction])

    const onVerificationError = useCallback((error: string) => {
        toast.error(error)
    }, [])

    const {
        isVerifying,
        destination: activeDestination,
        activateDestination,
        cancelVerification,
        hasActiveVerification,
        confirmDrop
    } = useEWDropVerification({
        onVerificationSuccess,
        onVerificationError
    })

    const handleBannerVerificationComplete = useCallback((data: {
        binId: string
        location: { latitude: number; longitude: number }
        timeSpent: number
    }) => {
        confirmDrop(data.binId, data.location, data.timeSpent)
    }, [confirmDrop])

    // Hydration Fix
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedConfidence = sessionStorage.getItem("ai_confidence")
            const storedItem = sessionStorage.getItem("scanned_item_type")
            const sessionActive = sessionStorage.getItem("drop_flow_active") === "true"
            const storedTxId = sessionStorage.getItem("pending_transaction_id")

            if (storedConfidence) setAiConfidence(parseFloat(storedConfidence))
            if (storedItem) setScannedItemType(storedItem)
            if (storedTxId) setCurrentTransactionId(storedTxId)

            if (sessionActive && !isDropFlow) {
                setIsDropFlow(true)
            }
        }
    }, [])

    // Fetch Bins
    useEffect(() => {
        async function fetchBins() {
            setLoadingBins(true)
            try {
                const detectedCity = latitude ? await detectCityFromCoordinates(latitude, longitude) : "Prayagraj"
                setCity(detectedCity)

                const res = await fetch(`/api/bins?city=${encodeURIComponent(detectedCity)}`)
                const data = await res.json()

                if (data.supported) {
                    setBins(data.bins)
                    setFilteredBins(data.bins)
                    setIsCitySupported(true)
                } else {
                    setBins([])
                    setIsCitySupported(false)
                }
            } catch (error) {
                console.error("Failed to fetch bins:", error)
                toast.error("Could not load bins")
            } finally {
                setLoadingBins(false)
            }
        }

        if ((latitude && longitude) || locationError || loadingBins) {
            fetchBins()
        }
    }, [latitude, longitude, locationError])

    // Filter Logic
    useEffect(() => {
        let result = bins

        if (filter !== "all") {
            result = result.filter(bin =>
                bin.acceptedItems.includes("all") ||
                bin.acceptedItems.includes(filter)
            )
        }

        if (searchQuery) {
            const lowerQ = searchQuery.toLowerCase()
            result = result.filter(bin =>
                bin.name.toLowerCase().includes(lowerQ) ||
                bin.address.toLowerCase().includes(lowerQ)
            )
        }

        setFilteredBins(result)
    }, [filter, searchQuery, bins])


    const handleNavigate = (bin: ClientBin) => {
        setDestination({ lat: bin.latitude, lng: bin.longitude })
        setSelectedBinId(bin._id)
        toast.info(`Navigating to ${bin.name}`)

        if (!hasActiveVerification) {
            activateDestination(bin._id, bin.name, bin.latitude, bin.longitude, bin.address)
        }
    }

    const handleDropoffClick = (bin: ClientBin) => {
        setDropoffBin(bin)
        setShowDropoffModal(true)
    }

    const handleDropConfirmationSuccess = (points: number) => {
        const binName = dropoffBin?.name || "Bin"
        const co2Saved = 2.5
        setShowSuccessModal(true)
        setSuccessData({ pointsEarned: points, co2Saved, binName })
        setShowDropoffModal(false)
        setDropoffBin(null)

        // Persist earned points to auth context + localStorage
        if (user) {
            updateUser({
                points: (user.points || 0) + points,
                totalItemsRecycled: (user.totalItemsRecycled || 0) + 1,
                totalCO2Saved: (user.totalCO2Saved || 0) + co2Saved
            })
        }
        saveLocalTransaction(points, co2Saved, binName)
    }

    const toggleListening = () => {
        setIsListening(!isListening)
        if (!isListening) {
            toast("Listening...", { icon: "🎙️" })
            setTimeout(() => {
                setIsListening(false)
                setSearchQuery("battery")
                toast.success("Found 'battery'")
            }, 2000)
        }
    }

    if (!isCitySupported) {
        return <ComingSoon city={city} onNotifyMe={() => toast.success("We'll notify you!")} />
    }

    return (
        <div className="flex flex-col gap-4">

            {/* Header / Search Section */}
            <div className="space-y-4">
                <h1 className="text-2xl font-bold tracking-tight">{t("find_bin") || "Find Bin"}</h1>

                {/* Search Bar */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search bins..."
                        className="w-full bg-secondary/50 border-none rounded-xl px-4 py-3 pl-10 focus:ring-2 focus:ring-primary/50 text-sm h-12 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                    <button onClick={toggleListening} className="absolute right-3 top-3 text-muted-foreground hover:text-primary">
                        <Mic className={`w-5 h-5 ${isListening ? 'text-red-500 animate-pulse' : ''}`} />
                    </button>
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {["all", "smartphone", "battery", "laptop", "glass", "plastic"].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${filter === cat
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : "bg-card border border-border/50 text-foreground hover:bg-secondary"
                                }`}
                        >
                            <span className="capitalize">{cat}</span>
                        </button>
                    ))}
                </div>

                {city !== "Prayagraj" && (
                    <button
                        onClick={() => { setCity("Prayagraj"); window.location.reload() }}
                        className="text-xs text-primary underline w-full text-center"
                    >
                        Switch to Prayagraj
                    </button>
                )}
            </div>

            {/* Map Section - Integrated elegantly */}
            <div className="w-full rounded-2xl overflow-hidden shadow-sm border border-border/50 relative z-0 mt-2 h-64 sm:h-80 md:h-96 lg:h-96">
                {loadingBins ? (
                    <Skeleton className="w-full h-full" />
                ) : (
                    <BinMap
                        bins={filteredBins}
                        userLocation={userLocationObj}
                        usingDefaultLocation={usingDefault}
                        destination={destination}
                        onBinSelect={(bin) => {
                            if (bin) handleNavigate(bin as ClientBin)
                        }}
                    />
                )}
            </div>

            {/* Active Drop Banner */}
            {isDropFlow && (
                <div className="p-4 sm:p-5 bg-linear-to-r from-primary/15 to-transparent border-l-4 border-primary rounded-lg flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 shadow-md">
                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-base shrink-0 shadow-md">
                        {aiConfidence ? Math.round(aiConfidence * 100) : "..."}
                        <span className="text-[9px]">%</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm sm:text-base text-foreground">
                            <span className="capitalize">{scannedItemType || "Item"}</span> Detected
                        </h3>
                        {currentTransactionId && (
                            <div className="mt-1.5 bg-white/50 dark:bg-black/30 px-2.5 py-1.5 rounded border border-primary/30 inline-block">
                                <p className="text-xs text-primary font-mono font-semibold">
                                    TXN ID: {currentTransactionId}
                                </p>
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1.5">Nearest bins shown below</p>
                    </div>
                </div>
            )}

            {/* Bins List */}
            <div className="space-y-4">
                <h2 className="font-semibold text-lg">Nearby Bins</h2>

                {loadingBins ? (
                    [1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)
                ) : filteredBins.length > 0 ? (
                    <BinList
                        bins={filteredBins}
                        userLocation={userLocationObj}
                        usingDefaultLocation={usingDefault}
                        selectedBinId={selectedBinId}
                        onBinSelect={handleNavigate}
                        onNavigate={(lat, lng) => handleNavigate(filteredBins.find(b => b.latitude === lat) as ClientBin)}
                        onDropoff={handleDropoffClick}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-secondary/20 rounded-2xl border border-dashed border-border">
                        <MapPin className="w-10 h-10 mb-2 opacity-20" />
                        <p>No bins found in this area.</p>
                        <Button onClick={() => setFilter("all")} variant="link" className="mt-1">view all bins</Button>
                    </div>
                )}
            </div>

            {/* Modals and Overlays */}
            <VerificationBanner
                activeDestination={activeDestination}
                onVerificationComplete={handleBannerVerificationComplete}
                onTrackingError={onVerificationError}
                onCancel={cancelVerification}
            />

            {dropoffBin && (
                <DropoffConfirmationModal
                    isOpen={showDropoffModal}
                    onClose={() => setShowDropoffModal(false)}
                    onSuccess={handleDropConfirmationSuccess}
                    binId={dropoffBin._id}
                    binName={dropoffBin.name}
                    binAddress={dropoffBin.address}
                    acceptedItems={dropoffBin.acceptedItems}
                />
            )}

            <VerificationSuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                data={successData || { pointsEarned: 50, co2Saved: 2.5, binName: "Bin" }}
            />
        </div>
    )
}

export default function FindBinPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Skeleton className="w-full h-full" /></div>}>
            <FindBinPageContent />
        </Suspense>
    )
}
