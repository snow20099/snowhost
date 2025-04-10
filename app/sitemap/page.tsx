"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function SitemapPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-b from-background via-background/95 to-background/90">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px] [mask-image:radial-gradient(white,transparent_70%)]" />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
              Navigation
            </Badge>
            <h1 className="text-4xl font-bold tracking-tighter md:text-5xl/tight">
              Site<span className="text-blue-600">map</span>
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Find everything you need on our website with this comprehensive sitemap.
            </p>
          </div>
        </div>
      </section>

      {/* Sitemap Content */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h2 className="text-2xl font-bold mb-6">Main Pages</h2>
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    <li>
                      <Link href="/" className="text-blue-600 hover:underline flex items-center">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link href="/about" className="text-blue-600 hover:underline flex items-center">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link href="/features" className="text-blue-600 hover:underline flex items-center">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Features
                      </Link>
                    </li>
                    <li>
                      <Link href="/pricing" className="text-blue-600 hover:underline flex items-center">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Pricing
                      </Link>
                    </li>
                    <li>
                      <Link href="/blog" className="text-blue-600 hover:underline flex items-center">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link href="/careers" className="text-blue-600 hover:underline flex items-center">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Careers
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact" className="text-blue-600 hover:underline flex items-center">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Contact
                      </Link>
                    </li>
                    <li>
                      <Link href="/support" className="text-blue-600 hover:underline flex items-center">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Support
                      </Link>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold mb-6">Services</h2>
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    <li>
                      <Link href="/services/gaming" className="text-blue-600 hover:underline flex items-center">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Gaming Hosting
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/services/gaming/minecraft"
                        className="text-blue-600 hover:underline flex items-center"
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Minecraft Hosting
                      </Link>
                    </li>
                    <li>
                      <Link href="/services/gaming/cs2" className="text-blue-600 hover:underline flex items-center">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        CS2 Hosting
                      </Link>
                    </li>
                    <li>
                      <Link href="/services/gaming/fivem" className="text-blue-600 hover:underline flex items-center">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        FiveM Hosting
                      </Link>
                    </li>
                    <li>
                      <Link href="/services/gaming/ark" className="text-blue-600 hover:underline flex items-center">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        ARK Hosting
                      </Link>
                    </li>
                    <li>
                      <Link href="/services/vps" className="text-blue-600 hover:underline flex items-center">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        VPS Hosting
                      </Link>
                    </li>
                    <li>
                      <Link href="/services/vds" className="text-blue-600 hover:underline flex items-center">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        VDS Hosting
                      </Link>
                    </li>
                    <li>
                      <Link href="/services/web" className="text-blue-600 hover:underline flex items-center">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Web Hosting
                      </Link>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-6">Account</h2>
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    <li>
                      <Link href="/login" className="text-blue-600 hover:underline flex items-center">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link href="/signup" className="text-blue-600 hover:underline flex items-center">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Sign Up
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard" className="text-blue-600 hover:underline flex items-center">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/servers" className="text-blue-600 hover:underline flex items-center">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        My Servers
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/billing" className="text-blue-600 hover:underline flex items-center">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Billing
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/settings" className="text-blue-600 hover:underline flex items-center">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/support" className="text-blue-600 hover:underline flex items-center">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Support Tickets
                      </Link>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6">Legal</h2>
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    <li>
                      <Link href="/terms" className="text-blue-600 hover:underline flex items-center">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Terms of Service
                      </Link>
                    </li>
                    <li>
                      <Link href="/privacy" className="text-blue-600 hover:underline flex items-center">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link href="/cookies" className="text-blue-600 hover:underline flex items-center">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Cookie Policy
                      </Link>
                    </li>
                    <li>
                      <Link href="/refund" className="text-blue-600 hover:underline flex items-center">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Refund Policy
                      </Link>
                    </li>
                    <li>
                      <Link href="/sla" className="text-blue-600 hover:underline flex items-center">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Service Level Agreement
                      </Link>
                    </li>
                    <li>
                      <Link href="/gdpr" className="text-blue-600 hover:underline flex items-center">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        GDPR Compliance
                      </Link>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-black/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px] [mask-image:radial-gradient(white,transparent_70%)]" />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold">Can't Find What You're Looking For?</h2>
            <p className="text-muted-foreground max-w-[600px]">
              If you can't find the page you're looking for, please contact our support team for assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8" asChild>
                <Link href="/contact">
                  Contact Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="rounded-full px-8"
                onClick={() => {
                  // In a real app, this would open the chat widget
                  const chatButton = document.querySelector("[data-chat-button]") as HTMLButtonElement
                  if (chatButton) chatButton.click()
                }}
              >
                Live Chat Support
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

