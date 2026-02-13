
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Trash2, ShieldCheck, BarChart3, Settings, LogOut, Users } from "lucide-react"
import { Logo } from "@/components/ui/logo"

export default function AdminSidebar() {
    const pathname = usePathname()

    const navItems = [
        {
            label: "Dashboard",
            href: "/admin",
            icon: LayoutDashboard // Uses Lucide React icons
        },
        {
            label: "User Management",
            href: "/admin/users",
            icon: Users
        },
        {
            label: "Bin Management",
            href: "/admin/bins",
            icon: Trash2
        },
        {
            label: "Transactions",
            href: "/admin/transactions",
            icon: ShieldCheck
        }
    ]

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200 hidden md:block">
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <Logo className="w-8 h-8 mr-3" />
                    <span className="text-xl font-bold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        EcoDrop Admin
                    </span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center px-3 py-2 rounded-lg transition-colors group ${isActive
                                    ? "bg-green-50 text-green-700"
                                    : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? "text-green-600" : "text-gray-400 group-hover:text-gray-600"
                                    }`} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer / Profile */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-sm font-bold text-green-700">A</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">Admin User</p>
                            <p className="text-xs text-gray-500">Super Admin</p>
                        </div>
                    </div>
                    <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                        <LogOut className="w-5 h-5 mr-3" />
                        Sign Out
                    </button>
                </div>
            </div>
        </aside>
    )
}
