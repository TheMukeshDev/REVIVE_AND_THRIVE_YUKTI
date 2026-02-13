"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { User, Settings, LogOut, Bell, Shield, Wallet, Share2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useTranslation } from "@/context/language-context"

export default function ProfilePage() {
    const router = useRouter()
    const { user, logout } = useAuth()
    const { t } = useTranslation()

    // Check authentication
    useEffect(() => {
        if (!user) {
            router.push("/auth/login?redirect=/profile")
        }
    }, [user, router])

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'EcoDrop Profile',
                text: `I've recycled ${user?.totalItemsRecycled} items and saved ${user?.totalCO2Saved}kg of CO2 with EcoDrop! 🌱`,
                url: window.location.href,
            }).catch(console.error);
        } else {
            alert("Sharing not supported on this browser");
        }
    }

    const [activeModal, setActiveModal] = useState<string | null>(null)

    const Modal = ({ title, onClose, children }: { title: string, onClose: () => void, children: React.ReactNode }) => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-sm max-h-[90vh] overflow-y-auto relative">
                <div className="bg-primary/10 p-3 sm:p-4 border-b sticky top-0">
                    <h3 className="font-bold text-base sm:text-lg">{title}</h3>
                </div>
                <div className="p-3 sm:p-4">
                    {children}
                </div>
                <div className="p-3 sm:p-4 border-t bg-secondary/20 flex justify-end sticky bottom-0">
                    <Button onClick={onClose} size="sm" className="text-xs sm:text-sm">Close</Button>
                </div>
            </Card>
        </div>
    )

    return (
        <div className="flex flex-col gap-4 sm:gap-5 md:gap-4 lg:gap-5 pb-4 sm:pb-6 md:pb-4 lg:pb-6 w-full">
            {activeModal && (
                <Modal title={activeModal} onClose={() => setActiveModal(null)}>
                    {activeModal === "Linked Accounts" && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Google</span>
                                <span className="text-green-600 text-xs sm:text-sm font-bold bg-green-100 px-2 py-1 rounded">{t("connected")}</span>
                            </div>
                        </div>
                    )}
                    {activeModal === "Notifications" && (
                        <NotificationSettings userEmail={user?.email} />
                    )}
                    {activeModal === "App Settings" && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-sm sm:text-base">{t("language")}</span>
                                <span className="text-xs sm:text-sm text-muted-foreground">English</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-sm sm:text-base">App Version</span>
                                <span className="text-xs sm:text-sm text-muted-foreground">1.0.0</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-sm sm:text-base">Auto Backup</span>
                                <span className="text-xs sm:text-sm text-muted-foreground">Enabled</span>
                            </div>
                        </div>
                    )}
                </Modal>
            )}

            <h1 className="text-2xl sm:text-3xl font-bold">{t("profile_title")}</h1>

            {/* Profile Header */}
            <div className="flex items-center gap-3 sm:gap-4">
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-primary/20 flex items-center justify-center text-primary border-4 border-background shadow-xl shrink-0">
                    <User className="h-8 w-8 sm:h-10 sm:w-10" />
                </div>
                <div className="min-w-0 flex-1">
                    <h2 className="text-lg sm:text-xl font-bold truncate">{user?.name || "Guest User"}</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">@{user?.username || "guest"}</p>
                    <div className="mt-1 flex items-center gap-2 flex-wrap">
                        <div className="inline-flex items-center bg-green-500/10 text-green-500 px-2 py-0.5 rounded text-xs font-medium">
                            {user?.points || 0} Points
                        </div>
                        <button 
                            onClick={handleShare}
                            className="p-1.5 hover:bg-accent/20 rounded-full transition-colors"
                            aria-label="Share profile"
                        >
                            <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Impact Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <Card className="p-3 sm:p-4 flex flex-col items-center justify-center text-center bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900">
                    <span className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{user?.totalItemsRecycled || 0}</span>
                    <span className="text-xs sm:text-sm text-blue-800 dark:text-blue-300 font-medium">{t("items_recycled")}</span>
                </Card>
                <Card className="p-3 sm:p-4 flex flex-col items-center justify-center text-center bg-green-50 dark:bg-green-950/30 border-green-100 dark:border-green-900">
                    <span className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">{user?.totalCO2Saved || 0}kg</span>
                    <span className="text-xs sm:text-sm text-green-800 dark:text-green-300 font-medium">{t("co2_saved")}</span>
                </Card>
            </div>

            {/* Important User Guidance */}
            <Card className="p-3 sm:p-4 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
                <div className="flex items-start gap-2 sm:gap-3">
                    <div className="p-1 bg-amber-100 dark:bg-amber-900 rounded shrink-0">
                        <span className="text-lg">ℹ️</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-1 text-sm sm:text-base">{t("how_stats_work")}</h4>
                        <div className="text-xs sm:text-sm text-amber-700 dark:text-amber-300 space-y-1">
                            <p><strong>Scanning</strong>: {t("scanning_desc")}</p>
                            <p><strong>Verified Drop</strong>: {t("verified_drop_desc")}</p>
                            <p className="text-xs mt-2 text-amber-600 dark:text-amber-400">{t("impact_note")}</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Quick Guide */}
            <Card className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
                <div className="flex items-start gap-2 sm:gap-3">
                    <div className="p-1 bg-blue-100 dark:bg-blue-900 rounded shrink-0">
                        <span className="text-lg">🚀</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 text-sm sm:text-base">{t("quick_guide_title")}</h4>
                        <div className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 space-y-2">
                            <div className="flex items-start gap-2">
                                <span className="font-medium shrink-0">1.</span>
                                <span>{t("guide_step_1")}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="font-medium shrink-0">2.</span>
                                <span>{t("guide_step_2")}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="font-medium shrink-0">3.</span>
                                <span>{t("guide_step_3")}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="font-medium shrink-0">4.</span>
                                <span>{t("guide_step_4")}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="font-medium shrink-0">5.</span>
                                <span>{t("guide_step_5")}</span>
                            </div>
                        </div>
                        <div className="mt-3">
                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm"
                                onClick={() => window.location.href = '/find-bin'}
                            >
                                {t("start_recycling_action")}
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Badges */}
            <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary" /> {t("achievements")}
                </h3>
                <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {/* Dynamic Badges */}
                    {(user?.totalItemsRecycled || 0) >= 1 && (
                        <BadgeItem icon="🌱" title="First Step" color="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" onClick={() => alert("Badge: First Step\nAwarded for recycling your first item!")} />
                    )}
                    {(user?.totalItemsRecycled || 0) >= 5 && (
                        <BadgeItem icon="♻️" title="Recycler" color="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" onClick={() => alert("Badge: Recycler\nAwarded for recycling 5 items!")} />
                    )}
                    {(user?.totalItemsRecycled || 0) >= 10 && (
                        <BadgeItem icon="⭐" title="Super Star" color="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300" onClick={() => alert("Badge: Super Star\nAwarded for recycling 10 items!")} />
                    )}
                    {(user?.totalItemsRecycled || 0) >= 50 && (
                        <BadgeItem icon="👑" title="Eco King" color="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" onClick={() => alert("Badge: Eco King\nAwarded for recycling 50 items!")} />
                    )}
                    {(!user?.totalItemsRecycled || user.totalItemsRecycled === 0) && (
                        <div className="text-xs sm:text-sm text-muted-foreground italic px-2">{t("recycle_for_badges")}</div>
                    )}
                </div>
            </div>

            {/* Settings List */}
            <Card className="overflow-hidden">
                <div className="divide-y divide-border">
                    {[
                        { icon: Wallet, label: t("linked_accounts") },
                        { icon: Bell, label: t("notifications") },
                        { icon: Shield, label: t("privacy_security") },
                        { icon: Settings, label: t("app_settings") },
                    ].map((item, i) => (
                        <button
                            key={i}
                            className="flex w-full items-center justify-between p-3 sm:p-4 hover:bg-muted/50 transition-colors text-left"
                            onClick={() => setActiveModal(item.label)}
                        >
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0" />
                                <span className="font-medium text-sm sm:text-base">{item.label}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </Card>

            <Button variant="destructive" className="w-full text-sm sm:text-base" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> {t("sign_out")}
            </Button>
        </div>
    )
}

function BadgeItem({ icon, title, color, onClick }: { icon: string, title: string, color: string, onClick?: () => void }) {
    return (
        <div
            className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg sm:rounded-xl min-w-17.5 sm:min-w-20 shadow-sm border border-transparent ${color} cursor-pointer active:scale-95 transition-transform`}
            onClick={onClick}
        >
            <span className="text-xl sm:text-2xl mb-0.5 sm:mb-1">{icon}</span>
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-tight text-center line-clamp-2">{title}</span>
        </div>
    )
}

function NotificationSettings({ userEmail }: { userEmail?: string }) {
    const { t } = useTranslation()
    const [emailEnabled, setEmailEnabled] = useState(true) // Default ON as requested

    const [pushEnabled, setPushEnabled] = useState(true)
    const [sending, setSending] = useState(false)

    const sendTestEmail = async () => {
        if (!userEmail) return alert("No email address found for user.")

        setSending(true)
        try {
            const res = await fetch("/api/notifications/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail, type: "test" })
            })
            const data = await res.json()
            if (data.success) {
                alert("Test email sent successfully! 📧")
            } else {
                alert("Failed to send email: " + data.error)
            }
        } catch (e) {
            console.error(e)
            alert("Error sending test email.")
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <span className="font-medium">{t("push_notifications")}</span>
                <div
                    className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${pushEnabled ? "bg-primary" : "bg-muted"}`}
                    onClick={() => setPushEnabled(!pushEnabled)}
                >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${pushEnabled ? "right-1" : "left-1"}`}></div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <span className="font-medium d-block">{t("email_updates")}</span>
                    <p className="text-xs text-muted-foreground">{t("email_desc")}</p>
                </div>
                <div
                    className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${emailEnabled ? "bg-primary" : "bg-muted"}`}
                    onClick={() => setEmailEnabled(!emailEnabled)}
                >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${emailEnabled ? "right-1" : "left-1"}`}></div>
                </div>
            </div>

            {emailEnabled && (
                <div className="pt-2 border-t">
                    <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-xs"
                        onClick={sendTestEmail}
                        disabled={sending}
                    >
                        {sending ? "Sending..." : t("send_test_email")}
                    </Button>
                </div>
            )}
        </div>
    )
}
