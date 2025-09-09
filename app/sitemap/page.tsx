"use client"

import { ArrowRight } from "lucide-react";

export default function SitemapPage() {
  const sitemap = [
    {
      title: "Main Pages",
      links: [
        { name: "Home", href: "/" },
        { name: "About Us", href: "/about" },
        { name: "Features", href: "/features" },
        { name: "Pricing", href: "/pricing" },
        { name: "Blog", href: "/blog" },
        { name: "Careers", href: "/careers" },
        { name: "Contact", href: "/contact" },
        { name: "Support", href: "/support" },
      ],
    },
    {
      title: "Services",
      links: [
        { name: "Gaming Hosting", href: "/services/gaming" },
        { name: "Minecraft Hosting", href: "/services/gaming/minecraft" },
        { name: "CS2 Hosting", href: "/services/gaming/cs2" },
        { name: "FiveM Hosting", href: "/services/gaming/fivem" },
        { name: "ARK Hosting", href: "/services/gaming/ark" },
        { name: "VPS Hosting", href: "/services/vps" },
        { name: "VDS Hosting", href: "/services/vds" },
        { name: "Web Hosting", href: "/services/web" },
      ],
    },
    {
      title: "Account",
      links: [
        { name: "Login", href: "/login" },
        { name: "Sign Up", href: "/signup" },
        { name: "Dashboard", href: "/dashboard" },
        { name: "My Servers", href: "/dashboard" },
        { name: "Billing", href: "/dashboard" },
        { name: "Settings", href: "/dashboard" },
        { name: "Support Tickets", href: "/support" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Terms of Service", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Cookie Policy", href: "/cookies" },
        { name: "Refund Policy", href: "/refund" },
        { name: "Service Level Agreement", href: "/sla" },
        { name: "GDPR Compliance", href: "/gdpr" },
      ],
    },
  ];

  return (
    <div className="container mx-auto max-w-6xl py-12 px-4 text-white">
      <div className="flex flex-col items-center justify-center text-center mb-12">
        <span className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border border-blue-600/20 rounded-full mb-4 select-none">Sitemap</span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-2">Sitemap</h1>
        <p className="text-muted-foreground md:text-xl/relaxed">Browse all main sections and pages of our website easily.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {sitemap.map((section) => (
          <div key={section.title} className="rounded-xl border border-border/30 bg-card/40 p-6">
            <h2 className="text-xl font-bold mb-4 text-white">{section.title}</h2>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors duration-150"
                  >
                    <ArrowRight className="h-4 w-4" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

