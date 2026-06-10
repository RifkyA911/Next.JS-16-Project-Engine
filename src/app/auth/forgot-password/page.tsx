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
import Navbar from "@/components/navbar";

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
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
            <Navbar />
            <div className="flex items-start justify-center pt-[5vh] pb-8 flex-1">
                <div className="w-full max-w-md px-4">
                    <Card className="shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 backdrop-blur-sm">
                        <CardHeader className="space-y-1 text-center pb-6">
                            <div className="mx-auto w-16 h-16 bg-linear-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                                <Mail className="h-8 w-8 text-white" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                                Forgot Password
                            </CardTitle>
                            <CardDescription className="text-slate-600 dark:text-slate-400">
                                Enter your email address and we'll send you a link to reset your password
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="pl-10 h-11 border-slate-300 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-11 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg transition-all duration-200 rounded-lg"
                                >
                                    {loading ? "Sending..." : "Send Reset Link"}
                                </Button>
                            </form>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-4 pt-6">
                            <Link
                                href="/auth/login"
                                className="flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
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
            </div>
        </div>
    );
}
