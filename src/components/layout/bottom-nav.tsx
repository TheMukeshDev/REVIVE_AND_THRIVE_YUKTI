"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, MapPin, Gift, User } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { FloatingScanButton } from "@/components/features/floating-scan-button"

export function BottomNav() {
    const pathname = usePathname()

    // Simplified links excluding the Scan button which is handled separately
    const links = [
        { href: "/", label: "Home", icon: Home },
        { href: "/find-bin", label: "Find Bin", icon: MapPin },
        // Scan is central
        { href: "/rewards", label: "Rewards", icon: Gift },
        { href: "/profile", label: "Profile", icon: User },
    ]

    return (
        <div className="relative w-full">
            {/* Nav Container */}
            <div className="w-full bg-background/80 backdrop-blur-xl border-t pb-safe pt-2 relative rounded-t-3xl shadow-[0_-5px_10px_rgba(0,0,0,0.02)]">
                <nav className="flex items-end justify-between px-6 pb-4 pt-2 max-w-md mx-auto">
                    {/* Left Group */}
                    <div className="flex gap-8">
                        {links.slice(0, 2).map((link) => (
                            <NavLink key={link.href} item={link} isActive={pathname === link.href} />
                        ))}
                    </div>

                    {/* Center Button Placeholder - The actual button is absolute */}
                    <div className="w-12" />

                    {/* Right Group */}
                    <div className="flex gap-8">
                        {links.slice(2, 4).map((link) => (
                            <NavLink key={link.href} item={link} isActive={pathname === link.href} />
                        ))}
                    </div>
                </nav>

                {/* Floating Button Positioned Absolutely Over the Nav */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-4 pointer-events-auto">
                    <FloatingScanButton />
                </div>
            </div>
        </div>
    )
}

function NavLink({ item, isActive }: { item: any, isActive: boolean }) {
    return (
        <Link
            href={item.href}
            className={cn(
                "flex flex-col items-center gap-1 min-w-[44px] min-h-[44px] justify-center transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
        >
            <div className="relative">
                <item.icon className={cn("h-6 w-6 transition-all", isActive && "scale-110")} />
                {isActive && (
                    <motion.div
                        layoutId="nav-dot"
                        className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary"
                    />
                )}
            </div>
            {/* <span className="text-[10px] font-medium">{item.label}</span> */}
        </Link>
    )
}
