"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Search,
    Plus,
    Edit,
    Trash2,
    MoreHorizontal,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Shield,
    UserCheck
} from "lucide-react";
import {
    DataTable,
    createColumn,
    createSortableColumn,
} from "@/components/organisms/@tanstack-react-table/data-table";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Eye } from "lucide-react";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar: string;
    department: string;
    status: 'active' | 'inactive' | 'pending';
    joinDate: string;
    lastLogin: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<Row<User>[]>([]);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
    });

    // Fetch users from API
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/users');
            const result = await response.json();

            if (result.success) {
                // Use paginated data structure from API
                setUsers(result.data.users || []);
                setPagination(result.data.pagination);
            } else {
                console.error('Failed to fetch users:', result.error);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsersPage = async (page: number) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/users?page=${page}&limit=10`);
            const result = await response.json();

            if (result.success) {
                setUsers(result.data.users || []);
                setPagination(result.data.pagination);
            } else {
                console.error('Failed to fetch users:', result.error);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'inactive': return 'bg-gray-100 text-gray-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active': return <UserCheck className="h-4 w-4" />;
            case 'inactive': return <Shield className="h-4 w-4" />;
            case 'pending': return <Calendar className="h-4 w-4" />;
            default: return <Shield className="h-4 w-4" />;
        }
    };

    // DataTable columns
    const columns: ColumnDef<User>[] = [
        // Avatar and Name column
        createColumn<User>("name", "User", "name", ({ getValue, row }) => (
            <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={row.original.avatar} alt={getValue() as string} />
                    <AvatarFallback>{(getValue() as string).charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <div className="font-medium">{getValue() as string}</div>
                    <div className="text-sm text-gray-500">{row.original.email}</div>
                </div>
            </div>
        )),

        // Role column with sorting
        createSortableColumn<User>(
            "role",
            "Role",
            "role",
            ({ getValue }) => (
                <Badge variant={(getValue() as string) === 'admin' ? 'destructive' : 'secondary'}>
                    {getValue() as string}
                </Badge>
            )
        ),

        // Department column
        createColumn<User>("department", "Department", "department", ({ getValue }) => (
            <div className="text-sm">{getValue() as string}</div>
        )),

        // Status column
        createColumn<User>("status", "Status", "status", ({ getValue, row }) => (
            <Badge className={getStatusColor(getValue() as string)}>
                <div className="flex items-center gap-2">
                    {getStatusIcon(getValue() as string)}
                    <span className="capitalize">{getValue() as string}</span>
                </div>
            </Badge>
        )),

        // Join Date column
        createColumn<User>("joinDate", "Joined", "joinDate", ({ getValue }) => (
            <div className="text-sm text-gray-500">
                {new Date(getValue() as string).toLocaleDateString()}
            </div>
        )),

        // Last Login column
        createColumn<User>("lastLogin", "Last Login", "lastLogin", ({ getValue }) => (
            <div className="text-sm text-gray-500">
                {new Date(getValue() as string).toLocaleDateString()}
            </div>
        )),
    ];

    const handleRowClick = (row: Row<User>) => {
        console.log("Row clicked:", row.original);
    };

    const handleRowAction = (action: string, row: Row<User>) => {
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
        setSelectedUsers(rows);
        console.log("Selected rows:", rows);
    };

    if (loading) {
        return (
            <div className="flex-1 space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Users</h1>
                        <p className="text-muted-foreground">Manage users and their permissions</p>
                    </div>
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add User
                    </Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>All Users</CardTitle>
                        <CardDescription>Loading users...</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4 p-4 border-b">
                                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                                <div className="h-6 w-16 bg-gray-200 rounded"></div>
                                <div className="h-6 w-20 bg-gray-200 rounded"></div>
                                <div className="h-8 w-8 bg-gray-200 rounded"></div>
                            </div>
                            {[...Array(9)].map((_, index) => (
                                <div key={index} className="flex items-center space-x-4 p-4 border-b animate-pulse">
                                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                                    </div>
                                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                                    <div className="h-6 w-20 bg-gray-200 rounded"></div>
                                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Users Management</h1>
                <div className="flex items-center gap-4">
                    <Button onClick={fetchUsers} disabled={loading}>
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <div className="p-2 bg-blue-100 rounded-full">
                            <UserCheck className="h-4 w-4 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active</CardTitle>
                        <div className="p-2 bg-green-100 rounded-full">
                            <UserCheck className="h-4 w-4 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {users.filter(u => u.status === 'active').length}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inactive</CardTitle>
                        <div className="p-2 bg-gray-100 rounded-full">
                            <Shield className="h-4 w-4 text-gray-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {users.filter(u => u.status === 'inactive').length}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <div className="p-2 bg-yellow-100 rounded-full">
                            <Calendar className="h-4 w-4 text-yellow-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {users.filter(u => u.status === 'pending').length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* DataTable */}
            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>Manage and view all registered users</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <DataTable
                        tableName="Users"
                        columns={columns}
                        data={users}
                        searchKey={["name", "email", "role", "department"]}
                        searchPlaceholder="Search users..."
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
                            fetchUsersPage(newPage);
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
                        emptyMessage="No users found."
                        isStriped={true}
                        isHoverable={true}
                        isStickyHeader={true}
                    />
                </CardContent>
            </Card>

            {/* Actions */}
            {selectedUsers.length > 0 && (
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                    <span className="text-sm text-blue-800">
                        {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
                    </span>
                    <div className="flex gap-2 ml-auto">
                        <Button variant="outline" onClick={() => setSelectedUsers([])}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => setShowDeleteDialog(true)}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            {showDeleteDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''}? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={() => {
                                // Handle bulk delete here
                                console.log('Deleting users:', selectedUsers);
                                setShowDeleteDialog(false);
                                setSelectedUsers([]);
                            }}>
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
