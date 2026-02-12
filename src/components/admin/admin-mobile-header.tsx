"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, BarChart3, Users, Trash2, AlertTriangle, Shield, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"

export default function AdminMobileHeader() {
    const pathname = usePathname()
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Close menu when pathname changes
    useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    const navItems = [
        { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
        { href: "/admin/users", label: "Users", icon: Users },
        { href: "/admin/bins", label: "Bins", icon: Trash2 },
        { href: "/admin/drops", label: "Drops", icon: AlertTriangle },
        { href: "/admin/logs", label: "Audit Logs", icon: Shield },
    ]

    const handleLogout = async () => {
        try {
            document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
            localStorage.removeItem("admin_token")
            setIsOpen(false)
            router.push("/admin/login")
            router.refresh()
        } catch (error) {
            console.error("Logout error:", error)
        }
    }

    if (!mounted) return null

    return (
        <>
            {/* Mobile/Tablet Header */}
            <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-card border-b border-border/50 backdrop-blur-sm flex items-center justify-between px-3 sm:px-4 md:px-6 gap-3 lg:hidden">
                {/* Logo and Brand */}
                <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-linear-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                        <Logo className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <span className="font-bold text-base sm:text-lg text-foreground truncate">EcoDrop</span>
                </div>

                {/* Current Page Title - Hidden on small mobile */}
                <div className="hidden sm:flex text-center flex-1">
                    <span className="text-xs sm:text-sm text-muted-foreground truncate">
                        {navItems.find(item => pathname.includes(item.href.split('/').pop() || ''))?.label || 'Admin'}
                    </span>
                </div>

                {/* Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-lg hover:bg-secondary/80 transition-colors shrink-0"
                    aria-label="Toggle menu"
                    aria-expanded={isOpen}
                >
                    {isOpen ? (
                        <X className="w-6 h-6 text-foreground" />
                    ) : (
                        <Menu className="w-6 h-6 text-foreground" />
                    )}
                </button>
            </header>

            {/* Mobile/Tablet Menu Overlay */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 top-16 z-30 bg-black/50 lg:hidden"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Menu Panel */}
                    <div className="fixed top-16 left-0 right-0 bottom-0 z-30 bg-card overflow-y-auto lg:hidden max-h-[calc(100vh-4rem)]">
                        {/* Navigation */}
                        <nav className="flex flex-col gap-1 p-3 sm:p-4 md:p-6">
                            {navItems.map((item) => {
                                const isActive = pathname.includes(item.href.split('/').pop() || '')
                                const Icon = item.icon
                                
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-3 sm:py-4 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 group ${
                                            isActive
                                                ? "bg-primary text-primary-foreground shadow-md"
                                                : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                                        }`}
                                    >
                                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                                        <span>{item.label}</span>
                                        {isActive && (
                                            <div className="ml-auto w-2 h-2 rounded-full bg-primary-foreground" />
                                        )}
                                    </Link>
                                )
                            })}
                        </nav>

                        {/* Divider */}
                        <div className="border-t border-border/50 my-2 sm:my-4" />

                        {/* Profile Section */}
                        <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-3 sm:space-y-4">
                            <div className="flex items-center gap-3 px-2">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm sm:text-base shrink-0">
                                    A
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm sm:text-base font-semibold text-foreground truncate">Admin User</p>
                                    <p className="text-xs sm:text-sm text-muted-foreground truncate">Super Admin</p>
                                </div>
                            </div>
                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                className="w-full justify-start text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200 dark:border-red-800"
                            >
                                <LogOut className="w-4 h-4 mr-2 shrink-0" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
