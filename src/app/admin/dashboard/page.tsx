"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CheckCircle2, AlertTriangle, ScanLine, Leaf, Clock } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch("/api/admin/stats")
                const data = await res.json()
                if (data.success) {
                    setStats(data.stats)
                }
            } catch (error) {
                console.error("Failed to load stats")
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    const statCards = [
        {
            title: "Total Users",
            value: stats?.totalUsers || 0,
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            darkBg: "dark:bg-blue-950/30"
        },
        {
            title: "Verified Drops",
            value: stats?.verifiedDrops || 0,
            icon: CheckCircle2,
            color: "text-green-500",
            bg: "bg-green-500/10",
            darkBg: "dark:bg-green-950/30"
        },
        {
            title: "Pending Drops",
            value: stats?.pendingDrops || 0,
            icon: Clock,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            darkBg: "dark:bg-amber-950/30"
        },
        {
            title: "Scan Attempts",
            value: stats?.totalScans || 0,
            icon: ScanLine,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            darkBg: "dark:bg-purple-950/30"
        },
        {
            title: "Suspicious Users",
            value: stats?.suspiciousUsers || 0,
            icon: AlertTriangle,
            color: "text-red-500",
            bg: "bg-red-500/10",
            darkBg: "dark:bg-red-950/30"
        },
        {
            title: "CO₂ Saved (kg)",
            value: stats?.totalCO2?.toFixed(1) || 0,
            icon: Leaf,
            color: "text-emerald-600",
            bg: "bg-emerald-600/10",
            darkBg: "dark:bg-emerald-950/30"
        }
    ]

    if (loading) {
        return (
            <div className="space-y-6 md:space-y-8 lg:space-y-10 w-full">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-2 md:mt-3">Loading system statistics...</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6 w-full">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="animate-pulse w-full">
                            <CardContent className="p-4 sm:p-5 md:p-6">
                                <Skeleton className="h-3 sm:h-4 w-1/2 mb-4 sm:mb-5" />
                                <Skeleton className="h-8 sm:h-10 w-1/3" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 md:space-y-8 lg:space-y-10 w-full">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">Dashboard Overview</h1>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-2 md:mt-3">Monitor system performance and user activity</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6 w-full">
                {statCards.map((stat, i) => {
                    const Icon = stat.icon
                    return (
                        <Card key={i} className="border-border/50 hover:border-border/80 hover:shadow-md transition-all duration-200 w-full">
                            <CardHeader className="flex flex-row items-start sm:items-center justify-between space-y-0 pb-2 sm:pb-3 md:pb-4">
                                <CardTitle className="text-xs sm:text-sm md:text-base font-semibold text-muted-foreground uppercase tracking-wider line-clamp-2">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl shrink-0 ${stat.bg} ${stat.darkBg}`}>
                                    <Icon className={`h-4 sm:h-5 md:h-6 w-4 sm:w-5 md:w-6 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-5 md:p-6 pt-0">
                                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">{stat.value}</div>
                                <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2 md:mt-3">Updated just now</p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6 w-full">
                <Card className="border-dashed bg-card/50 border-border/30 w-full">
                    <CardHeader className="pb-2 sm:pb-3 md:pb-4">
                        <CardTitle className="text-sm sm:text-base md:text-lg">Activity Trends</CardTitle>
                    </CardHeader>
                    <CardContent className="h-48 sm:h-56 md:h-64 lg:h-80 flex items-center justify-center text-center">
                        <p className="text-xs sm:text-sm md:text-base text-muted-foreground">📊 Activity Chart (Coming Soon)</p>
                    </CardContent>
                </Card>
                <Card className="border-dashed bg-card/50 border-border/30 w-full">
                    <CardHeader className="pb-2 sm:pb-3 md:pb-4">
                        <CardTitle className="text-sm sm:text-base md:text-lg">Bin Locations</CardTitle>
                    </CardHeader>
                    <CardContent className="h-48 sm:h-56 md:h-64 lg:h-80 flex items-center justify-center text-center">
                        <p className="text-xs sm:text-sm md:text-base text-muted-foreground">🗺️ Drop Locations Map (Coming Soon)</p>
                    </CardContent>
                </Card>
            </div>

            {/* Additional Info Section */}
            <Card className="border-border/50 w-full">
                <CardHeader className="border-b border-border/50">
                    <CardTitle className="text-sm sm:text-base md:text-lg">System Information</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 md:p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                        <div>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-1">Last Updated</p>
                            <p className="text-sm sm:text-base md:text-lg font-semibold">{new Date().toLocaleTimeString()}</p>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-1">System Status</p>
                            <p className="text-sm sm:text-base md:text-lg font-semibold text-green-600 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-600" />
                                Operational
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
