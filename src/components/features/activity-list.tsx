"use client"

import Link from "next/link"
import { Smartphone, Recycle, Battery, ArrowRight } from "lucide-react"
import { ActivityItem } from "./activity-item"
import { MotionWrapper } from "@/components/ui/motion-wrapper"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useTranslation } from "@/context/language-context"

interface Transaction {
    _id: string
    binId: { name: string } | null
    type?: "scan" | "recycle" | "sell"
    itemName?: string
    itemType: string
    pointsEarned: number
    createdAt: string
}

interface ActivityListProps {
    transactions?: Transaction[]
    loading?: boolean
}

export function ActivityList({ transactions = [], loading = false }: ActivityListProps) {
    const { t } = useTranslation()

    if (loading) {
        return <div className="space-y-3 sm:space-y-4 w-full">
            <div className="flex justify-between items-center">
                <Skeleton className="h-5 sm:h-6 w-32" />
                <Skeleton className="h-3 sm:h-4 w-16" />
            </div>
            <div className="space-y-2 sm:space-y-3">
                <Skeleton className="h-14 sm:h-16 w-full rounded-xl sm:rounded-2xl" />
                <Skeleton className="h-14 sm:h-16 w-full rounded-xl sm:rounded-2xl" />
                <Skeleton className="h-14 sm:h-16 w-full rounded-xl sm:rounded-2xl" />
            </div>
        </div>
    }

    return (
        <div className="w-full space-y-3 sm:space-y-4">
            <MotionWrapper delay={0.2} className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-semibold tracking-tight">{t("recent_activity")}</h2>
                <Button variant="link" size="sm" asChild className="px-0 text-xs sm:text-sm text-muted-foreground hover:text-primary">
                    <Link href="/activity">
                        {t("view_all")} <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                </Button>
            </MotionWrapper>

            <div className="space-y-2 sm:space-y-2.5">
                {transactions.length === 0 ? (
                    <div className="text-center py-6 sm:py-8 text-xs sm:text-sm text-muted-foreground bg-secondary/30 rounded-xl sm:rounded-2xl border border-dashed border-border">
                        {t("no_activity")}
                    </div>
                ) : (
                    transactions.map((tx, index) => (
                        <MotionWrapper key={tx._id} delay={0.3 + index * 0.1}>
                            <ActivityItem
                                title={tx.itemName ? `${tx.type === 'scan' ? 'Scanned' : 'Recycled'} ${tx.itemName}` : `Recycled ${formatItemType(tx.itemType)}`}
                                time={new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                points={tx.pointsEarned}
                                icon={getIcon(tx.itemType)}
                            />
                        </MotionWrapper>
                    ))
                )}
            </div>
        </div>
    )
}

function formatItemType(type: string) {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

function getIcon(type: string) {
    if (type.includes("phone") || type.includes("smartphone")) return Smartphone
    if (type.includes("battery")) return Battery
    return Recycle
}
