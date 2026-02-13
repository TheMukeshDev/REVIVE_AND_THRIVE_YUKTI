import { Leaf } from "lucide-react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/logo"

interface StatsCardProps {
    points: number
    weeklyPoints: number
    totalItems: number
    co2Saved: number
    className?: string
}

export function StatsCard({ points, weeklyPoints, totalItems, co2Saved, className }: StatsCardProps) {
    return (
        <div className={cn("relative overflow-hidden rounded-2xl sm:rounded-3xl bg-black p-4 sm:p-6 text-white shadow-2xl shadow-primary/20", className)}>
            {/* Abstract Background Blobs */}
            <div className="absolute top-0 right-0 -mt-8 sm:-mt-10 -mr-8 sm:-mr-10 h-32 sm:h-40 w-32 sm:w-40 rounded-full bg-primary/30 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-8 sm:-mb-10 -ml-8 sm:-ml-10 h-32 sm:h-40 w-32 sm:w-40 rounded-full bg-blue-500/30 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-3 sm:gap-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-white/70">Total Impact</span>
                    <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden shrink-0">
                        <Logo className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                </div>

                {/* Main Stat */}
                <div className="flex flex-col">
                    <span className="text-3xl sm:text-4xl font-bold tracking-tight">{points?.toLocaleString() || 0}</span>
                    <span className="text-xs sm:text-sm text-primary font-medium">+{weeklyPoints?.toLocaleString() || 0} this week</span>
                </div>

                {/* Badges / Pills */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1 sm:mt-2">
                    <div className="flex items-center justify-center px-3 sm:px-4 py-1.5 rounded-full bg-white/10 text-xs font-medium backdrop-blur-md border border-white/10 whitespace-nowrap min-w-fit">
                        {totalItems} Items
                    </div>
                    <div className="flex items-center justify-center px-3 sm:px-4 py-1.5 rounded-full bg-white/10 text-xs font-medium backdrop-blur-md border border-white/10 whitespace-nowrap min-w-fit">
                        {co2Saved}kg CO₂
                    </div>
                </div>
            </div>
        </div>
    )
}
