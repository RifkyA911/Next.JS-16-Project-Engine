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
import Link from "next/link";
import { Eye, EyeOff, Shield, Mail, Lock, Github, Chrome, Twitter } from "lucide-react";
import { ReCAPTCHAWrapper } from "@/components/ui/recaptcha";

export default function LoginPage() {
    const router = useRouter()
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-md px-4">
                <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                    <CardHeader className="space-y-1 text-center pb-6">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                            <Shield className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900">
                            Welcome Back
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            Sign in to your account to continue
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="pl-10 pr-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-600"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
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
                                className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg transition-all duration-200 rounded-lg"
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
                        </form>

                        {/* Social Login Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-300"></span>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        {/* Social Login Buttons */}
                        <div className="grid grid-cols-1 gap-3">
                            <Button
                                variant="outline"
                                className="w-full h-11 border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg"
                                onClick={() => alert("Google login - Placeholder")}
                            >
                                <Chrome className="h-4 w-4 mr-2" />
                                Continue with Google
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full h-11 border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg"
                                onClick={() => alert("GitHub login - Placeholder")}
                            >
                                <Github className="h-4 w-4 mr-2" />
                                Continue with GitHub
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full h-11 border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg"
                                onClick={() => alert("Twitter login - Placeholder")}
                            >
                                <Twitter className="h-4 w-4 mr-2" />
                                Continue with Twitter
                            </Button>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4 pt-6">
                        <div className="flex justify-between text-sm text-gray-600 w-full">
                            <Link
                                href="/auth/forgot-password"
                                className="hover:text-blue-600 transition-colors font-medium"
                            >
                                Forgot Password?
                            </Link>
                            <Link
                                href="/auth/register"
                                className="hover:text-blue-600 transition-colors font-medium"
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
    );
}
