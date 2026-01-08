"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { User, Settings, LogOut, Users, Search, ChevronRight } from "lucide-react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Input } from "@/components/ui/input";
import { Bell, Check, X, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { menu_items } from "./dashboard-sidebar";
import { Badge } from "@/components/ui/badge";

// Define interfaces for better type safety
interface MenuItem {
    title: string;
    url?: string;
    icon: React.ComponentType<any>;
    children?: MenuItem[];
    badge?: string;
}

interface MenuItemFlattened extends MenuItem {
    breadcrumb: string;
    level: number;
    searchText: string;
}

interface Notification {
    id: number;
    title: string;
    description: string;
    time: string;
    read: boolean;
}

export function DashboardNavbar() {
    // const [mounted, setMounted] = useState(false);

    const { data: session } = useSession();
    const user = session?.user;

    useEffect(() => {
        if (!user) return;
        console.log("User session:", user);
    }, [user]);

    // useEffect(() => {
    //     // schedule update asynchronously to avoid calling setState synchronously in the effect
    //     const t = setTimeout(() => setMounted(true), 0);
    //     return () => clearTimeout(t);
    // }, []);

    // if (!mounted) {
    //     return <div className="h-16 w-full bg-gray-200 animate-pulse" />;
    // }



    return (
        <nav className="flex justify-between items-center border-b py-4 px-4">
            {/* Sidebar Trigger */}
            <SidebarTrigger />
            <SearchMenuInput />
            {user ? (
                <div className="flex gap-4 justify-between">
                    <AnimatedThemeToggler />
                    <NotificationButton />
                    {/* User Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="flex items-center gap-2 px-2 py-1 hover:bg-transparent"
                            >
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
                                    <AvatarFallback>{user.name?.charAt(0).toUpperCase() ?? "?"}</AvatarFallback>
                                </Avatar>
                                <span className="flex flex-col text-left">
                                    <span className="font-semibold text-sm">{user.name}</span>
                                    <span className="text-xs text-muted-foreground capitalize">{user.role ?? "user"}</span>
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Account</DropdownMenuLabel>

                            <DropdownMenuItem>
                                <User className="mr-2 w-4 h-4" />
                                Profile
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Settings className="mr-2 w-4 h-4" />
                                Settings
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Users className="mr-2 w-4 h-4" />
                                HR
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/auth/login" })}>
                                <LogOut className="mr-2 w-4 h-4" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ) : (
                <Button variant="outline" disabled>
                    Loading...
                </Button>
            )}
        </nav>
    );
}

const SearchMenuInput = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Flatten menu items untuk search
    const flattenMenuItems = (items: MenuItem[], parentTitle: string = '', level: number = 0): MenuItemFlattened[] => {
        let flattened: MenuItemFlattened[] = [];

        items.forEach(item => {
            const breadcrumb = parentTitle ? `${parentTitle} > ${item.title}` : item.title;

            if (item.url) {
                flattened.push({
                    ...item,
                    breadcrumb,
                    level,
                    searchText: breadcrumb.toLowerCase(),
                });
            }

            if (item.children) {
                flattened = [
                    ...flattened,
                    ...flattenMenuItems(item.children, breadcrumb, level + 1),
                ];
            }
        });

        return flattened;
    };

    const allMenuItems = flattenMenuItems(menu_items);

    const filteredItems = useMemo(() => {
        if (searchQuery.trim() === '') {
            return allMenuItems.slice(0, 8); // Show first 8 items
        } else {
            return allMenuItems.filter(item =>
                item.searchText.includes(searchQuery.toLowerCase())
            );
        }
    }, [searchQuery, allMenuItems]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                !inputRef.current?.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
            setIsOpen(true);
            return;
        }

        if (!isOpen) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < filteredItems.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
                break;
            case 'Enter':
                e.preventDefault();
                if (filteredItems[selectedIndex]) {
                    handleItemClick(filteredItems[selectedIndex]);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                inputRef.current?.blur();
                break;
        }
    };

    const handleItemClick = (item: MenuItemFlattened) => {
        console.log('Navigating to:', item.url);
        setSearchQuery('');
        setIsOpen(false);
        inputRef.current?.blur();
    };

    const getLevelColor = (level: number) => {
        switch (level) {
            case 0: return 'text-blue-600 bg-blue-50';
            case 1: return 'text-purple-600 bg-purple-50';
            case 2: return 'text-green-600 bg-green-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getLevelBorder = (level: number) => {
        switch (level) {
            case 0: return 'border-l-4 border-l-blue-500';
            case 1: return 'border-l-4 border-l-purple-500';
            case 2: return 'border-l-4 border-l-green-500';
            default: return 'border-l-4 border-l-gray-500';
        }
    };

    return (
        <div className="relative w-1/3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Search menu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    className="w-full border-0 outline-0 pl-10 pr-10"
                />
                {searchQuery && (
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            inputRef.current?.focus();
                        }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl leading-none"
                    >
                        ×
                    </button>
                )}
            </div>

            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-xl z-50 overflow-hidden"
                >
                    {filteredItems.length > 0 ? (
                        <div className="max-h-[420px] overflow-y-auto">
                            <ul className="py-1">
                                {filteredItems.map((item, index) => {
                                    const Icon = item.icon;
                                    const breadcrumbParts = item.breadcrumb.split(' > ');

                                    return (
                                        <li
                                            key={`${item.url}-${index}`}
                                            onClick={() => handleItemClick(item)}
                                            onMouseEnter={() => setSelectedIndex(index)}
                                            className={`
                        flex items-start gap-3 px-4 py-3 cursor-pointer transition-all
                        ${getLevelBorder(item.level)}
                        ${index === selectedIndex
                                                    ? getLevelColor(item.level)
                                                    : 'hover:bg-gray-50 text-gray-700'
                                                }
                      `}
                                        >
                                            <div className={`
                        p-2 rounded-lg transition-colors
                        ${index === selectedIndex
                                                    ? 'bg-white shadow-sm'
                                                    : 'bg-gray-100'
                                                }
                      `}>
                                                <Icon className="h-4 w-4" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="text-sm font-semibold truncate">
                                                        {item.title}
                                                    </p>
                                                    {item.badge && (
                                                        <Badge variant="destructive" className="text-xs h-5">
                                                            {item.badge}
                                                        </Badge>
                                                    )}
                                                    {item.level > 0 && (
                                                        <Badge variant="outline" className="text-xs h-5">
                                                            Level {item.level + 1}
                                                        </Badge>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    {breadcrumbParts.map((part, idx) => (
                                                        <div key={idx}>
                                                            {idx > 0 && <ChevronRight className="h-3 w-3" />}
                                                            <span className="truncate">{part}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <p className="text-xs text-gray-400 mt-1 font-mono">
                                                    {item.url}
                                                </p>
                                            </div>

                                            {index === selectedIndex && (
                                                <div className="flex items-center gap-1 text-xs text-gray-400 bg-white px-2 py-1 rounded">
                                                    <span>↵</span>
                                                </div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ) : (
                        <div className="px-4 py-12 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                <Search className="h-8 w-8 text-gray-300" />
                            </div>
                            <p className="text-sm font-medium text-gray-700">No results found</p>
                            <p className="text-xs text-gray-500 mt-1">
                                Try searching with different keywords
                            </p>
                        </div>
                    )}

                    <div className="border-t bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-2.5">
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3 text-gray-600">
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">↑↓</kbd>
                                    Navigate
                                </span>
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">↵</kbd>
                                    Select
                                </span>
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">Esc</kbd>
                                    Close
                                </span>
                            </div>
                            <span className="text-gray-500">
                                {filteredItems.length} results
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const NotificationButton = () => {
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: 1,
            title: 'New message from John',
            description: 'Hey, how are you doing?',
            time: '5 min ago',
            read: false,
        },
        {
            id: 2,
            title: 'System update',
            description: 'Your system has been updated successfully',
            time: '1 hour ago',
            read: false,
        },
        {
            id: 3,
            title: 'New comment on your post',
            description: 'Sarah commented: "Great work!"',
            time: '2 hours ago',
            read: true,
        },
        {
            id: 4,
            title: 'Reminder',
            description: 'Meeting starts in 30 minutes',
            time: '3 hours ago',
            read: false,
        },
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id: number) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: number) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-semibold">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-4 py-2">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                    {notifications.length > 0 && (
                        <div className="flex gap-2">
                            {unreadCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs"
                                    onClick={markAllAsRead}
                                >
                                    <Check className="h-3 w-3 mr-1" />
                                    Mark all read
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs text-red-500 hover:text-red-600"
                                onClick={clearAll}
                            >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Clear
                            </Button>
                        </div>
                    )}
                </div>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[350px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <Bell className="h-12 w-12 text-gray-300 mb-2" />
                            <p className="text-sm text-gray-500">No notifications</p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className="flex flex-col items-start p-4 cursor-pointer focus:bg-gray-50 relative group"
                                onSelect={(e) => e.preventDefault()}
                            >
                                <div className="flex items-start justify-between w-full gap-2">
                                    <div
                                        className="flex-1"
                                        onClick={() => markAsRead(notification.id)}
                                    >
                                        <div className="flex items-center gap-2">
                                            {!notification.read && (
                                                <span className="h-2 w-2 rounded-full bg-blue-500" />
                                            )}
                                            <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                                {notification.title}
                                            </h4>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1 ml-4">
                                            {notification.description}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1 ml-4">
                                            {notification.time}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteNotification(notification.id);
                                        }}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            </DropdownMenuItem>
                        ))
                    )}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};