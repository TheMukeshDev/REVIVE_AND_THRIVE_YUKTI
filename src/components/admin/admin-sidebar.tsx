"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BarChart3, Users, Trash2, AlertTriangle, LogOut, Shield } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"

export default function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()

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
        <aside className="hidden lg:flex fixed lg:relative left-0 top-0 z-40 h-screen lg:h-full w-64 border-r border-border/50 bg-card dark:bg-slate-950 flex-col">
            {/* Header */}
            <div className="h-16 lg:h-20 flex items-center border-b border-border/50 px-6 gap-3 shrink-0">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-linear-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                    <Logo className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <div className="min-w-0">
                    <span className="font-bold text-lg lg:text-xl text-foreground block truncate">EcoDrop</span>
                    <span className="text-xs lg:text-sm text-muted-foreground">Admin Panel</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-6 lg:py-8 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname.includes(item.href.split('/').pop() || '')
                    const Icon = item.icon
                    
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 lg:py-3.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                            }`}
                        >
                            <Icon className="w-5 h-5 lg:w-5 lg:h-5 shrink-0" />
                            <span className="truncate">{item.label}</span>
                            {isActive && (
                                <div className="ml-auto w-2 h-2 rounded-full bg-primary-foreground" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="border-t border-border/50 p-4 lg:p-6 shrink-0 space-y-3 lg:space-y-4">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm lg:text-base shrink-0">
                        A
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">Admin User</p>
                        <p className="text-xs text-muted-foreground truncate">Super Admin</p>
                    </div>
                </div>
                <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs lg:text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200 dark:border-red-800"
                >
                    <LogOut className="w-4 h-4 mr-2 shrink-0" />
                    <span className="hidden lg:inline">Logout</span>
                    <span className="lg:hidden">Sign Out</span>
                </Button>
            </div>
        </aside>
    )
}
