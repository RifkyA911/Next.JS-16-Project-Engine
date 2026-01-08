"use client";

import { useState } from "react";
import { Calendar, Database, FileText, FolderTree, Home, Inbox, Package, Settings, ShoppingCart, Users, ChevronDown } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Link from "next/link";

interface MenuItem {
    title: string;
    url?: string;
    icon: React.ComponentType<any>;
    badge?: string;
    children?: MenuItem[];
}

// Menu items.
export const menu_items: MenuItem[] = [
    {
        title: "Home",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Inbox",
        url: "/dashboard/inbox",
        icon: Inbox,
        badge: "3",
    },
    {
        title: "Calendar",
        url: "/dashboard/calendar",
        icon: Calendar,
    },
    {
        title: "Master",
        icon: Database,
        children: [
            {
                title: "User",
                url: "/dashboard/users",
                icon: Users,
            },
            {
                title: "Users Management",
                url: "/dashboard/master/users",
                icon: Users,
                children: [
                    {
                        title: "User List",
                        url: "/dashboard/master/users/list",
                        icon: Users,
                    },
                    {
                        title: "User Roles",
                        url: "/dashboard/master/users/roles",
                        icon: Users,
                    },
                    {
                        title: "Permissions",
                        url: "/dashboard/master/users/permissions",
                        icon: Users,
                    },
                ],
            },
            {
                title: "Products",
                url: "/dashboard/master/products",
                icon: Package,
                children: [
                    {
                        title: "Product List",
                        url: "/dashboard/master/products/list",
                        icon: Package,
                    },
                    {
                        title: "Categories",
                        url: "/dashboard/master/products/categories",
                        icon: FolderTree,
                    },
                    {
                        title: "Inventory",
                        url: "/dashboard/master/products/inventory",
                        icon: Package,
                    },
                ],
            },
        ],
    },
    {
        title: "Orders",
        url: "/dashboard/master/orders",
        icon: ShoppingCart,
        children: [
            {
                title: "Order List",
                url: "/dashboard/master/orders/list",
                icon: ShoppingCart,
            },
            {
                title: "Pending Orders",
                url: "/dashboard/master/orders/pending",
                icon: ShoppingCart,
                badge: "5",
            },
            {
                title: "Completed Orders",
                url: "/dashboard/master/orders/completed",
                icon: ShoppingCart,
            },
        ],
    },
    {
        title: "Reports",
        url: "/dashboard/master/reports",
        icon: FileText,
        children: [
            {
                title: "Sales Report",
                url: "/dashboard/master/reports/sales",
                icon: FileText,
            },
            {
                title: "Financial Report",
                url: "/dashboard/master/reports/financial",
                icon: FileText,
            },
        ],
    },
    {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
    },
];

const MenuItemComponent = ({ item, level = 0, openItems, toggleItem }: {
    item: MenuItem;
    level: number;
    openItems: Set<string>;
    toggleItem: (key: string) => void;
}) => {
    const key = `${item.title}-${level}`;
    const isOpen = openItems.has(key);
    const indent = level * 2; // 20px per level for better spacing

    if (item.children && item.children.length > 0) {
        return (
            <div className="relative">

                <Collapsible open={isOpen} onOpenChange={() => toggleItem(key)}>
                    <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton style={{ paddingLeft: `${indent + 8}px` }} className="relative">
                                {/* Connecting line for parent item */}
                                {level > 0 && (
                                    <div className="absolute left-0 top-1/2 w-4 h-px bg-border -translate-y-1/2" style={{ left: `${indent - 4}px` }} />
                                )}

                                <item.icon className="z-10" />
                                <span>{item.title}</span>
                                {item.badge && (
                                    <span className="ml-auto text-xs px-2 py-0.5 rounded bg-muted">
                                        {item.badge}
                                    </span>
                                )}
                                <ChevronDown className={`ml-auto transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div className="relative">
                                {/* Vertical line for nested items */}
                                <div className="absolute left-0 top-0 bottom-0 w-px bg-border" style={{ left: `${indent + 16}px` }} />
                                <SidebarMenu style={{ paddingLeft: `${indent + 20}px` }}>
                                    {item.children.map((child) => (
                                        <MenuItemComponent
                                            key={`${child.title}-${level + 1}`}
                                            item={child}
                                            level={level + 1}
                                            openItems={openItems}
                                            toggleItem={toggleItem}
                                        />
                                    ))}
                                </SidebarMenu>
                            </div>
                        </CollapsibleContent>
                    </SidebarMenuItem>
                </Collapsible>
            </div>
        );
    }

    return (
        <div className="relative">

            <SidebarMenuItem>
                <SidebarMenuButton asChild style={{ paddingLeft: `${indent + 8}px` }} className="relative">
                    <Link href={item.url ?? '#'}>
                        {/* Connecting line for child item */}
                        {level > 0 && (
                            <div className="absolute left-0 top-1/2 w-4 h-px bg-border -translate-y-1/2" style={{ left: `${indent - 4}px` }} />
                        )}

                        <item.icon className="z-10" />
                        <span>{item.title}</span>
                        {item.badge && (
                            <span className="ml-auto text-xs px-2 py-0.5 rounded bg-muted">
                                {item.badge}
                            </span>
                        )}
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </div>
    );
};

export function DashboardSidebar() {
    const [openItems, setOpenItems] = useState<Set<string>>(new Set());

    const toggleItem = (key: string) => {
        setOpenItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(key)) {
                newSet.delete(key);
            } else {
                newSet.add(key);
            }
            return newSet;
        });
    };

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menu_items.map((item) => (
                                <MenuItemComponent
                                    key={`${item.title}-0`}
                                    item={item}
                                    level={0}
                                    openItems={openItems}
                                    toggleItem={toggleItem}
                                />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}