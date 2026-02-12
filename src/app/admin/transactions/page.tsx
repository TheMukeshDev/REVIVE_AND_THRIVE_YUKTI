"use client"

import { useState, useEffect } from "react"
import { Check, X, Filter, MoreHorizontal, ArrowLeft, ArrowRight as ArrowRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { useAuth } from "@/context/auth-context"

interface Transaction {
    _id: string
    userId: { name: string, email: string }
    binId?: { name: string }
    type: string
    itemName: string
    pointsEarned: number
    status: 'pending' | 'approved' | 'rejected'
    createdAt: string
}

export default function TransactionsPage() {
    const { user: currentUser } = useAuth()
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [statusFilter, setStatusFilter] = useState("all")
    const [typeFilter, setTypeFilter] = useState("all")

    const fetchTransactions = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "15",
                status: statusFilter,
                type: typeFilter
            })

            const res = await fetch(`/api/admin/transactions?${params}`, {
                headers: { 'x-admin-id': currentUser?._id || '' }
            })
            const data = await res.json()

            if (data.success) {
                setTransactions(data.data.transactions)
                setTotalPages(data.data.pagination.pages)
            }
        } catch (error) {
            console.error("Fetch transactions error:", error)
            toast.error("Failed to load transactions")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTransactions()
    }, [page, statusFilter, typeFilter, currentUser])

    const handleStatusUpdate = async (id: string, newStatus: 'approved' | 'rejected') => {
        try {
            const res = await fetch("/api/admin/transactions", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    'x-admin-id': currentUser?._id || ''
                },
                body: JSON.stringify({ transactionIds: [id], status: newStatus })
            })
            const data = await res.json()

            if (data.success) {
                toast.success(`Transaction ${newStatus}`)
                // Optimistic update
                setTransactions(prev => prev.map(t =>
                    t._id === id ? { ...t, status: newStatus } : t
                ))
            } else {
                toast.error(data.error || "Update failed")
            }
        } catch (error) {
            toast.error("Something went wrong")
        }
    }

    return (
        <div className="space-y-4 sm:space-y-6 md:space-y-8 w-full">
            <div className="flex flex-col sm:flex-row sm:items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Transaction History</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">View and manage recycling activities.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-35 h-10 text-xs sm:text-sm">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-full sm:w-35 h-10 text-xs sm:text-sm">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="recycle">Recycle</SelectItem>
                            <SelectItem value="scan">Scan</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="bg-card border border-border rounded-lg sm:rounded-xl overflow-hidden shadow-sm w-full">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs sm:text-sm text-left">
                        <thead className="text-xs uppercase bg-secondary/50 border-b border-border/50 text-muted-foreground">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">User</th>
                                <th className="px-6 py-3">Item</th>
                                <th className="px-6 py-3">Points</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="bg-white border-b">
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-12" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-6 w-20" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-8 w-8 ml-auto" /></td>
                                    </tr>
                                ))
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No transactions found.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((tx) => (
                                    <tr key={tx._id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(tx.createdAt).toLocaleDateString()}
                                            <div className="text-xs">{new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{tx.userId?.name || "Unknown"}</div>
                                            <div className="text-xs text-gray-500">{tx.userId?.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{tx.itemName}</div>
                                            <div className="text-xs text-muted-foreground capitalize">{tx.type} • {tx.binId?.name || "Scan"}</div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-green-600">
                                            +{tx.pointsEarned}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${tx.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                    tx.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {tx.status === 'pending' && (
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                        onClick={() => handleStatusUpdate(tx._id, 'approved')}
                                                        title="Approve"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleStatusUpdate(tx._id, 'rejected')}
                                                        title="Reject"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Page {page} of {totalPages || 1}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline" size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" /> Previous
                        </Button>
                        <Button
                            variant="outline" size="sm"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages || totalPages === 0}
                        >
                            Next <ArrowRightIcon className="h-4 w-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
