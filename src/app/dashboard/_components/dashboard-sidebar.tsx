"use client";

import { useState } from "react";
import { Calendar, Database, FileText, FolderTree, Home, Inbox, Package, Settings, ShoppingCart, Users, ChevronDown, ChevronRight, Building2, ChevronUp, Building, Factory, BarChart3 } from "lucide-react";
import { FaRocket, FaSatellite, FaGlobe, FaBolt, FaSpaceShuttle, FaSatelliteDish, FaUserAstronaut } from "react-icons/fa";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarHeader,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useSidebar } from "@/components/ui/sidebar";

interface MenuItem {
    title: string;
    url?: string;
    icon: React.ComponentType<any>;
    badge?: string;
    children?: MenuItem[];
}

interface Company {
    id: number;
    name: string;
    code: string;
    icon: React.ComponentType<any>;
}

// Company data
const companies: Company[] = [
    { id: 1, name: "NovaFlare Corp", code: "NOVA-01", icon: FaRocket },
    { id: 2, name: "Stellar Dynamics", code: "STEL-02", icon: FaSatellite },
    { id: 3, name: "Cosmic Systems", code: "COSM-03", icon: FaGlobe },
    { id: 4, name: "Galaxy Tech", code: "GALX-04", icon: FaBolt },
    { id: 5, name: "SpaceX Division", code: "SPCX-05", icon: FaSpaceShuttle },
    { id: 6, name: "Orbital Station", code: "ORBT-06", icon: FaSatelliteDish },
];

// Menu items grouped by sections
export const main_menu_items: MenuItem[] = [
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
];

export const master_menu_items: MenuItem[] = [
    {
        title: "Users",
        url: "/dashboard/users",
        icon: Users,
    },
    {
        title: "Inventory",
        url: "/dashboard/inventory",
        icon: Package,
    }
];

export const analytics_menu_items: MenuItem[] = [
    {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: BarChart3,
    },
    {
        title: "Orders",
        url: "/dashboard/orders",
        icon: ShoppingCart,
        children: [
            {
                title: "Order List",
                url: "/dashboard/orders/list",
                icon: ShoppingCart,
            },
            {
                title: "Pending Orders",
                url: "/dashboard/orders/pending",
                icon: ShoppingCart,
                badge: "5",
            },
            {
                title: "Completed Orders",
                url: "/dashboard/orders/completed",
                icon: ShoppingCart,
            },
        ],
    },
    {
        title: "Reports",
        url: "/dashboard/reports",
        icon: FileText,
        children: [
            {
                title: "Sales Report",
                url: "/dashboard/reports/sales",
                icon: FileText,
            },
            {
                title: "Financial Report",
                url: "/dashboard/reports/financial",
                icon: FileText,
            },
        ],
    },
];

export const settings_menu_items: MenuItem[] = [
    {
        title: "Profile",
        url: "/dashboard/profile",
        icon: Users,
    },
    {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
        children: [
            {
                title: "General",
                url: "/dashboard/settings/general",
                icon: Settings,
            },
            {
                title: "Security",
                url: "/dashboard/settings/security",
                icon: Settings,
            },
            {
                title: "Appearance",
                url: "/dashboard/settings/appearance",
                icon: Settings,
            },
        ],
    },
];

const MenuItemComponent = ({ item, level = 0, openItems, toggleItem, handleMenuClick }: {
    item: MenuItem;
    level: number;
    openItems: Set<string>;
    toggleItem: (key: string) => void;
    handleMenuClick: (url?: string) => void;
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
                                            handleMenuClick={handleMenuClick}
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
                    <Link href={item.url ?? '#'} onClick={() => handleMenuClick(item.url)}>
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
    const [selectedCompany, setSelectedCompany] = useState<Company>(companies[0]); // Novaflare Corp - logged-in user company
    const { isMobile, setOpenMobile } = useSidebar();

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

    const handleMenuClick = (url?: string) => {
        if (url && isMobile) {
            setOpenMobile(false);
        }
    };

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-3 p-4">
                    {/* <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                        <selectedCompany.icon className="h-5 w-5 text-primary-foreground" />
                    </div> */}
                    <Select value={selectedCompany.id.toString()} onValueChange={(value) => {
                        const company = companies.find(c => c.id.toString() === value);
                        if (company) setSelectedCompany(company);
                    }}>
                        <SelectTrigger className="w-full h-10 text-sm bg-transparent border-0 shadow-none focus:ring-0 outline-none!">
                            <div className="flex items-center justify-between gap-6 pe-3">
                                <selectedCompany.icon className="h-[200px] w-[200px]" />
                                <span className="font-medium text-[20px] align-middle">{selectedCompany.name}</span>
                            </div>
                        </SelectTrigger>
                        <SelectContent className="bg-background border-border">
                            {companies.map((company) => (
                                <SelectItem key={company.id} value={company.id.toString()}>
                                    <div className="flex items-center gap-4 p-3">
                                        <company.icon className="h-8 w-8" />
                                        <span>{company.name}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {main_menu_items.map((item) => (
                                <MenuItemComponent
                                    key={`${item.title}-0`}
                                    item={item}
                                    level={0}
                                    openItems={openItems}
                                    toggleItem={toggleItem}
                                    handleMenuClick={handleMenuClick}
                                />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Master Data</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {master_menu_items.map((item) => (
                                <MenuItemComponent
                                    key={`${item.title}-0`}
                                    item={item}
                                    level={0}
                                    openItems={openItems}
                                    toggleItem={toggleItem}
                                    handleMenuClick={handleMenuClick}
                                />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Analytics</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {analytics_menu_items.map((item) => (
                                <MenuItemComponent
                                    key={`${item.title}-0`}
                                    item={item}
                                    level={0}
                                    openItems={openItems}
                                    toggleItem={toggleItem}
                                    handleMenuClick={handleMenuClick}
                                />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Settings</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {settings_menu_items.map((item) => (
                                <MenuItemComponent
                                    key={`${item.title}-0`}
                                    item={item}
                                    level={0}
                                    openItems={openItems}
                                    toggleItem={toggleItem}
                                    handleMenuClick={handleMenuClick}
                                />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
