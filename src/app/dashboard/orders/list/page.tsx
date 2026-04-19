"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/organisms/@tanstack-react-table/data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Search,
    Plus,
    Edit,
    Trash2,
    MoreHorizontal,
    Eye,
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    Filter,
    Download
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Row } from "@tanstack/react-table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface Order {
    id: string;
    customer: string;
    product: string;
    quantity: number;
    price: number;
    total: number;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    date: string;
    email: string;
    phone: string;
    address: string;
    paymentMethod: string;
    trackingNumber?: string;
    notes?: string;
}

export default function OrderListPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
    });

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/orders');
            const result = await response.json();

            if (result.success) {
                setOrders(result.data.orders);
                setPagination(result.data.pagination);
            } else {
                setError('Failed to fetch orders');
            }
        } catch (err) {
            setError('Error loading orders');
        } finally {
            setLoading(false);
        }
    };

    const fetchOrdersPage = async (page: number) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/orders?page=${page}&limit=10`);
            const result = await response.json();

            if (result.success) {
                setOrders(result.data.orders);
                setPagination(result.data.pagination);
            } else {
                setError('Failed to fetch orders');
            }
        } catch (err) {
            setError('Error loading orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", icon: React.ReactNode }> = {
            pending: { variant: "outline", icon: <Clock className="h-3 w-3" /> },
            processing: { variant: "default", icon: <Package className="h-3 w-3" /> },
            shipped: { variant: "secondary", icon: <Truck className="h-3 w-3" /> },
            delivered: { variant: "default", icon: <CheckCircle className="h-3 w-3" /> },
            cancelled: { variant: "destructive", icon: <XCircle className="h-3 w-3" /> }
        };

        const config = variants[status] || variants.pending;

        return (
            <Badge variant={config.variant} className="flex items-center gap-1">
                {config.icon}
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const columns: ColumnDef<Order>[] = [
        {
            accessorKey: "id",
            header: "Order ID",
            cell: ({ row }) => (
                <div className="font-mono text-sm">{row.getValue("id")}</div>
            ),
        },
        {
            accessorKey: "customer",
            header: "Customer",
            cell: ({ row }) => {
                const customer = row.getValue("customer") as string;
                const email = row.original.email;
                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80`} />
                            <AvatarFallback>{customer.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-medium">{customer}</div>
                            <div className="text-sm text-muted-foreground">{email}</div>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "product",
            header: "Product",
            cell: ({ row }) => (
                <div className="max-w-[200px]">
                    <div className="font-medium">{row.getValue("product")}</div>
                    <div className="text-sm text-muted-foreground">Qty: {row.getValue("quantity")}</div>
                </div>
            ),
        },
        {
            accessorKey: "total",
            header: "Total",
            cell: ({ row }) => {
                const total = row.getValue("total") as number;
                return (
                    <div className="font-medium">
                        ${total.toLocaleString('en-US')}
                    </div>
                );
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => getStatusBadge(row.getValue("status")),
        },
        {
            accessorKey: "date",
            header: "Date",
            cell: ({ row }) => {
                const date = new Date(row.getValue("date") as string);
                return (
                    <div className="text-sm">
                        {date.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </div>
                );
            },
        },
        {
            accessorKey: "paymentMethod",
            header: "Payment",
            cell: ({ row }) => (
                <div className="text-sm">{row.getValue("paymentMethod")}</div>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => console.log("View order:", row.original.id)}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => console.log("Edit order:", row.original.id)}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    const handleRowClick = (row: Row<Order>) => {
        console.log("Row clicked:", row.original);
    };

    const handleRowSelectionChange = (selectedRows: Row<Order>[]) => {
        console.log("Row selection changed:", selectedRows);
    };

    const handleRowAction = (action: string, row: Row<Order>) => {
        console.log("Row action:", action, row.original);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Order List</h1>
                        <p className="text-muted-foreground">Manage all customer orders</p>
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
                <Card>
                    <CardHeader>
                        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Order List</h1>
                        <p className="text-muted-foreground">Manage all customer orders</p>
                    </div>
                </div>
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="text-red-500 mb-4">
                            <XCircle className="h-12 w-12" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Error Loading Orders</h3>
                        <p className="text-muted-foreground text-center mb-4">{error}</p>
                        <Button onClick={fetchOrders}>Try Again</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Order List</h1>
                    <p className="text-muted-foreground">Manage all customer orders</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                    </Button>
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Order
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orders.length}</div>
                        <p className="text-xs text-muted-foreground">All time orders</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {orders.filter(o => o.status === 'pending').length}
                        </div>
                        <p className="text-xs text-muted-foreground">Awaiting processing</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Processing</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {orders.filter(o => o.status === 'processing').length}
                        </div>
                        <p className="text-xs text-muted-foreground">In progress</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {orders.filter(o => o.status === 'delivered').length}
                        </div>
                        <p className="text-xs text-muted-foreground">Successfully delivered</p>
                    </CardContent>
                </Card>
            </div>

            {/* DataTable */}
            <Card>
                <CardHeader>
                    <CardTitle>All Orders</CardTitle>
                    <CardDescription>View and manage customer orders</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <DataTable
                        tableName="Orders"
                        columns={columns}
                        data={orders}
                        searchKey={["id", "customer", "product", "email"]}
                        searchPlaceholder="Search orders..."
                        enableRowSelection={true}
                        enableColumnVisibility={true}
                        enableSorting={true}
                        enableSearch={true}
                        enablePagination={true}
                        pageSize={10}
                        queryOptions={{
                            page: pagination.page,
                            limit: pagination.limit,
                            offset: (pagination.page - 1) * pagination.limit,
                            totalPage: pagination.totalPages,
                            lastPage: pagination.totalPages
                        }}
                        onPageChange={(newPage) => {
                            fetchOrdersPage(newPage);
                        }}
                        onRowClick={handleRowClick}
                        onRowSelectionChange={handleRowSelectionChange}
                        onRowAction={handleRowAction}
                        rowActions={[
                            {
                                label: "View Details",
                                value: "view",
                                icon: <Eye className="h-4 w-4" />,
                            },
                            {
                                label: "Edit Order",
                                value: "edit",
                                icon: <Edit className="h-4 w-4" />,
                            },
                            {
                                label: "Delete Order",
                                value: "delete",
                                icon: <Trash2 className="h-4 w-4" />,
                                variant: "destructive",
                            },
                        ]}
                        emptyMessage="No orders found."
                        isStriped={true}
                        isHoverable={true}
                        isStickyHeader={true}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
