"use client"

import { motion } from "framer-motion"
import { ScanLine } from "lucide-react"
import Link from "next/link"

export function FloatingScanButton() {
    return (
        <div className="relative -top-8 flex justify-center">
            <Link href="/scan" aria-label="Scan Item">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative z-50 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-tr from-primary to-green-400 text-primary-foreground shadow-lg shadow-primary/40 ring-4 ring-background"
                >
                    {/* Pulse Effect */}
                    <motion.div
                        className="absolute inset-0 rounded-full bg-primary"
                        animate={{
                            scale: [1, 1.4, 1.4],
                            opacity: [0.6, 0, 0]
                        }}
                        transition={{
                            duration: 2,
                            ease: "easeInOut",
                            repeat: Infinity,
                        }}
                    />

                    <ScanLine className="h-8 w-8 relative z-10" />
                </motion.div>
            </Link>
        </div>
    )
}
