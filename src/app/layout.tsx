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
  description: "A modern Next.js application with advanced features including authentication, dashboard, and comprehensive UI components.",
  keywords: ["Next.js", "React", "TypeScript", "Dashboard", "Authentication", "UI Components"],
  authors: [{ name: "RifkyA911" }],
  creator: "RifkyA911",
  publisher: "RifkyA911",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Next.JS Project Engine',
    description: 'A modern Next.js application with advanced features including authentication, dashboard, and comprehensive UI components.',
    siteName: 'Next.JS Project Engine',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Next.JS Project Engine',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next.JS Project Engine',
    description: 'A modern Next.js application with advanced features including authentication, dashboard, and comprehensive UI components.',
    images: ['/og-image.jpg'],
    creator: '@rifkya911',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code',
    yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code', // Note: bing verification not supported in Next.js metadata
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
