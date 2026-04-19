import { NextRequest, NextResponse } from "next/server";
import { mockUsers } from "@/lib/mock-users-data";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "name";
    const sortOrder = searchParams.get("sortOrder") || "asc";

    // Filter users based on search
    let filteredUsers = mockUsers;
    if (search) {
      filteredUsers = mockUsers.filter(user =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase()) ||
        user.department?.toLowerCase().includes(search.toLowerCase()) ||
        user.role?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort users
    filteredUsers.sort((a, b) => {
      const aValue = a[sortBy as keyof typeof a];
      const bValue = b[sortBy as keyof typeof b];
      
      if (aValue === undefined || bValue === undefined) return 0;
      
      if (sortOrder === "desc") {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        users: paginatedUsers,
        pagination: {
          total: filteredUsers.length,
          page,
          limit,
          totalPages: Math.ceil(filteredUsers.length / limit),
          hasNext: endIndex < filteredUsers.length,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
