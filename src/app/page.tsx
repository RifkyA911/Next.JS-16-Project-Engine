import DataTableExample from "@/components/examples/data-table-example";
import DynamicDialogFormExample from "@/components/examples/dialog-form-example";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ThemeToggle from "@/components/theme-toggle";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Code, Users, BarChart3, CheckCircle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Home",
  description: "Production-ready Next.js 16 template with authentication, data tables, and modern UI components.",
  keywords: ["Next.js 16", "template", "authentication", "data table", "UI components"],
  openGraph: {
    title: "Next.JS 16 Project Engine | Production Template",
    description: "Production-ready Next.js 16 template with authentication, data tables, and modern UI components.",
    type: "website",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <Shield className="h-16 w-16 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Next.js 16 Project
              <span className="text-blue-600 dark:text-blue-400"> Engine</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
              Production-ready template built with Next.js 16, React 19, and modern technologies.
              Includes authentication, data tables, and enterprise-grade features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/auth/login">
                <Button size="lg" className="text-base px-8 py-3">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard/users">
                <Button variant="outline" size="lg" className="text-base px-8 py-3">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Built for Modern Development
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Everything you need to build production-ready applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <Zap className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <CardTitle className="text-xl">Next.js 16</CardTitle>
                <CardDescription>
                  Latest Next.js with App Router and React 19
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <Shield className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <CardTitle className="text-xl">Authentication</CardTitle>
                <CardDescription>
                  NextAuth.js with reCAPTCHA v3/v2 and bcrypt
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <Code className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                <CardTitle className="text-xl">TypeScript</CardTitle>
                <CardDescription>
                  Full type safety with strict mode and path aliases
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <Users className="h-12 w-12 text-orange-600 dark:text-orange-400 mx-auto mb-4" />
                <CardTitle className="text-xl">Data Tables</CardTitle>
                <CardDescription>
                  Advanced DataTable with pagination and filtering
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <BarChart3 className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
                <CardTitle className="text-xl">Analytics</CardTitle>
                <CardDescription>
                  Built-in monitoring and performance tracking
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <CheckCircle className="h-12 w-12 text-teal-600 dark:text-teal-400 mx-auto mb-4" />
                <CardTitle className="text-xl">Testing</CardTitle>
                <CardDescription>
                  Playwright E2E testing with CI/CD pipeline
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Interactive Examples
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Explore the powerful features with live demonstrations
            </p>
          </div>

          <Tabs defaultValue="table" className="max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="table" className="text-base">Data Table</TabsTrigger>
              <TabsTrigger value="dialog-form" className="text-base">Dialog Form</TabsTrigger>
            </TabsList>

            <TabsContent value="dialog-form">
              <Card>
                <CardContent className="grid gap-6">
                  <DynamicDialogFormExample />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="table">
              <Card>
                <CardContent className="grid gap-6">
                  <DataTableExample />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
}

