"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Gift, TrendingUp, ShieldCheck, Loader2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"
// Removed toast import as it is missing

interface IReward {
    _id: string
    title: string
    pointsRequired: number
    description: string
    image: string
    available: boolean
}

export default function RewardsPage() {
    const router = useRouter()
    const { user, updateUser } = useAuth() // Use updateUser instead of setUser
    const [rewards, setRewards] = useState<IReward[]>([])
    const [loading, setLoading] = useState(true)
    const [redeeming, setRedeeming] = useState<string | null>(null)
    const [leaderboard, setLeaderboard] = useState<any[]>([])
    const [view, setView] = useState<"rewards" | "leaderboard">("rewards")

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!user) {
            router.push("/auth/login?redirect=/rewards")
            return
        }

        async function fetchRewards() {
            try {
                const res = await fetch("/api/rewards")
                const data = await res.json()
                if (data.success) {
                    setRewards(data.data)
                }
            } catch (error) {
                console.error("Failed to fetch rewards", error)
            } finally {
                setLoading(false)
            }
        }

        async function fetchLeaderboard() {
            try {
                const res = await fetch("/api/leaderboard")
                const data = await res.json()
                if (data.success) {
                    setLeaderboard(data.data)
                }
            } catch (error) {
                console.error("Failed to fetch leaderboard", error)
            }
        }

        fetchRewards()
        fetchLeaderboard()
    }, [])

    const handleRedeem = async (reward: IReward) => {
        if (!user) return
        if (user.points < reward.pointsRequired) {
            alert("Insufficient points!")
            return
        }

        if (!confirm(`Redeem ${reward.title} for ${reward.pointsRequired} points?`)) return

        setRedeeming(reward._id)
        try {
            const res = await fetch("/api/rewards/redeem", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user._id, rewardId: reward._id }),
            })
            const data = await res.json()

            if (data.success) {
                alert(`Successfully redeemed: ${data.data.reward}! 🎉`)
                // Update local user points
                updateUser({ points: data.data.points })
            } else {
                alert(data.error || "Redemption failed")
            }
        } catch (error) {
            console.error("Redemption error", error)
            alert("Failed to redeem. Please try again.")
        } finally {
            setRedeeming(null)
        }
    }

    return (
        <div className="flex flex-col gap-4 sm:gap-5 md:gap-4 lg:gap-5 pb-4 sm:pb-6 md:pb-4 lg:pb-6">
            <h1 className="text-3xl font-bold">Rewards</h1>

            {/* Points Card */}
            <Card className="bg-linear-to-br from-yellow-400 to-orange-500 border-none text-white shadow-lg overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4">
                    <Gift className="w-32 h-32" />
                </div>
                <CardContent className="p-6 relative z-10">
                    <p className="text-white/80 font-medium mb-1">Available Points</p>
                    <h2 className="text-4xl font-bold mb-4">{user?.points?.toLocaleString() || 0}</h2>

                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="secondary"
                            className={`border-0 backdrop-blur-md transition-colors ${view === 'rewards' ? 'bg-white text-orange-600' : 'bg-white/20 text-white hover:bg-white/30'}`}
                            onClick={() => setView('rewards')}
                        >
                            <Gift className="mr-2 h-4 w-4" /> Rewards
                        </Button>
                        <Button
                            size="sm"
                            variant="secondary"
                            className={`border-0 backdrop-blur-md transition-colors ${view === 'leaderboard' ? 'bg-white text-orange-600' : 'bg-white/20 text-white hover:bg-white/30'}`}
                            onClick={() => setView('leaderboard')}
                        >
                            <TrendingUp className="mr-2 h-4 w-4" /> Leaderboard
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Content Switcher */}
            {view === "rewards" ? (
                <>
                    <h2 className="text-xl font-semibold">Redeem Rewards</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {loading ? (
                            <div className="col-span-2 flex justify-center py-8">
                                <Loader2 className="animate-spin text-primary" />
                            </div>
                        ) : rewards.length === 0 ? (
                            <div className="col-span-2 text-center py-8 text-muted-foreground">
                                No rewards available at the moment.
                            </div>
                        ) : (
                            rewards.map((reward) => (
                                <Card key={reward._id} className={`overflow-hidden group hover:shadow-md transition-all ${!reward.available ? 'opacity-60 grayscale' : ''}`}>
                                    <div className="h-24 bg-secondary/30 flex items-center justify-center text-4xl">
                                        {reward.image || "🎁"}
                                    </div>
                                    <CardContent className="p-4">
                                        <h3 className="font-semibold text-sm line-clamp-1" title={reward.title}>{reward.title}</h3>
                                        <p className="text-primary font-bold text-sm mt-1">{reward.pointsRequired} pts</p>
                                        <Button
                                            className="w-full mt-3 h-8 text-xs"
                                            variant={user && user.points >= reward.pointsRequired ? "default" : "outline"}
                                            disabled={!reward.available || (user ? user.points < reward.pointsRequired : true) || redeeming === reward._id}
                                            onClick={() => handleRedeem(reward)}
                                        >
                                            {redeeming === reward._id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Redeem"}
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </>
            ) : (
                <>
                    <h2 className="text-xl font-semibold">Top Recyclers</h2>
                    <Card>
                        <CardContent className="p-0">
                            {leaderboard.map((u, i) => (
                                <div key={u._id} className={`flex items-center justify-between p-4 border-b last:border-0 ${u._id === user?._id ? "bg-yellow-50 text-slate-900" : ""}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${i === 0 ? "bg-yellow-100 text-yellow-700" :
                                            i === 1 ? "bg-zinc-100 text-zinc-700" :
                                                i === 2 ? "bg-orange-100 text-orange-700" : "bg-secondary text-muted-foreground"
                                            }`}>
                                            {i + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{u.name || u.username}</p>
                                            <p className={`text-xs ${u._id === user?._id ? "text-slate-600" : "text-muted-foreground"}`}>{u.totalItemsRecycled} items recycled</p>
                                        </div>
                                    </div>
                                    <div className="font-bold text-primary">{u.points.toLocaleString()} pts</div>
                                </div>
                            ))}
                            {leaderboard.length === 0 && (
                                <div className="p-8 text-center text-muted-foreground">Loading leaderboard...</div>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    )
}
