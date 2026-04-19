import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextAuthProviders } from "@/providers/next-auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Next.JS Project Engine",
    template: "%s | Next.JS Project Engine"
  },
  description: "Production-ready Next.js 16 template with authentication, data tables, and modern UI components. Built for modern web development.",
  keywords: ["Next.js 16", "React 19", "TypeScript", "Dashboard", "Authentication", "Data Tables", "UI Components", "Template"],
  authors: [{ name: "RifkyA911" }],
  creator: "RifkyA911",
  publisher: "RifkyA911",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Next.JS Project Engine | Production Template',
    description: 'Production-ready Next.js 16 template with authentication, data tables, and modern UI components. Built for modern web development.',
    siteName: 'Next.JS Project Engine',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Next.JS Project Engine - Production Template',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next.JS Project Engine | Production Template',
    description: 'Production-ready Next.js 16 template with authentication, data tables, and modern UI components. Built for modern web development.',
    images: ['/og-image.jpg'],
    creator: '@rifkya911',
  },
  robots: {
    // Set to false for internal/demo, true for public
    index: process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SITE_TYPE === 'public',
    follow: process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SITE_TYPE === 'public',
    googleBot: {
      index: process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SITE_TYPE === 'public',
      follow: process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SITE_TYPE === 'public',
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'your-google-site-verification-code',
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code', // Note: bing verification not supported in Next.js metadata
  },
  other: {
    'site-type': process.env.NEXT_PUBLIC_SITE_TYPE || 'internal', // 'public' or 'internal'
    'deployment-type': 'nextjs-16-template',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthProviders>
          {children}
        </NextAuthProviders>

      </body>
    </html>
  );
}
