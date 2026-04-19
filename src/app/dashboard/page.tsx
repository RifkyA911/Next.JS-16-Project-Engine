"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Users,
    ShoppingCart,
    Package,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Area, AreaChart } from "recharts";

// Chart configuration
const chartConfig = {
    revenue: {
        label: "Revenue",
        color: "hsl(var(--chart-1))",
    },
    orders: {
        label: "Orders",
        color: "hsl(var(--chart-2))",
    },
    users: {
        label: "Users",
        color: "hsl(var(--chart-3))",
    },
} as const;

// Mock data for charts
const monthlyData = [
    { month: "Jan", revenue: 45000, orders: 120, users: 850 },
    { month: "Feb", revenue: 52000, orders: 145, users: 920 },
    { month: "Mar", revenue: 48000, orders: 135, users: 980 },
    { month: "Apr", revenue: 61000, orders: 168, users: 1050 },
    { month: "May", revenue: 55000, orders: 152, users: 1120 },
    { month: "Jun", revenue: 67000, orders: 185, users: 1280 },
];

const categoryData = [
    { category: "Electronics", value: 35, color: "#3b82f6" },
    { category: "Clothing", value: 25, color: "#10b981" },
    { category: "Food", value: 20, color: "#f59e0b" },
    { category: "Books", value: 12, color: "#8b5cf6" },
    { category: "Other", value: 8, color: "#6b7280" },
];

const recentOrders = [
    { id: "ORD-001", customer: "John Doe", amount: 1250, status: "completed", date: "2024-04-19" },
    { id: "ORD-002", customer: "Jane Smith", amount: 890, status: "processing", date: "2024-04-19" },
    { id: "ORD-003", customer: "Bob Johnson", amount: 2100, status: "completed", date: "2024-04-18" },
    { id: "ORD-004", customer: "Alice Brown", amount: 450, status: "pending", date: "2024-04-18" },
    { id: "ORD-005", customer: "Charlie Wilson", amount: 1800, status: "completed", date: "2024-04-17" },
];

export default function DashboardPage() {
    const totalRevenue = monthlyData.reduce((sum, item) => sum + item.revenue, 0);
    const totalOrders = monthlyData.reduce((sum, item) => sum + item.orders, 0);
    const totalUsers = monthlyData[monthlyData.length - 1].users;
    const avgOrderValue = totalRevenue / totalOrders;

    const revenueGrowth = ((monthlyData[5].revenue - monthlyData[4].revenue) / monthlyData[4].revenue * 100).toFixed(1);
    const orderGrowth = ((monthlyData[5].orders - monthlyData[4].orders) / monthlyData[4].orders * 100).toFixed(1);

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalRevenue.toLocaleString('en-US')}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="flex items-center text-green-600">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                +{revenueGrowth}% from last month
                            </span>
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalOrders.toLocaleString('en-US')}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="flex items-center text-green-600">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                +{orderGrowth}% from last month
                            </span>
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsers.toLocaleString('en-US')}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="flex items-center text-green-600">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                +12% from last month
                            </span>
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="flex items-center text-red-600">
                                <ArrowDownRight className="h-3 w-3 mr-1" />
                                -2.1% from last month
                            </span>
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Revenue Overview</CardTitle>
                                <CardDescription>Monthly revenue for the last 6 months</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-xs text-green-600">Online</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    <span className="text-xs text-red-600">Offline</span>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {monthlyData && monthlyData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip
                                        formatter={(value: any) => [`$${Number(value).toLocaleString('en-US')}`, 'Revenue']}
                                        contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="hsl(var(--chart-1))"
                                        strokeWidth={3}
                                        dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 5 }}
                                        activeDot={{ r: 7 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-48 flex items-center justify-center">
                                <div className="text-muted-foreground">Loading chart...</div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Category Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Category Distribution</CardTitle>
                        <CardDescription>Sales by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={categoryData} layout="horizontal">
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis type="number" />
                                <YAxis dataKey="category" type="category" width={80} />
                                <Tooltip
                                    formatter={(value: any) => [`${value}%`, 'Percentage']}
                                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                                />
                                <Bar dataKey="value" fill="hsl(var(--chart-2))" radius={[0, 8, 8, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Orders */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Recent Orders</CardTitle>
                            <CardDescription>Latest orders from your customers</CardDescription>
                        </div>
                        <Button variant="outline" size="sm">
                            View All
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <ShoppingCart className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{order.customer}</p>
                                        <p className="text-sm text-muted-foreground">{order.id}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="font-medium">${order.amount.toLocaleString('en-US')}</p>
                                        <p className="text-sm text-muted-foreground">{order.date}</p>
                                    </div>
                                    <Badge
                                        variant={order.status === 'completed' ? 'default' :
                                            order.status === 'processing' ? 'secondary' : 'outline'}
                                    >
                                        {order.status}
                                    </Badge>
                                    <Button variant="ghost" size="sm">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest system activities</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { icon: Users, text: "New user registered", time: "2 minutes ago", color: "text-blue-600" },
                                { icon: ShoppingCart, text: "New order received", time: "5 minutes ago", color: "text-green-600" },
                                { icon: Package, text: "Product added to inventory", time: "10 minutes ago", color: "text-purple-600" },
                                { icon: DollarSign, text: "Payment received", time: "15 minutes ago", color: "text-yellow-600" },
                                { icon: Activity, text: "System backup completed", time: "1 hour ago", color: "text-gray-600" },
                            ].map((activity, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.color} bg-opacity-10`}>
                                        <activity.icon className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{activity.text}</p>
                                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Stats</CardTitle>
                        <CardDescription>Important metrics at a glance</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                        <Users className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-sm font-medium">Active Sessions</span>
                                </div>
                                <span className="text-lg font-bold">247</span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                        <ShoppingCart className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-sm font-medium">Pending Orders</span>
                                </div>
                                <span className="text-lg font-bold">18</span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                                        <Package className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-sm font-medium">Low Stock Items</span>
                                </div>
                                <span className="text-lg font-bold">5</span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                        <TrendingUp className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-sm font-medium">Conversion Rate</span>
                                </div>
                                <span className="text-lg font-bold">3.2%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
