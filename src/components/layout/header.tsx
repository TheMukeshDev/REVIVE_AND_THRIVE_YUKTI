"use client"

import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { motion } from "framer-motion"

export function Header() {
    return (
        <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-xl border-b border-border/40 transition-all duration-300 hover:border-border/60">
            <div className="flex h-14 sm:h-16 md:h-16 lg:h-16 items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 w-full gap-2 sm:gap-3">
                {/* Logo and Brand */}
                <motion.div 
                    className="flex items-center gap-2 min-w-0 shrink-0"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Logo className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 shrink-0 transition-transform hover:scale-110" />
                    <span className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-foreground transition-colors truncate">
                        Eco<span className="text-primary">Drop</span>
                    </span>
                </motion.div>

                {/* Spacer for responsive behavior */}
                <div className="flex-1 min-w-0" />

                {/* Controls Group */}
                <motion.div 
                    className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    {/* Theme Toggle */}
                    <ThemeToggle size="sm" />
                    
                    {/* Language Switcher */}
                    <LanguageSwitcher />
                    
                    {/* Share Button */}
                    <motion.button 
                        className="p-2 rounded-lg hover:bg-accent/20 transition-colors duration-200 active:scale-95"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Share"
                    >
                        <Share2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-5 md:w-5 transition-transform" />
                    </motion.button>
                </motion.div>
            </div>

            {/* Responsive Underline Animation */}
            <motion.div
                className="h-0.5 bg-linear-to-r from-primary to-transparent"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6 }}
            />
        </header>
    )
}
