"use client";

import React, { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, createSortableColumn } from "@/components/organisms/@tanstack-react-table/data-table";
import { DataTableQuery } from "@/types/tanstack-table";

interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}

const columns: ColumnDef<Post>[] = [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ getValue }) => <div className="font-mono">{getValue() as number}</div>,
    },
    createSortableColumn<Post>("title", "Title", "title", ({ getValue }) => (
        <div className="font-medium truncate max-w-[300px]">{getValue() as string}</div>
    )),
    {
        accessorKey: "body",
        header: "Content",
        cell: ({ getValue }) => <div className="text-muted-foreground truncate max-w-[400px]">{getValue() as string}</div>,
    },
];

export default function ExamplePage() {
    const [data, setData] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [queryOptions, setQueryOptions] = useState<DataTableQuery>({
        page: 1,
        limit: 10,
        offset: 0,
        totalPage: 10,
        lastPage: 10,
        search: "",
    });

    const fetchData = async (page: number, limit: number, search: string = "") => {
        setLoading(true);
        try {
            // JSONPlaceholder uses _page and _limit for pagination, and q for global search
            const response = await fetch(
                `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}${search ? `&q=${search}` : ""}`
            );
            const result = await response.json();

            // Get total count from header if available
            const totalCount = parseInt(response.headers.get("x-total-count") || "100", 10);
            const lastPage = Math.ceil(totalCount / limit);

            setData(result);
            setQueryOptions(prev => ({
                ...prev,
                page,
                limit,
                search,
                totalPage: lastPage,
                lastPage: lastPage,
            }));
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(queryOptions.page, queryOptions.limit, queryOptions.search);
    }, [queryOptions.page, queryOptions.limit, queryOptions.search]);

    const handlePageChange = (newPage: number) => {
        setQueryOptions(prev => ({ ...prev, page: newPage }));
    };

    const handleSearchChange = (newSearch: string) => {
        console.log("[Demo] Search changed to:", newSearch);
        // Reset to page 1 when search changes
        setQueryOptions(prev => ({ ...prev, search: newSearch, page: 1 }));
    };

    return (
        <div className="container mx-auto py-10 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Server-Side Pagination Demo</h1>
                <p className="text-muted-foreground">
                    This table fetches data from a public API (JSONPlaceholder) using server-side pagination and search.
                </p>
            </div>

            <DataTable
                tableName="serverSideDemo"
                columns={columns}
                data={data}
                isLoading={loading}
                enablePagination={true}
                pageSize={queryOptions.limit}
                queryOptions={queryOptions}
                onPageChange={handlePageChange}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Search entire API (titles, body)..."
                isStriped
            />

            <div className="bg-muted p-4 rounded-md">
                <h3 className="font-semibold mb-2">How it works:</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                    <li>The <code>DataTable</code> receives <code>queryOptions</code>, which triggers <b>manual pagination</b> mode.</li>
                    <li>When you click "Next", "Previous", or enter a page Number, <code>onPageChange</code> is called.</li>
                    <li>The parent component updates its state and triggers a new <code>fetch</code> request to the API.</li>
                    <li>The <code>isLoading</code> prop handles the loading indicator while fetching.</li>
                </ul>
            </div>
        </div>
    );
}
