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
        <div className="min-h-screen w-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-950 dark:from-background dark:to-background px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 right-0 w-40 sm:w-64 md:w-80 lg:w-96 h-40 sm:h-64 md:h-80 lg:h-96 bg-green-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 left-0 w-40 sm:w-60 md:w-72 lg:w-96 h-40 sm:h-60 md:h-72 lg:h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg relative z-10">
                {/* Card */}
                <div className="bg-card border border-border rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm">
                    {/* Header */}
                    <div className="bg-linear-to-r from-green-600 to-emerald-600 px-6 sm:px-8 md:px-10 py-10 sm:py-12 md:py-16 text-center">
                        <div className="w-14 sm:w-16 md:w-20 h-14 sm:h-16 md:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6 backdrop-blur-xl ring-2 ring-white/30">
                            <ShieldCheck className="w-7 sm:w-8 md:w-10 h-7 sm:h-8 md:h-10 text-white" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1 sm:mb-2 md:mb-3">Admin Access</h1>
                        <p className="text-white/80 text-xs sm:text-sm md:text-base">Secure Management Portal</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="p-6 sm:p-8 md:p-10 lg:p-12 space-y-5 sm:space-y-6 md:space-y-7">
                        {/* Email Input */}
                        <div className="space-y-2 sm:space-y-2.5">
                            <label className="block text-xs sm:text-sm md:text-base font-semibold text-foreground">
                                Admin Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-10 sm:h-11 md:h-12 lg:h-13 bg-secondary border border-border rounded-lg sm:rounded-xl px-3 sm:px-4 md:px-5 text-sm sm:text-base md:text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                                placeholder="admin@ecodrop.com"
                                required
                                autoComplete="email"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2 sm:space-y-2.5">
                            <label className="block text-xs sm:text-sm md:text-base font-semibold text-foreground">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-10 sm:h-11 md:h-12 lg:h-13 bg-secondary border border-border rounded-lg sm:rounded-xl px-3 sm:px-4 md:px-5 text-sm sm:text-base md:text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-10 sm:h-11 md:h-12 lg:h-13 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 active:from-green-700 active:to-emerald-700 text-white font-bold text-sm sm:text-base md:text-lg rounded-lg sm:rounded-xl shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none mt-8 sm:mt-10 md:mt-12"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 animate-spin" />
                                    <span className="hidden sm:inline text-sm sm:text-base md:text-lg">Authenticating...</span>
                                    <span className="sm:hidden text-xs">Loading...</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-sm sm:text-base md:text-lg">Access Dashboard</span>
                                    <ShieldCheck className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 group-hover:scale-110 transition-transform" />
                                </>
                            )}
                        </button>

                        {/* Footer Text */}
                        <p className="text-center text-xs sm:text-sm text-muted-foreground">
                            🔐 Restricted area. All activities are logged.
                        </p>
                    </form>
                </div>

                {/* Branding */}
                <div className="text-center mt-8 sm:mt-10 md:mt-12">
                    <p className="text-muted-foreground text-xs sm:text-sm md:text-base">EcoDrop Administration</p>
                    <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4">
                        <Logo className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7 text-green-500" />
                        <span className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">EcoDrop</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
