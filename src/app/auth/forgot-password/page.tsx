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
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            setMessage({
                type: "success",
                text: "Password reset link has been sent to your email address."
            });
        } catch (err: any) {
            console.error("Forgot password error:", err);
            setMessage({
                type: "error",
                text: "Failed to send reset link. Please try again."
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950">
            <Card className="w-full max-w-md backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 shadow-lg border border-slate-200 dark:border-slate-800">
                <CardHeader>
                    <CardTitle className="text-center text-xl font-semibold">Forgot Password</CardTitle>
                    <CardDescription className="text-center text-sm text-slate-500">
                        Enter your email address and we&apos;ll send you a link to reset your password.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? "Sending..." : "Send Reset Link"}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex flex-col gap-4">
                    <Link
                        href="/auth/login"
                        className="flex items-center text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Login
                    </Link>

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
