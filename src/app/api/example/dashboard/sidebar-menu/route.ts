import { NextResponse } from "next/server";

type MenuItem = {
  title: string;
  url?: string;
  icon: string;
  badge?: string;
  children?: MenuItem[];
};

const menu_items: MenuItem[] = [
  {
    title: "Home",
    url: "/dashboard",
    icon: "Home",
  },
  {
    title: "Inbox",
    url: "/dashboard/inbox",
    icon: "Inbox",
    badge: "3",
  },
  {
    title: "Calendar",
    url: "/dashboard/calendar",
    icon: "Calendar",
  },
  {
    title: "Master",
    icon: "Database",
    children: [
      {
        title: "Users Management",
        url: "/dashboard/master/users",
        icon: "Users",
        children: [
          {
            title: "User List",
            url: "/dashboard/master/users/list",
            icon: "Users",
          },
          {
            title: "User Roles",
            url: "/dashboard/master/users/roles",
            icon: "Users",
          },
          {
            title: "Permissions",
            url: "/dashboard/master/users/permissions",
            icon: "Users",
          },
        ],
      },
      {
        title: "Products",
        url: "/dashboard/master/products",
        icon: "Package",
        children: [
          {
            title: "Product List",
            url: "/dashboard/master/products/list",
            icon: "Package",
          },
          {
            title: "Categories",
            url: "/dashboard/master/products/categories",
            icon: "FolderTree",
          },
          {
            title: "Inventory",
            url: "/dashboard/master/products/inventory",
            icon: "Package",
          },
        ],
      },
      {
        title: "Orders",
        url: "/dashboard/master/orders",
        icon: "ShoppingCart",
        children: [
          {
            title: "Order List",
            url: "/dashboard/master/orders/list",
            icon: "ShoppingCart",
          },
          {
            title: "Pending Orders",
            url: "/dashboard/master/orders/pending",
            icon: "ShoppingCart",
            badge: "5",
          },
          {
            title: "Completed Orders",
            url: "/dashboard/master/orders/completed",
            icon: "ShoppingCart",
          },
        ],
      },
      {
        title: "Reports",
        url: "/dashboard/master/reports",
        icon: "FileText",
        children: [
          {
            title: "Sales Report",
            url: "/dashboard/master/reports/sales",
            icon: "FileText",
          },
          {
            title: "Financial Report",
            url: "/dashboard/master/reports/financial",
            icon: "FileText",
          },
        ],
      },
    ],
  },
  {
    title: "Search",
    url: "/dashboard/search",
    icon: "Search",
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: "Settings",
  },
];

export function GET() {
  return NextResponse.json({
    success: true,
    data: menu_items,
  });
}
