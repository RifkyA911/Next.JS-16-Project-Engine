import { NextRequest, NextResponse } from "next/server";
import { mockOrders } from "@/lib/mock-orders-data";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "date";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const status = searchParams.get("status") || "";

    // Filter orders based on search and status
    let filteredOrders = mockOrders;
    
    if (search) {
      filteredOrders = mockOrders.filter(order =>
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.customer.toLowerCase().includes(search.toLowerCase()) ||
        order.product.toLowerCase().includes(search.toLowerCase()) ||
        order.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (status) {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }

    // Sort orders
    filteredOrders.sort((a, b) => {
      const aValue = (a as any)[sortBy];
      const bValue = (b as any)[sortBy];
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue < bValue ? 1 : -1;
      }
      
      return (aValue || 0) < (bValue || 0) ? 1 : -1;
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        orders: paginatedOrders,
        pagination: {
          total: filteredOrders.length,
          page,
          limit,
          totalPages: Math.ceil(filteredOrders.length / limit),
          hasNext: endIndex < filteredOrders.length,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
