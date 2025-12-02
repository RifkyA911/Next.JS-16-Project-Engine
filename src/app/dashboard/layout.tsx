"use server";

// app/dashboard/layout.tsx
import React from "react";
import { ReactQueryProvider } from "@/providers/react-query";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./_components/dashboard-sidebar";
import { DashboardContainer } from "./_components/dashboard-container";
import { DashboardNavbar } from "./_components/dashboard-navbar";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // throw new Error("Test global error page");
    return (
        <ReactQueryProvider>
            <SidebarProvider>
                <DashboardSidebar />
                <div className="flex h-screen overflow-hidden w-full">
                    <div className="flex flex-col flex-1 min-w-0 ">
                        <SidebarTrigger />
                        <AnimatedThemeToggler />
                        <DashboardNavbar />
                        <DashboardContainer>
                            <main className="flex-1 overflow-auto p-4 min-w-0">
                                {children}
                            </main>
                        </DashboardContainer>
                    </div>
                </div>
            </SidebarProvider>
        </ReactQueryProvider>
    );
}
