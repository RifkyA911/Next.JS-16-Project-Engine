"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ShimmerCard() {
    return (
        <div className="rounded-lg border p-6 space-y-4">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <div className="flex gap-2 pt-4">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
            </div>
        </div>
    );
}

export function ShimmerStatsCard() {
    return (
        <div className="rounded-lg border p-6 space-y-3">
            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-24" />
        </div>
    );
}

export function ShimmerTable() {
    return (
        <div className="rounded-lg border overflow-hidden">
            <div className="p-4 border-b space-y-3">
                <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
            <div className="divide-y">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="p-4 flex items-center gap-4">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                    </div>
                ))}
            </div>
        </div>
    );
}

const CHART_HEIGHTS = [45, 78, 92, 65, 88, 72, 95, 58, 83, 70, 90, 62];

export function ShimmerChart() {
    return (
        <div className="rounded-lg border p-6 space-y-4">
            <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32" />
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                </div>
            </div>
            <div className="h-64 flex items-center justify-center">
                <div className="w-full h-full flex gap-1 items-end">
                    {CHART_HEIGHTS.map((height, i) => (
                        <Skeleton
                            key={i}
                            className="flex-1"
                            style={{ height: `${height}%` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export function ShimmerList() {
    return (
        <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-lg border">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-2/3" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                </div>
            ))}
        </div>
    );
}

export function ShimmerGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <ShimmerCard key={i} />
            ))}
        </div>
    );
}

export function ShimmerDashboard() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <ShimmerStatsCard key={i} />
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ShimmerChart />
                <ShimmerChart />
            </div>
            <ShimmerTable />
        </div>
    );
}
