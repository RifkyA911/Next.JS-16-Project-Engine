"use client";

import { useEffect, useState } from "react";
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
import { User, Settings, LogOut, Users } from "lucide-react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Input } from "@/components/ui/input";
import { Bell, Check, X, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export function DashboardNavbar() {
    const [mounted, setMounted] = useState(false);

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
            <Input type="text" placeholder="Search..." className="w-1/3 border-0 outline-0" />
            {user ? (
                <div className="flex gap-4 justify-between">
                    <AnimatedThemeToggler />
                    <NotificationButton />
                    {/* User Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="flex items-center gap-2 px-2 py-1"
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

const NotificationButton = () => {
    const [notifications, setNotifications] = useState([
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