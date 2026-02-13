
"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Lightbulb, Trophy, MapPin, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface DailyTipProps {
    className?: string
}

export function DailyTip({ className }: DailyTipProps) {
    const [tip, setTip] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchTip() {
            try {
                const res = await fetch("/api/notifications/daily")
                const data = await res.json()
                if (data.success) {
                    setTip(data.data)
                }
            } catch (error) {
                console.error("Failed to fetch daily tip", error)
            } finally {
                setLoading(false)
            }
        }
        fetchTip()
    }, [])

    if (loading) return <Skeleton className="w-full h-20 sm:h-24 rounded-lg sm:rounded-2xl" />
    if (!tip) return null

    const getIcon = (cat: string) => {
        switch (cat) {
            case "awareness": return <Lightbulb className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-600" />
            case "action": return <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
            case "local": return <MapPin className="w-4 sm:w-5 h-4 sm:h-5 text-green-600" />
            case "gamification": return <Trophy className="w-4 sm:w-5 h-4 sm:h-5 text-purple-600" />
            default: return <Lightbulb className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-600" />
        }
    }

    const getBgColor = (cat: string) => {
        switch (cat) {
            case "awareness": return "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-100 dark:border-yellow-900"
            case "action": return "bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900"
            case "local": return "bg-green-50 dark:bg-green-950/30 border-green-100 dark:border-green-900"
            case "gamification": return "bg-purple-50 dark:bg-purple-950/30 border-purple-100 dark:border-purple-900"
            default: return "bg-secondary/30 border-border"
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={className}
        >
            <Card className={`border shadow-sm ${getBgColor(tip.category)}`}>
                <CardContent className="p-3 sm:p-4 flex gap-2 sm:gap-4 items-start">
                    <div className="p-1.5 sm:p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm shrink-0 mt-0.5 sm:mt-0">
                        {getIcon(tip.category)}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-xs sm:text-sm mb-0.5 sm:mb-1 line-clamp-2">{tip.title}</h3>
                        <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed line-clamp-3">
                            {tip.message}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
