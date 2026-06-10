"use client";

import { motion } from "framer-motion";
import { MagicCard } from "@/components/ui/magic-card";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket, Sparkles, Layers, Puzzle, Cpu, Database as DatabaseIcon, ShieldCheck, Globe2, BarChart3, Users, Code } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.title = "NovaStack - Production-ready Next.js SaaS Starter Kit";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Production-ready Next.js SaaS Starter Kit engineered for scalable systems beyond the limits of the universe");
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Mesh Grid Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-400 dark:text-slate-600" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-32 left-1/3 w-64 h-64 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl"
        />
      </div>

      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center relative z-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-500 blur-2xl opacity-30 animate-pulse" />
                <div className="relative bg-linear-to-br from-blue-600 to-purple-600 p-3 rounded-xl shadow-xl">
                  <Rocket className="h-10 w-10 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight"
            >
              NovaStack
              <br />
              <span className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Beyond Limits
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-6 max-w-3xl mx-auto leading-relaxed"
            >
              Production-ready Next.js SaaS Starter Kit engineered for scalable systems beyond the limits of the universe.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12"
            >
              <Link href="/auth/login">
                <Button size="default" className="text-sm px-6 py-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/login?demo=true">
                <Button variant="outline" size="default" className="text-sm px-6 py-2 border-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                  View Demo
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
            >
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">16</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Next.js</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">19</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">React</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-pink-600 dark:text-pink-400 mb-1">100%</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">TypeScript</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-1">∞</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Scalable</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Why NovaStack?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Comprehensive architectural foundation designed to eliminate months of foundational engineering work
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: <Layers className="h-5 w-5" />,
                title: "Multi-Tenant",
                description: "Workspace isolation, organization management, team collaboration",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: <ShieldCheck className="h-5 w-5" />,
                title: "Enterprise Auth",
                description: "RBAC, reCAPTCHA, rate limiting, secure sessions",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: <Puzzle className="h-5 w-5" />,
                title: "CMS-Ready",
                description: "Pages, posts, media library, categories, tags, SEO",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: <Sparkles className="h-5 w-5" />,
                title: "AI Integration",
                description: "OpenAI, Anthropic, Gemini, Groq, Ollama support",
                color: "from-orange-500 to-red-500"
              },
              {
                icon: <Cpu className="h-5 w-5" />,
                title: "Container-Native",
                description: "Podman/Docker support with production configs",
                color: "from-indigo-500 to-purple-500"
              },
              {
                icon: <DatabaseIcon className="h-5 w-5" />,
                title: "Documentation",
                description: "Comprehensive docs for immediate team onboarding",
                color: "from-teal-500 to-cyan-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <MagicCard className="h-full p-4 bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all rounded-xl">
                  <div className={`bg-linear-to-r ${feature.color} p-2 rounded-lg mb-3 w-fit`}>
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {feature.description}
                  </p>
                </MagicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 bg-linear-to-br from-slate-100 to-blue-100 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Technology Stack
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Latest technologies for optimal performance and developer experience
            </p>
          </motion.div>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { name: "Next.js 16", icon: "⚡" },
              { name: "React 19", icon: "⚛️" },
              { name: "TypeScript", icon: "📘" },
              { name: "Tailwind 4", icon: "🎨" },
              { name: "Prisma", icon: "🗄️" },
              { name: "PostgreSQL", icon: "🐘" },
              { name: "Redis", icon: "🔴" },
              { name: "NextAuth", icon: "🔐" },
              { name: "Zod", icon: "✅" },
              { name: "TanStack", icon: "📊" },
              { name: "Zustand", icon: "🎯" },
              { name: "Playwright", icon: "🎭" }
            ].map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center"
              >
                <div className="text-2xl mb-1">{tech.icon}</div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white">{tech.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Can Build */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              What You Can Build
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              NovaStack empowers you to build a wide range of applications
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "SaaS Applications",
                description: "Multi-tenant SaaS with subscription management and billing",
                icon: <Globe2 className="h-4 w-4" />
              },
              {
                title: "Business Platforms",
                description: "Enterprise dashboards with real-time analytics",
                icon: <BarChart3 className="h-4 w-4" />
              },
              {
                title: "CMS Systems",
                description: "Headless CMS with rich editing and SEO features",
                icon: <DatabaseIcon className="h-4 w-4" />
              },
              {
                title: "AI Applications",
                description: "Apps with integrated AI using multiple providers",
                icon: <Sparkles className="h-4 w-4" />
              },
              {
                title: "Multi-Org Systems",
                description: "Platforms with organizations, workspaces, and teams",
                icon: <Users className="h-4 w-4" />
              },
              {
                title: "API Services",
                description: "RESTful APIs with documentation and rate limiting",
                icon: <Code className="h-4 w-4" />
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <MagicCard className="p-4 bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="bg-linear-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                      <div className="text-white">{item.icon}</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </MagicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Ready to Build?
            </h2>
            <p className="text-sm sm:text-base text-white/90 mb-6 max-w-2xl mx-auto">
              Join developers building production-ready applications with NovaStack
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link href="/auth/login">
                <Button size="default" className="text-sm px-6 py-2 bg-white text-blue-600 hover:bg-slate-100 shadow-lg hover:shadow-xl transition-all">
                  Start Building
                  <Rocket className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button size="default" variant="outline" className="text-sm px-6 py-2 bg-transparent border-2 border-white text-white hover:bg-white/10 transition-all">
                  Documentation
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

