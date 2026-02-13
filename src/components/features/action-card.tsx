"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ActionCardProps {
    href: string
    icon: ReactNode
    title: string
    subtitle: string
    className?: string
    color?: "primary" | "secondary"
}

export function ActionCard({ href, icon, title, subtitle, className, color = "primary" }: ActionCardProps) {
    return (
        <Link href={href} className="block h-full w-full">
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="h-full w-full"
            >
                <Card className={cn(
                    "h-full w-full transition-colors border-transparent shadow-lg",
                    color === "primary"
                        ? "bg-primary/5 hover:bg-primary/10 border-primary/10"
                        : "bg-secondary/5 hover:bg-secondary/10 border-secondary/10",
                    className
                )}>
                    <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6 gap-3 sm:gap-4 text-center h-full min-h-[120px] sm:min-h-[140px]">
                        <div className={cn(
                            "h-12 w-12 sm:h-14 sm:w-14 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 shrink-0",
                            color === "primary"
                                ? "bg-primary text-primary-foreground shadow-primary/20"
                                : "bg-secondary text-secondary-foreground shadow-secondary/20"
                        )}>
                            {icon}
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-base sm:text-lg mb-0.5 sm:mb-1 line-clamp-2">{title}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{subtitle}</p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </Link>
    )
}
