"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ShieldCheck, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Logo } from "@/components/ui/logo"

export default function AdminLoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()

            if (data.success) {
                toast.success("Welcome back, Admin! 🛡️")
                router.push("/admin/dashboard")
                router.refresh()
            } else {
                toast.error(data.error || "Login failed")
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-950 dark:from-background dark:to-background px-4 py-8 sm:px-6 md:px-8">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 right-0 w-48 sm:w-80 h-48 sm:h-80 bg-green-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 left-0 w-40 sm:w-72 h-40 sm:h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md relative z-10">
                {/* Card */}
                <div className="bg-card border border-border rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm">
                    {/* Header */}
                    <div className="bg-linear-to-r from-green-600 to-emerald-600 px-6 sm:px-8 py-8 sm:py-12 text-center">
                        <div className="w-16 sm:w-20 h-16 sm:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 backdrop-blur-xl ring-2 ring-white/30">
                            <ShieldCheck className="w-8 sm:w-10 h-8 sm:h-10 text-white" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Admin Access</h1>
                        <p className="text-white/80 text-xs sm:text-sm">Secure Management Portal</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-4 sm:space-y-6">
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="block text-xs sm:text-sm font-semibold text-foreground">
                                Admin Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-10 sm:h-12 bg-secondary border border-border rounded-lg sm:rounded-xl px-3 sm:px-4 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                                placeholder="admin@ecodrop.com"
                                required
                                autoComplete="email"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label className="block text-xs sm:text-sm font-semibold text-foreground">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-10 sm:h-12 bg-secondary border border-border rounded-lg sm:rounded-xl px-3 sm:px-4 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-10 sm:h-12 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 active:from-green-700 active:to-emerald-700 text-white font-bold text-sm sm:text-base rounded-lg sm:rounded-xl shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none mt-6 sm:mt-8"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 sm:w-5 h-4 sm:h-5 animate-spin" />
                                    <span className="hidden sm:inline">Authenticating...</span>
                                    <span className="sm:hidden">Loading...</span>
                                </>
                            ) : (
                                <>
                                    <span>Access Dashboard</span>
                                    <ShieldCheck className="w-4 sm:w-5 h-4 sm:h-5 group-hover:scale-110 transition-transform" />
                                </>
                            )}
                        </button>

                        {/* Footer Text */}
                        <p className="text-center text-xs text-muted-foreground">
                            🔐 Restricted area. All activities are logged.
                        </p>
                    </form>
                </div>

                {/* Branding */}
                <div className="text-center mt-6 sm:mt-8">
                    <p className="text-muted-foreground text-xs sm:text-sm">EcoDrop Administration</p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                        <Logo className="w-4 sm:w-5 h-4 sm:h-5 text-green-500" />
                        <span className="text-base sm:text-lg font-bold text-foreground">EcoDrop</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
