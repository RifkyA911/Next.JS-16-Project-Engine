"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    FaGithub,
    FaTwitter,
    FaLinkedin,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaChevronUp
} from "react-icons/fa";

const footerLinks = [
    {
        title: "Product",
        links: [
            { name: "Features", href: "#" },
            { name: "Pricing", href: "#" },
            { name: "Documentation", href: "#" },
            { name: "API Reference", href: "#" },
        ],
    },
    {
        title: "Company",
        links: [
            { name: "About Us", href: "#" },
            { name: "Careers", href: "#" },
            { name: "Blog", href: "#" },
            { name: "Press", href: "#" },
        ],
    },
    {
        title: "Resources",
        links: [
            { name: "Help Center", href: "#" },
            { name: "Community", href: "#" },
            { name: "Guides", href: "#" },
            { name: "Partners", href: "#" },
        ],
    },
    {
        title: "Legal",
        links: [
            { name: "Privacy Policy", href: "#" },
            { name: "Terms of Service", href: "#" },
            { name: "Cookie Policy", href: "#" },
            { name: "Licenses", href: "#" },
        ],
    },
];

const socialLinks = [
    { icon: FaGithub, href: "#", label: "GitHub" },
    { icon: FaTwitter, href: "#", label: "Twitter" },
    { icon: FaLinkedin, href: "#", label: "LinkedIn" },
    { icon: FaEnvelope, href: "#", label: "Email" },
];

export default function DashboardFooter() {
    const [email, setEmail] = useState("");

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="border-t bg-gray-50 dark:bg-gray-900 mt-auto">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Company Info */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <FaChevronUp className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-bold text-lg">Novaflare Corp</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                            Empowering businesses with cutting-edge technology solutions for digital age.
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <FaEnvelope className="h-4 w-4" />
                                <span>support@novaflare.com</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <FaPhone className="h-4 w-4" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <FaMapMarkerAlt className="h-4 w-4" />
                                <span>123 Tech Street, Silicon Valley, CA 94025</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Links */}
                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h3 className="font-semibold mb-4">{section.title}</h3>
                            <ul className="space-y-2">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-semibold mb-4">Stay Updated</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Subscribe to our newsletter for the latest updates and insights.
                        </p>
                        <div className="space-y-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
                            />
                            <Button className="w-full">
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-border mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} Novaflare Corp. All rights reserved.
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    aria-label={social.label}
                                >
                                    <social.icon className="h-4 w-4 text-muted-foreground" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll to Top Button */}
            <Button
                onClick={scrollToTop}
                size="sm"
                className="fixed bottom-6 right-6 rounded-full w-10 h-10 shadow-lg z-50"
                aria-label="Scroll to top"
            >
                <FaChevronUp className="h-4 w-4" />
            </Button>
        </footer>
    );
}
