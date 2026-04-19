"use client";

import Link from "next/link";
import { Shield, Mail, Heart } from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold">NextJS Engine</span>
            </div>
            <p className="text-slate-400 mb-4 max-w-md">
              Production-ready Next.js 16 template built with modern technologies.
              Includes authentication, data tables, and enterprise-grade features.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://github.com"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <FaGithub className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://linkedin.com"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-5 w-5" />
              </Link>
              <Link
                href="mailto:contact@example.com"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/auth/login"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/register"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/users"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Users Demo
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  API Reference
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  GitHub Repo
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} NextJS Engine. All rights reserved.
            </div>
            <div className="flex items-center space-x-2 text-slate-400 text-sm">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>by RifkyA911</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
