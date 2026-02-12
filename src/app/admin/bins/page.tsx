"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Edit2, QrCode, MapPin, CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

export default function BinsPage() {
    const [bins, setBins] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        latitude: "",
        longitude: "",
        status: "operational",
        qrCode: ""
    })

    const fetchBins = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/admin/bins")
            const data = await res.json()
            if (data.success) {
                setBins(data.data)
            }
        } catch (e) {
            toast.error("Failed to load bins")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBins()
    }, [])

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this bin?")) return
        try {
            const res = await fetch(`/api/admin/bins?id=${id}`, { method: "DELETE" })
            if (res.ok) {
                toast.success("Bin deleted")
                fetchBins()
            }
        } catch (e) {
            toast.error("Failed to delete")
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch("/api/admin/bins", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (data.success) {
                toast.success("Bin added successfully")
                setIsAddOpen(false)
                setFormData({ name: "", address: "", latitude: "", longitude: "", status: "operational", qrCode: "" })
                fetchBins()
            } else {
                toast.error(data.error || "Failed to add bin")
            }
        } catch (e) {
            toast.error("Error creating bin")
        }
    }

    return (
        <div className="space-y-4 sm:space-y-6 md:space-y-8 w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Bin Management</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">Monitor and manage e-waste collection points</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" /> Add New Bin
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New E-Bin</DialogTitle>
                            <DialogDescription>Enter the details for the new collection point.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Bin Name</Label>
                                <Input
                                    value={formData.name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Central Mall Point" required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Address</Label>
                                <Input
                                    value={formData.address}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Full street address" required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Latitude</Label>
                                    <Input
                                        type="number" step="any"
                                        value={formData.latitude}
                                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Longitude</Label>
                                    <Input
                                        type="number" step="any"
                                        value={formData.longitude}
                                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(val) => setFormData({ ...formData, status: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="operational">Operational</SelectItem>
                                        <SelectItem value="full">Full</SelectItem>
                                        <SelectItem value="maintenance">Maintenance</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Custom QR Code (Optional)</Label>
                                <Input
                                    value={formData.qrCode}
                                    onChange={(e) => setFormData({ ...formData, qrCode: e.target.value })}
                                    placeholder="Leave empty to auto-generate"
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit">Create Bin</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full">
                {loading ? (
                    Array(6).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-40 sm:h-48 rounded-lg sm:rounded-xl" />
                    ))
                ) : bins.length === 0 ? (
                    <div className="col-span-full text-center py-8 sm:py-12 text-xs sm:text-sm text-muted-foreground">
                        No bins found. Add your first one!
                    </div>
                ) : (
                    bins.map((bin) => (
                        <div key={bin._id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                                <div className="font-semibold truncate">{bin.name}</div>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${bin.status === 'operational' ? 'bg-green-100 text-green-700' :
                                    bin.status === 'full' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {bin.status === 'operational' && <CheckCircle className="w-3 h-3" />}
                                    {bin.status === 'full' && <XCircle className="w-3 h-3" />}
                                    {bin.status === 'maintenance' && <AlertTriangle className="w-3 h-3" />}
                                    {bin.status}
                                </span>
                            </div>
                            <div className="p-4 space-y-3">
                                <div className="flex items-start gap-2 text-sm text-gray-600">
                                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                                    <p className="line-clamp-2">{bin.address || "No address provided"}</p>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <QrCode className="w-4 h-4 shrink-0" />
                                    <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{bin.qrCode}</code>
                                </div>

                                {/* Fill Level Visual */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Fill Level</span>
                                        <span>{bin.fillLevel || 0}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${(bin.fillLevel || 0) > 80 ? 'bg-red-500' :
                                                (bin.fillLevel || 0) > 50 ? 'bg-yellow-500' : 'bg-green-500'
                                                }`}
                                            style={{ width: `${bin.fillLevel || 0}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 border-t flex gap-2 justify-end bg-gray-50/50">
                                <Button variant="ghost" size="sm" className="h-8">
                                    <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                                </Button>
                                <Button
                                    variant="ghost" size="sm" className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleDelete(bin._id)}
                                >
                                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
