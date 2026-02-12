
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts"

const data = [
    { name: "Mon", drops: 4, co2: 2.4 },
    { name: "Tue", drops: 7, co2: 4.5 },
    { name: "Wed", drops: 5, co2: 3.2 },
    { name: "Thu", drops: 12, co2: 8.9 },
    { name: "Fri", drops: 9, co2: 6.1 },
    { name: "Sat", drops: 15, co2: 11.2 },
    { name: "Sun", drops: 18, co2: 14.5 },
]

const pieData = [
    { name: "Mobile Phones", value: 400 },
    { name: "Batteries", value: 300 },
    { name: "Laptops", value: 150 },
    { name: "Cables/Accessories", value: 100 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default function AnalyticsPage() {
    return (
        <div className="space-y-4 sm:space-y-6 md:space-y-8 w-full">
            <header>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground\">Analytics & Impact</h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2\">Deep dive into recycling trends and environmental impact</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8\">
                {/* Impact Trend Chart */}
                <Card className="col-span-1 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Weekly Impact Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-48 sm:h-64 md:h-80 lg:h-96 w-full\">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorDrops" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-gray-200" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                                    />
                                    <Area type="monotone" dataKey="drops" stroke="#8884d8" fillOpacity={1} fill="url(#colorDrops)" name="Verified Drops" />
                                    <Area type="monotone" dataKey="co2" stroke="#82ca9d" fillOpacity={1} fill="url(#colorCo2)" name="CO₂ Saved (kg)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Composition Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>E-Waste Composition</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-75 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Key Insights */}
                <Card>
                    <CardHeader>
                        <CardTitle>AI Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <div className="min-w-1 h-full bg-blue-500 rounded-full" />
                                <div>
                                    <p className="font-semibold text-gray-900">Peak Activity</p>
                                    <p className="text-sm text-gray-600">Sunday shows 50% higher drop-off rates than weekdays.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <div className="min-w-1 h-full bg-green-500 rounded-full" />
                                <div>
                                    <p className="font-semibold text-gray-900">Mobile Dominance</p>
                                    <p className="text-sm text-gray-600">Mobile phones constitute 42% of all recycled items.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <div className="min-w-1 h-full bg-yellow-500 rounded-full" />
                                <div>
                                    <p className="font-semibold text-gray-900">Bin Efficiency</p>
                                    <p className="text-sm text-gray-600">Civil Lines bin reaches capacity 2x faster than others.</p>
                                </div>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
