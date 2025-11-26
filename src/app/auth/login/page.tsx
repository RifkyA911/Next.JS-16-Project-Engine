"use client";

import { useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email: email.trim(),
                password: password.trim(),
                callbackUrl: "/dashboard",
            });

            if (res?.error) {
                console.error("Login error:", res.error);
                setMessage({ type: "error", text: "Email atau password salah" });

                return;
            }

            if (res?.url) router.push(res.url);

        } catch (err: any) {
            console.error("Login auth error:", err);
            setMessage({ type: "error", text: err.response?.data?.error || "Terjadi kesalahan saat login" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950">
            <Card className="w-full max-w-sm backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 shadow-lg border border-slate-200 dark:border-slate-800">
                <CardHeader>
                    <CardTitle className="text-center text-xl font-semibold">Login to your account</CardTitle>
                    <CardDescription className="text-center text-sm text-slate-500">
                        Masuk menggunakan akun Anda
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex flex-col gap-2">
                    {message && (
                        <Alert
                            variant={message.type === "error" ? "destructive" : "default"}
                            className="w-full text-center"
                        >
                            <AlertDescription>{message.text}</AlertDescription>
                        </Alert>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
