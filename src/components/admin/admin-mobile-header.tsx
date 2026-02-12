"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, BarChart3, Users, Trash2, AlertTriangle, Shield, LogOut } from "lucide-react"
import { useState } from "react"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"

export default function AdminMobileHeader() {
    const pathname = usePathname()
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)

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
            router.push("/admin/login")
            router.refresh()
        } catch (error) {
            console.error("Logout error:", error)
        }
    }

    return (
        <>
            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 left-0 right-0 z-30 h-16 bg-card border-b border-border flex items-center justify-between px-4 gap-3">
                {/* Logo */}
                <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 bg-linear-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                        <Logo className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg text-foreground truncate">EcoDrop</span>
                </div>

                {/* Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                    {isOpen ? (
                        <X className="w-6 h-6 text-foreground" />
                    ) : (
                        <Menu className="w-6 h-6 text-foreground" />
                    )}
                </button>
            </header>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden fixed inset-0 top-16 z-20 bg-card border-b border-border overflow-y-auto">
                    {/* Navigation */}
                    <nav className="flex flex-col gap-1 p-4 pb-20">
                        {navItems.map((item) => {
                            const isActive = pathname.includes(item.href.split('/').pop() || '')
                            const Icon = item.icon
                            
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                    }`}
                                >
                                    <Icon className="w-5 h-5 shrink-0" />
                                    <span>{item.label}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 md:hidden">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                A
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-foreground truncate">Admin User</p>
                                <p className="text-xs text-muted-foreground truncate">Super Admin</p>
                            </div>
                        </div>
                        <Button
                            onClick={() => {
                                handleLogout()
                                setIsOpen(false)
                            }}
                            variant="outline"
                            size="sm"
                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200 dark:border-red-800"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            )}
        </>
    )
}
