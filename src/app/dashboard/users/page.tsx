// UsersList.tsx
"use client";
import {
    DataTable,
    createColumn,
    createSortableColumn,
    // createFilterableColumn,
} from "@/components/organisms/@tanstack-react-table/data-table";
import { useUsers, useUsersCustomApi } from "@/hooks/api/dashboard/use-users";
import { useReactTableStore } from "@/store/react-table-store";
import { User } from "@/types/dashboard/users-type";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

// Column definitions
const columns: ColumnDef<User>[] = [
    // ID column
    createColumn<User>("id", "ID", "id", ({ getValue }) => (
        <div className="font-mono text-sm">{getValue() as string}</div>
    )),

    // Name column with sorting
    createSortableColumn<User>(
        "name",
        "User Name",
        "name",
        ({ getValue }) => (
            <div className="font-medium">{getValue() as string}</div>
        )
    ),
    // Email column with sorting
    createSortableColumn<User>(
        "email",
        "Email",
        "email",
        ({ getValue }) => (
            <div className="text-sm text-gray-600">{getValue() as string}</div>
        )
    ),
    // Role column with sorting
    createSortableColumn<User>(
        "role",
        "Role",
        "role",
        ({ getValue }) => (
            <div className="text-sm capitalize">{getValue() as string}</div>
        )
    )
];

export default function UsersList() {
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<string>('asc');
    // const { data, error, isLoading } = useUsers();
    const { data, error, isLoading } = useUsersCustomApi(
        "https://simple-pagination-server-side.vercel.app",
        page, limit, search, sortBy, sortOrder
    );


    // const handleSubmit = (e: FormEvent) => {
    //     e.preventDefault();
    // const createUser = useApiMutation<User, { name: string; email: string }>("/api/users", "POST");

    // createUser.mutate({ name: "Rifky", email: "rifky@example.com" });
    // };


    const [selectedRows, setSelectedRows] = useState<Row<User>[]>([]);

    const originalData = useReactTableStore(state => state.originalData);

    // useEffect(() => {
    // 	console.log("Current tables state:", originalData);
    // }, [originalData]);

    useEffect(() => {
        const tables = useReactTableStore.getState().tables; // ambil snapshot sekali
        console.log("Current table names:", tables);
    }, []); // kosong → cuma jalan sekali

    const handleRowClick = (row: any) => {
        console.log("Row clicked:", row.original);
    };

    const handleRowAction = (action: string, row: any) => {
        console.log(`Action: ${action}`, row.original);

        switch (action) {
            case "view":
                alert(`Viewing User: ${row.original.name}`);
                break;
            case "edit":
                alert(`Editing User: ${row.original.name}`);
                break;
            case "delete":
                if (
                    confirm(
                        `Are you sure you want to delete ${row.original.name}?`
                    )
                ) {
                    alert(`Deleted User: ${row.original.name}`);
                }
                break;
        }
    };

    const handleRowSelectionChange = (rows: Row<User>[]) => {
        setSelectedRows(rows);
        console.log("Selected rows:", rows);
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {(error as Error).message}</p>;
    return (
        <div className="container mx-auto w-full p-4">
            <h2 className="text-xl font-semibold mb-4">Users Data Table (Server Side)</h2>
            {/* ------------------------- (Server Side) Basic Data Table -------------------------*/}
            <div className="space-y-2">
                <DataTable
                    // className="w-full"
                    isLoading={false}
                    tableName="UsersTable_1"
                    columns={columns}
                    data={data!.data ?? []}
                    searchKey={["name", "email"]}
                    searchPlaceholder="Search Users..."
                    enableRowSelection={true}
                    enableColumnVisibility={true}
                    enableSorting={true}
                    enableSearch={true}
                    enablePagination={true}
                    pageSize={limit}
                    // loading={true}
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
                            label: "Edit User",
                            value: "edit",
                            icon: <Edit className="h-4 w-4" />,
                        },
                        {
                            label: "Delete User",
                            value: "delete",
                            icon: <Trash2 className="h-4 w-4" />,
                            variant: "destructive",
                        },
                    ]}
                    emptyMessage="No Users found."
                    isStriped={true}
                    isHoverable={true}
                    isStickyHeader={true}
                />
            </div>
        </div>
    );
}
