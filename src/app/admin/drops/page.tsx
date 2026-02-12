"use client"

import { useEffect, useState } from "react"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table" // Using Shadcn table if available basically table tags
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, AlertOctagon, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DropsManagementPage() {
    const [drops, setDrops] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [processingId, setProcessingId] = useState<string | null>(null)

    const fetchDrops = async () => {
        try {
            const res = await fetch("/api/admin/drops")
            const data = await res.json()
            if (data.success) {
                setDrops(data.drops)
            }
        } catch (error) {
            toast.error("Failed to load drops")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDrops()
    }, [])

    const handleStatusUpdate = async (dropId: string, status: string) => {
        if (!confirm(`Are you sure you want to mark this as ${status}?`)) return

        setProcessingId(dropId)
        try {
            const res = await fetch("/api/admin/drops", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    dropId,
                    status,
                    reasoning: status === "rejected" ? "Admin manual rejection" : "Admin approval"
                })
            })

            const data = await res.json()
            if (data.success) {
                toast.success(`Drop marked as ${status}`)
                fetchDrops()
            } else {
                toast.error(data.error || "Action failed")
            }
        } catch (error) {
            toast.error("Network error")
        } finally {
            setProcessingId(null)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "approved": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            case "rejected": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            default: return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
        }
    }

    return (
        <div className="space-y-4 sm:space-y-6 md:space-y-8 w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Drop Verification</h1>
                <Button onClick={fetchDrops} variant="outline" size="sm">
                    Refresh
                </Button>
            </div>

            <Card className="w-full">
                <CardHeader className="pb-3 sm:pb-4 md:pb-6">
                    <CardTitle className="text-base sm:text-lg md:text-xl">Recent Drop Activities</CardTitle>
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                    {loading ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs sm:text-sm text-left">
                                <thead className="text-xs uppercase bg-secondary/50 text-muted-foreground border-b border-border/50">
                                    <tr>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 font-semibold">User</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 font-semibold hidden sm:table-cell">Item</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 font-semibold hidden lg:table-cell">Bin</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 font-semibold">Points</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 font-semibold">Status</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {drops.map((drop) => (
                                        <tr key={drop._id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                                            <td className="px-2 sm:px-4 py-2 sm:py-3 font-medium">
                                                <div className="text-xs sm:text-sm">{drop.userId?.name || "Unknown"}</div>
                                                <div className="text-xs text-muted-foreground hidden sm:block truncate">{drop.userId?.email}</div>
                                            </td>
                                            <td className="px-2 sm:px-4 py-2 sm:py-3 capitalize hidden sm:table-cell text-xs sm:text-sm">{drop.itemName}</td>
                                            <td className="px-2 sm:px-4 py-2 sm:py-3 hidden lg:table-cell text-xs sm:text-sm">{drop.binId?.name || "N/A"}</td>
                                            <td className="px-2 sm:px-4 py-2 sm:py-3 font-bold text-xs sm:text-sm">+{drop.pointsEarned}</td>
                                            <td className="px-2 sm:px-4 py-2 sm:py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(drop.status)}`}>
                                                    {drop.status.charAt(0).toUpperCase() + drop.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-right">
                                                {drop.status === "pending" && (
                                                    <div className="flex gap-1 sm:gap-2 justify-end">
                                                        <Button
                                                            size="sm"
                                                            className="h-7 sm:h-8 w-7 sm:w-8 p-0 bg-green-600 hover:bg-green-700"
                                                            onClick={() => handleStatusUpdate(drop._id, "approved")}
                                                            disabled={!!processingId}
                                                            title="Approve"
                                                        >
                                                            <Check className="w-3 sm:w-4 h-3 sm:h-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            className="h-7 sm:h-8 w-7 sm:w-8 p-0"
                                                            onClick={() => handleStatusUpdate(drop._id, "rejected")}
                                                            disabled={!!processingId}
                                                            title="Reject"
                                                        >
                                                            <X className="w-3 sm:w-4 h-3 sm:h-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                                {drop.status === "approved" && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-7 sm:h-8 w-7 sm:w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => handleStatusUpdate(drop._id, "rejected")}
                                                        disabled={!!processingId}
                                                        title="Revoke"
                                                    >
                                                        <AlertOctagon className="w-4 h-4 mr-1" />
                                                        Revoke
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {drops.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                                No drop records found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
