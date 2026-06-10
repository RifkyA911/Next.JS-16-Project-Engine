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
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaEye, FaEyeSlash, FaShieldAlt, FaEnvelope, FaLock, FaGoogle, FaGithub, FaTwitter } from "react-icons/fa";
import { ReCAPTCHAWrapper } from "@/components/ui/recaptcha";
import Navbar from "@/components/navbar";
import { ShieldCheck, User } from "lucide-react";

export default function LoginPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const showDemoButtons = searchParams.get('demo') === 'true'
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (!recaptchaToken) {
                setMessage({ type: "error", text: "Please complete reCAPTCHA" });
                setLoading(false);
                return;
            }

            const res = await signIn("credentials", {
                redirect: false,
                email: email.trim(),
                password: password.trim(),
                recaptchaToken: recaptchaToken,
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
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
            <Navbar />
            <div className="flex items-start justify-center pt-[5vh] pb-8 flex-1">
                <div className="w-full max-w-md px-4">
                    <Card className="shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 backdrop-blur-sm">
                        <CardHeader className="space-y-1 text-center pb-6">
                            <div className="mx-auto w-16 h-16 bg-linear-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                                <FaShieldAlt className="h-8 w-8 text-white" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                                Welcome Back
                            </CardTitle>
                            <CardDescription className="text-slate-600 dark:text-slate-400">
                                Sign in to your account to continue
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <form onSubmit={handleLogin} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
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

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="pl-10 pr-10 h-11 border-slate-300 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <FaEyeSlash className="h-4 w-4" />
                                            ) : (
                                                <FaEye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <ReCAPTCHAWrapper
                                        onChange={(token: string) => setRecaptchaToken(token)}
                                        onExpired={() => setRecaptchaToken(null)}
                                        onError={() => setRecaptchaToken(null)}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-11 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg transition-all duration-200 rounded-lg"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Logging in...
                                        </div>
                                    ) : (
                                        "Sign In"
                                    )}
                                </Button>

                                {/* Demo Account Buttons */}
                                {showDemoButtons && (
                                    <div className="space-y-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full h-11 border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-400 text-blue-700 dark:text-blue-400 font-medium transition-all duration-200 rounded-lg"
                                            onClick={() => {
                                                setEmail("admin@example.com");
                                                setPassword("123456");
                                            }}
                                        >
                                            <ShieldCheck className="h-4 w-4 mr-2" />
                                            Admin Demo (admin@example.com / 123456)
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full h-11 border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-400 text-purple-700 dark:text-purple-400 font-medium transition-all duration-200 rounded-lg"
                                            onClick={() => {
                                                setEmail("user@example.com");
                                                setPassword("123456");
                                            }}
                                        >
                                            <User className="h-4 w-4 mr-2" />
                                            User Demo (user@example.com / 123456)
                                        </Button>
                                    </div>
                                )}
                            </form>

                            {/* Social Login Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-slate-300 dark:border-slate-700"></span>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">Or continue with</span>
                                </div>
                            </div>

                            {/* Social Login Buttons */}
                            <div className="grid grid-cols-1 gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full h-11 border-slate-300 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-400 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400 text-slate-700 dark:text-slate-300 rounded-lg transition-colors duration-200"
                                    onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                                >
                                    <FaGoogle className="h-4 w-4 mr-2 " />
                                    Continue with Google
                                </Button>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-4 pt-6">
                            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 w-full">
                                <Link
                                    href="/auth/forgot-password"
                                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                                >
                                    Forgot Password?
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                                >
                                    Create Account
                                </Link>
                            </div>

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
