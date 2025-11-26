import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Shield, Server, Ban, XCircle } from "lucide-react";
import Link from "next/link";
import { JSX } from "react";

const ERROR_MESSAGES: Record<
    string,
    { title: string; description: string; icon: JSX.Element }
> = {
    "400": {
        title: "Bad Request",
        description: "Permintaan tidak valid.",
        icon: <XCircle className="text-yellow-500 w-10 h-10" />,
    },
    "401": {
        title: "Unauthorized",
        description: "Kamu belum login.",
        icon: <Shield className="text-orange-500 w-10 h-10" />,
    },
    "403": {
        title: "Forbidden",
        description: "Akses ditolak. Kamu tidak punya izin.",
        icon: <Ban className="text-red-500 w-10 h-10" />,
    },
    "404": {
        title: "Not Found",
        description: "Halaman yang kamu cari tidak ditemukan.",
        icon: <AlertTriangle className="text-blue-500 w-10 h-10" />,
    },
    "500": {
        title: "Internal Server Error",
        description: "Terjadi kesalahan di server.",
        icon: <Server className="text-purple-500 w-10 h-10" />,
    },
};

export default function ErrorPage({ params }: { params: { code: string } }) {
    const error = ERROR_MESSAGES[params.code];
    if (!error) notFound();

    return (
        <main className="min-h-screen flex items-center justify-center bg-background p-6">
            <Card className="max-w-md w-full text-center">
                <CardHeader>
                    <div className="flex flex-col items-center space-y-2">
                        {error.icon}
                        <CardTitle className="text-3xl font-bold">{error.title}</CardTitle>
                        <p className="text-muted-foreground">{error.description}</p>
                    </div>
                </CardHeader>
                <CardContent>
                    <Link href="/dashboard">
                        <Button className="w-full mt-4">Kembali ke Dashboard</Button>
                    </Link>
                </CardContent>
            </Card>
        </main>
    );
}
