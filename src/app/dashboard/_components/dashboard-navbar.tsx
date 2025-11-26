"use client";

import { useEffect, useState } from "react";
// import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { User, Settings, LogOut, Users } from "lucide-react";

export function DashboardNavbar() {
    const [mounted, setMounted] = useState(false);

    // const { data: session } = useSession();
    // const user = session?.user;

    // useEffect(() => {
    //     if (!user) return;
    //     console.log("User session:", user);
    // }, [user]);

    // useEffect(() => {
    //     setMounted(true);
    // }, []);

    // if (!mounted) {
    //     return <div className="h-16 w-full bg-gray-200 animate-pulse" />;
    // }

    return (
        <></>
        // <nav className="flex justify-between items-center border-b py-4 px-4">
        //     {/* Sidebar Trigger */}
        //     <SidebarTrigger />

        //     {/* User Dropdown */}
        //     {user ? (
        //         <DropdownMenu>
        //             <DropdownMenuTrigger asChild>
        //                 <Button
        //                     variant="ghost"
        //                     className="flex items-center gap-2 px-2 py-1"
        //                 >
        //                     <Avatar className="w-8 h-8">
        //                         <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
        //                         <AvatarFallback>{user.name?.charAt(0).toUpperCase() ?? "?"}</AvatarFallback>
        //                     </Avatar>
        //                     <span className="flex flex-col text-left">
        //                         <span className="font-semibold text-sm">{user.name}</span>
        //                         <span className="text-xs text-muted-foreground capitalize">{user.role ?? "user"}</span>
        //                     </span>
        //                 </Button>
        //             </DropdownMenuTrigger>

        //             <DropdownMenuContent align="end" className="w-48">
        //                 <DropdownMenuLabel>Account</DropdownMenuLabel>

        //                 <DropdownMenuItem>
        //                     <User className="mr-2 w-4 h-4" />
        //                     Profile
        //                 </DropdownMenuItem>

        //                 <DropdownMenuItem>
        //                     <Settings className="mr-2 w-4 h-4" />
        //                     Settings
        //                 </DropdownMenuItem>

        //                 <DropdownMenuItem>
        //                     <Users className="mr-2 w-4 h-4" />
        //                     HR
        //                 </DropdownMenuItem>

        //                 <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/auth/login" })}>
        //                     <LogOut className="mr-2 w-4 h-4" />
        //                     Logout
        //                 </DropdownMenuItem>
        //             </DropdownMenuContent>
        //         </DropdownMenu>
        //     ) : (
        //         <Button variant="outline" disabled>
        //             Loading...
        //         </Button>
        //     )}
        // </nav>
    );
}
