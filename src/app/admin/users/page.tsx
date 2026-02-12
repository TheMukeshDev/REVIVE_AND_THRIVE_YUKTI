"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Lock, Unlock, User as UserIcon } from "lucide-react"

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchUsers = async () => {
        const res = await fetch("/api/admin/users")
        const data = await res.json()
        if (data.success) setUsers(data.users)
        setLoading(false)
    }

    useEffect(() => { fetchUsers() }, [])

    const toggleStatus = async (userId: string, currentStatus: boolean) => {
        if (!confirm(`Are you sure you want to ${currentStatus ? "block" : "activate"} this user?`)) return
        const res = await fetch("/api/admin/users", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, isActive: !currentStatus })
        })
        const data = await res.json()
        if (data.success) {
            toast.success(data.message)
            fetchUsers()
        } else {
            toast.error(data.error)
        }
    }

    return (
        <div className="space-y-4 sm:space-y-6 md:space-y-8 w-full">
            <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">User Management</h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">Manage registered users and their status</p>
            </div>
            <Card className="w-full">
                <CardHeader className="pb-3 sm:pb-4 md:pb-6">
                    <CardTitle className="text-base sm:text-lg md:text-xl">Registered Users</CardTitle>
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex justify-center py-12 text-muted-foreground text-sm">Loading users...</div>
                        ) : users.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground text-sm">No users found</div>
                        ) : (
                            <table className="w-full text-xs sm:text-sm text-left">
                                <thead className="bg-secondary/50 uppercase text-xs border-b border-border/50">
                                    <tr>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 font-semibold">User</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 font-semibold hidden sm:table-cell">Points</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 font-semibold hidden md:table-cell">CO2 Saved</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 font-semibold">Status</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u._id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                                            <td className="px-2 sm:px-4 py-2 sm:py-3">
                                                <div className="font-medium text-xs sm:text-sm">{u.name}</div>
                                                <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                                            </td>
                                            <td className="px-2 sm:px-4 py-2 sm:py-3 hidden sm:table-cell text-xs sm:text-sm">{u.points}</td>
                                            <td className="px-2 sm:px-4 py-2 sm:py-3 hidden md:table-cell text-xs sm:text-sm">{u.totalCO2Saved}kg</td>
                                            <td className="px-2 sm:px-4 py-2 sm:py-3">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${u.isActive ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}>
                                                    {u.isActive ? "Active" : "Block"}
                                                </span>
                                            </td>
                                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-right">
                                                <Button
                                                    size="sm"
                                                    variant={u.isActive ? "destructive" : "default"}
                                                    onClick={() => toggleStatus(u._id, u.isActive)}
                                                    className="h-8 text-xs sm:text-sm"
                                                >
                                                    {u.isActive ? <Lock className="w-3 h-3 sm:w-4 sm:h-4" /> : <Unlock className="w-3 h-3 sm:w-4 sm:h-4" />}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
