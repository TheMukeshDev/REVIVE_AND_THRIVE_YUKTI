"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

export default function AdminLogsPage() {
    const [logs, setLogs] = useState<any[]>([])

    useEffect(() => {
        fetch("/api/admin/logs")
            .then(res => res.json())
            .then(data => { if (data.success) setLogs(data.logs) })
    }, [])

    return (
        <div className="space-y-4 sm:space-y-6 md:space-y-8 w-full">
            <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Audit Logs</h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">Track all system activities and changes</p>
            </div>
            <Card>
                <CardHeader><CardTitle>System Activities</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {logs.map(log => (
                            <div key={log._id} className="flex flex-col sm:flex-row justify-between p-4 border rounded-lg text-sm">
                                <div>
                                    <div className="font-bold flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${log.success ? "bg-green-500" : "bg-red-500"}`} />
                                        {log.action}
                                    </div>
                                    <div className="text-muted-foreground mt-1">
                                        On <span className="font-mono">{log.resource}</span>: {JSON.stringify(log.details)}
                                    </div>
                                </div>
                                <div className="text-xs text-muted-foreground sm:text-right mt-2 sm:mt-0">
                                    <div>{format(new Date(log.createdAt), "PPpp")}</div>
                                    <div>IP: {log.ipAddress}</div>
                                </div>
                            </div>
                        ))}
                        {logs.length === 0 && <div className="text-center text-muted-foreground">No logs found.</div>}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
