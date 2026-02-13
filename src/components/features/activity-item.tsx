"use client"

import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { motionItem } from "@/components/ui/motion-wrapper"

interface ActivityItemProps {
    title: string
    time: string
    points: number
    icon: LucideIcon
}

export function ActivityItem({ title, time, points, icon: Icon }: ActivityItemProps) {
    return (
        <motion.div
            className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm cursor-pointer hover:bg-card/80 transition-colors w-full"
            variants={motionItem}
            whileHover="hover"
            whileTap="tap"
        >
            <div className="flex items-center gap-2 sm:gap-3 overflow-hidden flex-1 min-w-0">
                <div className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs sm:text-sm font-medium text-foreground truncate">{title}</span>
                    <span className="text-[11px] sm:text-xs text-muted-foreground">{time}</span>
                </div>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-primary whitespace-nowrap ml-2 flex-shrink-0">
                +{points}
            </div>
        </motion.div>
    )
}
