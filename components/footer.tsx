"use client"

import Link from "next/link"
import { Server, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95">
      <div className="container px-4 md:px-6 py-12 md:py-16">
        {/* Newsletter Section */}
        <div className="mb-12 pb-12 border-b border-border/40">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:w-1/2 space-y-4">
              <h3 className="text-2xl font-bold">Subscribe to Our Newsletter</h3>
              <p className="text-muted-foreground">
                Stay updated with the latest news, articles, and special offers. We promise not to spam your inbox.
              </p>
            </div>
            <div className="lg:w-1/2 w-full">
              <form
                className="flex flex-col sm:flex-row gap-3"
                onSubmit={(e) => {
                  e.preventDefault()
                  // In a real app, this would submit the newsletter form
                  alert("Thank you for subscribing to our newsletter!")
                  e.currentTarget.reset()
                }}
              >
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-background/50 border-border/50 focus:border-blue-600"
                  required
                />
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Server className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-xl">SnowHost</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Premium hosting solutions for gaming, VPS, VDS, and web hosting with 24/7 support and 99.9% uptime
              guarantee.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-blue-600 transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-blue-600 transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-blue-600 transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-blue-600 transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-blue-600 transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/services/gaming"
                  className="text-sm text-muted-foreground hover:text-blue-600 transition-colors flex items-center"
                >
                  <span className="mr-2">→</span> Gaming Hosting
                </Link>
              </li>
              <li>
                <Link
                  href="/services/vps"
                  className="text-sm text-muted-foreground hover:text-blue-600 transition-colors flex items-center"
                >
                  <span className="mr-2">→</span> VPS Hosting
                </Link>
              </li>
              <li>
                <Link
                  href="/services/vds"
                  className="text-sm text-muted-foreground hover:text-blue-600 transition-colors flex items-center"
                >
                  <span className="mr-2">→</span> VDS Hosting
                </Link>
              </li>
              <li>
                <Link
                  href="/services/web"
                  className="text-sm text-muted-foreground hover:text-blue-600 transition-colors flex items-center"
                >
                  <span className="mr-2">→</span> Web Hosting
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-blue-600 transition-colors flex items-center"
                >
                  <span className="mr-2">→</span> About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-muted-foreground hover:text-blue-600 transition-colors flex items-center"
                >
                  <span className="mr-2">→</span> Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-sm text-muted-foreground hover:text-blue-600 transition-colors flex items-center"
                >
                  <span className="mr-2">→</span> Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-blue-600 transition-colors flex items-center"
                >
                  <span className="mr-2">→</span> Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <a
                  href="mailto:info@snowhost.com"
                  className="text-sm text-muted-foreground hover:text-blue-600 transition-colors"
                >
                  info@snowhost.com
                </a>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <a
                  href="tel:+18001234567"
                  className="text-sm text-muted-foreground hover:text-blue-600 transition-colors"
                >
                  +1 (800) 123-4567
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <span className="text-sm text-muted-foreground">123 Hosting Street, Server City, 10101</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-border/40">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {new Date().getFullYear()} NexusHost. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-blue-600 transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-blue-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="text-sm text-muted-foreground hover:text-blue-600 transition-colors">
              Cookie Policy
            </Link>
            <Link href="/sitemap" className="text-sm text-muted-foreground hover:text-blue-600 transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

