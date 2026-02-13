"use client"

import { motion, AnimatePresence, Variants } from "framer-motion"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface MotionWrapperProps {
    children: ReactNode
    className?: string
    delay?: number
    direction?: "up" | "down" | "left" | "right" | "none"
    variant?: "fadeIn" | "slideUp" | "scale" | "blur" | "rotate" | "elastic" | "none"
    duration?: number
    stagger?: boolean
}

export function MotionWrapper({
    children,
    className,
    delay = 0,
    direction = "up",
    variant = "slideUp",
    duration = 0.5,
    stagger = false,
}: MotionWrapperProps) {
    // Spring animation configuration for smooth, natural motion
    const springConfig = {
        type: "spring",
        stiffness: 60,
        damping: 15,
        mass: 1,
    }
    
    // Easing curves for different animation styles
    const easing = [0.21, 0.47, 0.32, 0.98] // Cubic bezier for smooth ease

    const getVariants = (): Variants => {
        const directionOffsets = {
            up: { x: 0, y: 20 },
            down: { x: 0, y: -20 },
            left: { x: 20, y: 0 },
            right: { x: -20, y: 0 },
            none: { x: 0, y: 0 },
        }
        
        const offset = directionOffsets[direction]

        switch (variant) {
            case "fadeIn":
                return {
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            duration,
                            ease: easing,
                        },
                    },
                }
            
            case "scale":
                return {
                    hidden: { opacity: 0, scale: 0.9 },
                    visible: {
                        opacity: 1,
                        scale: 1,
                        transition: {
                            duration,
                            ease: easing,
                        },
                    },
                }
            
            case "blur":
                return {
                    hidden: { opacity: 0, filter: "blur(10px)" },
                    visible: {
                        opacity: 1,
                        filter: "blur(0px)",
                        transition: {
                            duration,
                            ease: easing,
                        },
                    },
                }
            
            case "rotate":
                return {
                    hidden: { opacity: 0, rotate: -10, scale: 0.95 },
                    visible: {
                        opacity: 1,
                        rotate: 0,
                        scale: 1,
                        transition: {
                            duration,
                            ease: easing,
                        },
                    },
                }
            
            case "elastic":
                return {
                    hidden: { opacity: 0, ...offset, scale: 0.8 },
                    visible: {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        scale: 1,
                        transition: springConfig,
                    },
                }
            
            case "slideUp":
            default:
                return {
                    hidden: { opacity: 0, ...offset },
                    visible: {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        transition: {
                            duration,
                            ease: easing,
                        },
                    },
                }
        }
    }

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={getVariants()}
            transition={{
                delay: stagger ? delay * 0.1 : delay,
            }}
            className={cn("w-full", className)}
        >
            {children}
        </motion.div>
    )
}
        </motion.div>
    )
}

export const motionItem = {
    hover: { y: -4, transition: { duration: 0.2 } },
    tap: { scale: 0.98, transition: { duration: 0.1 } },
}
