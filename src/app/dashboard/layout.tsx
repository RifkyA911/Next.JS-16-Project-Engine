"use server";

// app/dashboard/layout.tsx
import React from "react";
import { ReactQueryProvider } from "@/providers/react-query";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./_components/dashboard-sidebar";
import { DashboardContainer } from "./_components/dashboard-container";
import { DashboardNavbar } from "./_components/dashboard-navbar";

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
                <div className="d-flex flex-col w-full">
                    <DashboardNavbar />
                    <DashboardContainer>
                        <main>
                            {children}
                        </main>
                    </DashboardContainer>
                </div>
            </SidebarProvider>
        </ReactQueryProvider>
    );
}
