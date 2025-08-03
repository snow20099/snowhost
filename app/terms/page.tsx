"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function SitemapPage() {
  const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "Support", href: "/support" },
    { name: "Sitemap", href: "/sitemap" },
    // أضف المزيد حسب صفحاتك
  ];

  return (
    <div className="container mx-auto max-w-3xl py-12 px-4 text-white">
      <div className="flex flex-col items-center justify-center text-center mb-8">
        <span className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border border-blue-600/20 rounded-full mb-4 select-none">Sitemap</span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-2">
          Sitemap
        </h1>
        <p className="text-muted-foreground md:text-xl/relaxed">Browse all main sections and pages of our website easily.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="block p-4 rounded-lg bg-card/50 border border-border/50 hover:bg-blue-600/10 transition-colors duration-200"
          >
            {link.name}
          </a>
        ))}
      </div>
    </div>
  );
}

