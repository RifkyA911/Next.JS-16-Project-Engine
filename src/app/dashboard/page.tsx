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
    { category: "Electronics", value: 35, color: "bg-blue-500" },
    { category: "Clothing", value: 25, color: "bg-green-500" },
    { category: "Food", value: 20, color: "bg-yellow-500" },
    { category: "Books", value: 12, color: "bg-purple-500" },
    { category: "Other", value: 8, color: "bg-gray-500" },
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
                        <CardTitle>Revenue Overview</CardTitle>
                        <CardDescription>Monthly revenue for the last 6 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 flex items-end justify-between gap-2">
                            {monthlyData.map((item, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                    <div
                                        className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md transition-all duration-300 hover:from-blue-700 hover:to-blue-500"
                                        style={{ height: `${Math.max((item.revenue / 67000) * 100, 5)}%` }}
                                        title={`${item.month}: $${item.revenue.toLocaleString('en-US')}`}
                                    />
                                    <span className="text-xs text-muted-foreground">{item.month}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Category Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Category Distribution</CardTitle>
                        <CardDescription>Sales by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {categoryData.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded ${item.color}`} />
                                        <span className="text-sm font-medium">{item.category}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${item.color}`}
                                                style={{ width: `${item.value}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-muted-foreground w-8">{item.value}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                                        <p className="font-medium">${order.amount.toLocaleString()}</p>
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
                                { icon: ShoppingCart, text: "New order #ORD-006 placed", time: "5 minutes ago", color: "text-green-600" },
                                { icon: Package, text: "Product inventory updated", time: "15 minutes ago", color: "text-purple-600" },
                                { icon: DollarSign, text: "Payment received for #ORD-005", time: "1 hour ago", color: "text-yellow-600" },
                                { icon: Activity, text: "System backup completed", time: "2 hours ago", color: "text-gray-600" },
                            ].map((activity, index) => {
                                const Icon = activity.icon;
                                return (
                                    <div key={index} className="flex items-center gap-3">
                                        <Icon className={`h-4 w-4 ${activity.color}`} />
                                        <div className="flex-1">
                                            <p className="text-sm">{activity.text}</p>
                                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Frequently used actions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" className="h-20 flex flex-col gap-2">
                                <ShoppingCart className="h-6 w-6" />
                                <span className="text-sm">New Order</span>
                            </Button>
                            <Button variant="outline" className="h-20 flex flex-col gap-2">
                                <Package className="h-6 w-6" />
                                <span className="text-sm">Add Product</span>
                            </Button>
                            <Button variant="outline" className="h-20 flex flex-col gap-2">
                                <Users className="h-6 w-6" />
                                <span className="text-sm">Add User</span>
                            </Button>
                            <Button variant="outline" className="h-20 flex flex-col gap-2">
                                <Activity className="h-6 w-6" />
                                <span className="text-sm">View Report</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
