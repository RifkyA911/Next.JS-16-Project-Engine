"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface DashboardPageProps {
    propName: string;
}

export default function DashboardPage({ propName }: DashboardPageProps) {
    const [items, setItems] = useState([
        { name: "CPU Usage", value: 0, unit: "%" },
        { name: "Memory Usage", value: 0, unit: "%" },
        { name: "Disk Space", value: 0, unit: "%" },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setItems((prevItems) =>
                prevItems.map((item) => ({
                    ...item,
                    value: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                })))
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    const cards = items.map((item, index) => (
        <Card key={index} className="mb-4">
            <CardHeader>
                <CardTitle>{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between ">
                    <div className="text-2xl">{item.value}</div>
                    <div className="text-sm">{item.unit}</div>
                </div>
            </CardContent>
        </Card>
    ));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards}
        </div>
    );
}
