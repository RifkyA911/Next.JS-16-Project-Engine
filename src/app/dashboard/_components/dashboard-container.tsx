"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface DashboardContainerProps {
    children: React.ReactNode;
}

export function DashboardContainer({ children }: DashboardContainerProps) {
    const pathname = usePathname();
    const segments = pathname?.split("/").filter(Boolean) || [];

    if (segments.length === 0) return null;

    // Build breadcrumb items
    const breadcrumbs = segments.map((segment, idx) => {
        const href = "/" + segments.slice(0, idx + 1).join("/");
        return {
            label: segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
            href,
            isLast: idx === segments.length - 1,
        };
    });

    return (
        <main className="flex-1 p-6" >
            <nav className="text-sm text-muted-foreground mb-4" aria-label="breadcrumb">
                <ol className="flex items-center space-x-1">
                    {breadcrumbs.map((item, idx) => (
                        <li key={idx} className="flex items-center">
                            {item.isLast ? (
                                <span className="font-medium">{item.label}</span>
                            ) : (
                                <Link href={item.href} className="hover:text-primary transition-colors">
                                    {item.label}
                                </Link>
                            )}
                            {idx < breadcrumbs.length - 1 && (
                                <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground" />
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
            <div> {children}</div>
        </main >
    );
}