"use client";

import { useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { DataTable } from "@/components/organisms/@tanstack-react-table/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Package, TrendingUp, TrendingDown } from "lucide-react";

// Mock product data
const mockProducts = Array.from({ length: 150 }, (_, i) => ({
    id: `PRD-${String(i + 1).padStart(3, '0')}`,
    name: [
        "Laptop Pro 15\"", "iPhone 15 Pro", "iPad Air", "MacBook Air M2",
        "AirPods Pro", "Apple Watch Ultra", "iMac 24\"", "Mac Studio",
        "Magic Keyboard", "USB-C Cable", "Wireless Charger", "Screen Protector"
    ][i % 12] || `Product ${i + 1}`,
    category: ["Electronics", "Accessories", "Computers", "Mobile", "Audio"][i % 5],
    sku: `SKU-${String(i + 1).padStart(6, '0')}`,
    price: Math.floor(Math.random() * 2000) + 99,
    stock: Math.floor(Math.random() * 100) + 1,
    status: ["In Stock", "Low Stock", "Out of Stock"][i % 3],
    lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    supplier: ["TechCorp", "GlobalSupply", "ProDistributor", "DirectSource"][i % 4],
}));

// Table columns
const columns = [
    {
        accessorKey: "id",
        header: "ID",
        enableSorting: true,
    },
    {
        accessorKey: "name",
        header: "Product Name",
        enableSorting: true,
    },
    {
        accessorKey: "category",
        header: "Category",
        enableSorting: true,
        cell: (row: any) => (
            <Badge variant="secondary" className="text-xs">
                {row.getValue("category")}
            </Badge>
        ),
    },
    {
        accessorKey: "sku",
        header: "SKU",
        enableSorting: true,
    },
    {
        accessorKey: "price",
        header: "Price",
        enableSorting: true,
        cell: (row: any) => (
            <span className="font-medium">${row.getValue("price")?.toFixed(2)}</span>
        ),
    },
    {
        accessorKey: "stock",
        header: "Stock",
        enableSorting: true,
        cell: (row: any) => {
            const stock = row.getValue("stock");
            return (
                <div className="flex items-center gap-2">
                    <span className={stock <= 10 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}>
                        {stock}
                    </span>
                    {stock <= 10 && <TrendingDown className="h-4 w-4 text-red-500" />}
                    {stock > 50 && <TrendingUp className="h-4 w-4 text-green-500" />}
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        enableSorting: true,
        cell: (row: any) => {
            const status = row.getValue("status");
            return (
                <Badge
                    variant={status === "In Stock" ? "default" : status === "Low Stock" ? "secondary" : "destructive"}
                    className="text-xs"
                >
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: "supplier",
        header: "Supplier",
        enableSorting: true,
    },
    {
        accessorKey: "lastUpdated",
        header: "Last Updated",
        enableSorting: true,
    },
];

export default function ProductInventory() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');

    // Simulate API data
    const data = {
        data: mockProducts,
        pagination: {
            total: mockProducts.length,
            totalPages: Math.ceil(mockProducts.length / limit),
            currentPage: page,
            hasNext: page < Math.ceil(mockProducts.length / limit),
            hasPrev: page > 1,
        },
    };

    const handleRowClick = (row: any) => {
        console.log('Product clicked:', row);
    };

    return (
        <div className="container mx-auto p-6 max-w-[1440px]">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Product Inventory</h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-2">
                            Manage your product inventory with real-time stock tracking
                        </p>
                    </div>
                    <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Product
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mockProducts.length}</div>
                            <p className="text-xs text-muted-foreground">
                                +2% from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {mockProducts.filter(p => p.status === "In Stock").length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                +5% from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                            <TrendingDown className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">
                                {mockProducts.filter(p => p.status === "Low Stock").length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                -1% from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                            <TrendingDown className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {mockProducts.filter(p => p.status === "Out of Stock").length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                +1% from last month
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button variant="outline" className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filters
                    </Button>
                </div>

                {/* Data Table */}
                <Card>
                    <CardContent className="p-0">
                        <DataTable
                            tableName="ProductsTable"
                            columns={columns}
                            data={data.data}
                            searchKey={["name", "category", "sku", "supplier"]}
                            searchPlaceholder="Search products..."
                            enableRowSelection={true}
                            enableColumnVisibility={true}
                            enableSorting={true}
                            enableSearch={true}
                            enablePagination={true}
                            pageSize={limit}
                            onRowClick={handleRowClick}
                        />
                    </CardContent>
                </Card>

                {/* Pagination Info */}
                <div className="flex justify-between items-center text-sm text-slate-600 dark:text-slate-400">
                    <span>
                        Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, data.pagination.total)} of {data.pagination.total} products
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(page - 1)}
                            disabled={!data.pagination.hasPrev}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(page + 1)}
                            disabled={!data.pagination.hasNext}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
