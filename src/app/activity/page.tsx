"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Smartphone, Recycle, Battery, ShoppingBag, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/context/auth-context"
import { MotionWrapper } from "@/components/ui/motion-wrapper"

interface Transaction {
    _id: string
    binId?: { name: string }
    type: "scan" | "recycle" | "sell"
    itemName?: string
    itemType: string
    pointsEarned: number
    status: string
    createdAt: string
}

export default function ActivityPage() {
    const router = useRouter()
    const { user } = useAuth()
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchHistory() {
            if (!user) return

            try {
                // Fetch up to 50 recent items
                const res = await fetch(`/api/transactions?userId=${user._id}&limit=50`)
                const data = await res.json()
                if (data.success) {
                    setTransactions(data.data)
                }
            } catch (error) {
                console.error("Failed to load activity", error)
            } finally {
                setLoading(false)
            }
        }
        fetchHistory()
    }, [user])

    const getIcon = (type: string) => {
        if (type.includes("phone") || type.includes("smartphone")) return <Smartphone className="w-5 h-5 text-blue-500" />
        if (type.includes("battery")) return <Battery className="w-5 h-5 text-red-500" />
        return <Recycle className="w-5 h-5 text-green-500" />
    }

    const formatTitle = (t: Transaction) => {
        if (t.type === 'scan') return `Scanned ${t.itemName || t.itemType}`
        if (t.type === 'recycle') return `Recycled ${t.itemName || t.itemType}`
        return t.itemName || "Activity"
    }

    return (
        <div className="flex flex-col gap-4 sm:gap-5 md:gap-4 lg:gap-5 pb-4 sm:pb-6 md:pb-4 lg:pb-6 min-h-screen bg-background">
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md pt-4 pb-2 border-b">
                <div className="flex items-center gap-3 container max-w-2xl mx-auto px-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-xl font-bold">Your Activity</h1>
                </div>
            </div>

            <main className="container max-w-2xl mx-auto px-4 space-y-4">
                {loading ? (
                    Array(5).fill(0).map((_, i) => (
                        <Card key={i} className="border-border/50">
                            <CardContent className="p-4 flex items-center gap-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : transactions.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h2 className="text-lg font-semibold">No activity yet</h2>
                        <p className="text-muted-foreground mt-2">Start scanning and recycling to track your impact!</p>
                        <Button className="mt-6" onClick={() => router.push('/scan')}>Start Recycling</Button>
                    </div>
                ) : (
                    transactions.map((t, index) => (
                        <MotionWrapper key={t._id} delay={index * 0.05} variant="slideUp">
                            <Card className="border-border/60 hover:border-primary/50 transition-colors">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 rounded-full ${t.type === 'scan' ? 'bg-blue-50' : 'bg-green-50'
                                            }`}>
                                            {getIcon(t.itemType)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-sm sm:text-base capitalize">
                                                {formatTitle(t)}
                                            </h3>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                                <span>{new Date(t.createdAt).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}</span>
                                                {t.binId && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{t.binId.name}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`font-bold ${t.pointsEarned > 0 ? 'text-green-600' : 'text-gray-500'
                                            }`}>
                                            +{t.pointsEarned} pts
                                        </span>
                                        <div className={`text-[10px] uppercase font-medium mt-1 ${t.status === 'approved' ? 'text-green-500' :
                                            t.status === 'pending' ? 'text-amber-500' : 'text-red-500'
                                            }`}>
                                            {t.status}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </MotionWrapper>
                    ))
                )}
            </main>
        </div>
    )
}
