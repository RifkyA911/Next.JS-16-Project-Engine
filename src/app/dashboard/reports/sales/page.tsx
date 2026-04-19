"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/organisms/@tanstack-react-table/data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Package,
    Users,
    Target,
    Download,
    Filter,
    Calendar,
    BarChart3,
    Award,
    ArrowUpRight,
    ArrowDownRight,
    Eye,
    MoreHorizontal
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Row } from "@tanstack/react-table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import {
    mockSalesData,
    monthlyRevenueData,
    categoryPerformanceData,
    regionalPerformanceData,
    topPerformersData
} from "@/lib/mock-sales-data";

interface SalesData {
    id: string;
    product: string;
    category: string;
    region: string;
    salesRep: string;
    unitsSold: number;
    unitPrice: number;
    totalRevenue: number;
    cost: number;
    profit: number;
    profitMargin: number;
    quarter: string;
    year: number;
    month: string;
}

export default function SalesReportPage() {
    const [salesData, setSalesData] = useState<SalesData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setSalesData(mockSalesData);
            setLoading(false);
        }, 1000);
    }, []);

    const getGrowthBadge = (growth: number) => {
        if (growth > 0) {
            return (
                <Badge variant="default" className="flex items-center gap-1 bg-green-100 text-green-800">
                    <ArrowUpRight className="h-3 w-3" />
                    +{growth}%
                </Badge>
            );
        } else if (growth < 0) {
            return (
                <Badge variant="destructive" className="flex items-center gap-1">
                    <ArrowDownRight className="h-3 w-3" />
                    {growth}%
                </Badge>
            );
        }
        return <Badge variant="outline">0%</Badge>;
    };

    const columns: ColumnDef<SalesData>[] = [
        {
            accessorKey: "product",
            header: "Product",
            cell: ({ row }) => (
                <div className="font-medium max-w-[200px]">
                    {row.getValue("product")}
                </div>
            ),
        },
        {
            accessorKey: "category",
            header: "Category",
            cell: ({ row }) => (
                <Badge variant="outline">{row.getValue("category")}</Badge>
            ),
        },
        {
            accessorKey: "region",
            header: "Region",
            cell: ({ row }) => (
                <div className="text-sm">{row.getValue("region")}</div>
            ),
        },
        {
            accessorKey: "salesRep",
            header: "Sales Rep",
            cell: ({ row }) => {
                const salesRep = row.getValue("salesRep") as string;
                return (
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={`https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80`} />
                            <AvatarFallback className="text-xs">{salesRep.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{salesRep}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: "unitsSold",
            header: "Units Sold",
            cell: ({ row }) => (
                <div className="text-sm font-medium">{row.getValue("unitsSold")}</div>
            ),
        },
        {
            accessorKey: "totalRevenue",
            header: "Revenue",
            cell: ({ row }) => {
                const revenue = row.getValue("totalRevenue") as number;
                return (
                    <div className="font-medium">
                        ${revenue.toLocaleString('en-US')}
                    </div>
                );
            },
        },
        {
            accessorKey: "profit",
            header: "Profit",
            cell: ({ row }) => {
                const profit = row.getValue("profit") as number;
                return (
                    <div className={`font-medium ${profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${profit.toLocaleString('en-US')}
                    </div>
                );
            },
        },
        {
            accessorKey: "profitMargin",
            header: "Margin",
            cell: ({ row }) => {
                const margin = row.getValue("profitMargin") as number;
                return (
                    <div className={`text-sm font-medium ${margin > 20 ? 'text-green-600' : margin > 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {margin.toFixed(1)}%
                    </div>
                );
            },
        },
        {
            accessorKey: "quarter",
            header: "Period",
            cell: ({ row }) => {
                const quarter = row.getValue("quarter") as string;
                const month = row.getValue("month") as string;
                return (
                    <div className="text-sm">
                        {quarter} {month}
                    </div>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log("View details:", row.original)}
                >
                    <Eye className="h-4 w-4" />
                </Button>
            ),
        },
    ];

    const handleRowClick = (row: Row<SalesData>) => {
        console.log("Row clicked:", row.original);
    };

    const handleRowSelectionChange = (selectedRows: Row<SalesData>[]) => {
        console.log("Row selection changed:", selectedRows);
    };

    const handleRowAction = (action: string, row: Row<SalesData>) => {
        console.log("Row action:", action, row.original);
    };

    const totalRevenue = salesData.reduce((sum, item) => sum + item.totalRevenue, 0);
    const totalProfit = salesData.reduce((sum, item) => sum + item.profit, 0);
    const totalUnits = salesData.reduce((sum, item) => sum + item.unitsSold, 0);
    const avgProfitMargin = salesData.length > 0 ? salesData.reduce((sum, item) => sum + item.profitMargin, 0) / salesData.length : 0;

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Sales Report</h1>
                        <p className="text-muted-foreground">Comprehensive sales analytics and insights</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader className="pb-2">
                                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Sales Report</h1>
                        <p className="text-muted-foreground">Comprehensive sales analytics and insights</p>
                    </div>
                </div>
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="text-red-500 mb-4">
                            <TrendingDown className="h-12 w-12" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Error Loading Sales Data</h3>
                        <p className="text-muted-foreground text-center mb-4">{error}</p>
                        <Button>Try Again</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Sales Report</h1>
                    <p className="text-muted-foreground">Comprehensive sales analytics and insights</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        Date Range
                    </Button>
                    <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                    </Button>
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
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
                                +12.5% from last period
                            </span>
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalProfit.toLocaleString('en-US')}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="flex items-center text-green-600">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                +8.3% from last period
                            </span>
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Units Sold</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUnits.toLocaleString('en-US')}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="flex items-center text-green-600">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                +15.2% from last period
                            </span>
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Profit Margin</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgProfitMargin.toFixed(1)}%</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="flex items-center text-red-600">
                                <ArrowDownRight className="h-3 w-3 mr-1" />
                                -2.1% from last period
                            </span>
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Monthly Revenue Trend */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Monthly Revenue Trend</CardTitle>
                        <CardDescription>Revenue performance over the last 12 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={monthlyRevenueData}>
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
                                    strokeWidth={2}
                                    dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Top Performers */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Performers</CardTitle>
                        <CardDescription>Best sales representatives this period</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topPerformersData.map((performer) => (
                                <div key={performer.rank} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${performer.rank === 1 ? 'bg-yellow-500 text-white' :
                                            performer.rank === 2 ? 'bg-gray-400 text-white' :
                                                performer.rank === 3 ? 'bg-orange-600 text-white' :
                                                    'bg-gray-200 text-gray-600'
                                            }`}>
                                            {performer.rank}
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">{performer.name}</div>
                                            <div className="text-xs text-muted-foreground">${performer.revenue.toLocaleString('en-US')}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium">${performer.commission.toLocaleString('en-US')}</div>
                                        <div className="text-xs text-muted-foreground">commission</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Category and Regional Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Performance */}
                <Card>
                    <CardHeader>
                        <CardTitle>Category Performance</CardTitle>
                        <CardDescription>Revenue by product category</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {categoryPerformanceData.map((category, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 rounded bg-blue-500" />
                                        <span className="text-sm font-medium">{category.category}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full bg-blue-500"
                                                style={{ width: `${(category.revenue / 300000) * 100}%` }}
                                            />
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-medium">${category.revenue.toLocaleString('en-US')}</div>
                                            <div className="text-xs">{getGrowthBadge(category.growth)}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Regional Performance */}
                <Card>
                    <CardHeader>
                        <CardTitle>Regional Performance</CardTitle>
                        <CardDescription>Revenue by geographic region</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {regionalPerformanceData.map((region, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 rounded bg-green-500" />
                                        <span className="text-sm font-medium">{region.region}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full bg-green-500"
                                                style={{ width: `${(region.revenue / 450000) * 100}%` }}
                                            />
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-medium">${region.revenue.toLocaleString('en-US')}</div>
                                            <div className="text-xs">{getGrowthBadge(region.growth)}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Sales Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Sales Details</CardTitle>
                    <CardDescription>Detailed breakdown of all sales transactions</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <DataTable
                        tableName="SalesReport"
                        columns={columns}
                        data={salesData}
                        searchKey={["product", "category", "region", "salesRep"]}
                        searchPlaceholder="Search sales data..."
                        enableRowSelection={true}
                        enableColumnVisibility={true}
                        enableSorting={true}
                        enableSearch={true}
                        enablePagination={true}
                        pageSize={10}
                        onRowClick={handleRowClick}
                        onRowSelectionChange={handleRowSelectionChange}
                        onRowAction={handleRowAction}
                        rowActions={[
                            {
                                label: "View Details",
                                value: "view",
                                icon: <Eye className="h-4 w-4" />,
                            },
                        ]}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
