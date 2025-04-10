"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function CookiesPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-b from-background via-background/95 to-background/90">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px] [mask-image:radial-gradient(white,transparent_70%)]" />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
              Legal
            </Badge>
            <h1 className="text-4xl font-bold tracking-tighter md:text-5xl/tight">
              Cookie <span className="text-blue-600">Policy</span>
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">Last updated: March 30, 2025</p>
          </div>
        </div>
      </section>

      {/* Cookie Policy Content */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container px-4 md:px-6">
          <motion.div
            className="prose prose-lg dark:prose-invert max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>1. Introduction</h2>
            <p>
              This Cookie Policy explains how NexusHost ("we", "us", or "our") uses cookies and similar technologies on
              our website. This policy is designed to help you understand what cookies are, how we use them, and the
              choices you have regarding their use.
            </p>

            <h2>2. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a
              website. They are widely used to make websites work more efficiently and provide information to the
              website owners.
            </p>
            <p>
              Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your device when you go
              offline, while session cookies are deleted as soon as you close your web browser.
            </p>

            <h2>3. How We Use Cookies</h2>
            <p>We use different types of cookies for various purposes:</p>
            <ul>
              <li>
                <strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly.
                They enable basic functions like page navigation and access to secure areas of the website. The website
                cannot function properly without these cookies.
              </li>
              <li>
                <strong>Preference Cookies:</strong> These cookies allow the website to remember choices you make (such
                as your preferred language or the region you are in) and provide enhanced, more personal features.
              </li>
              <li>
                <strong>Analytics Cookies:</strong> These cookies help us understand how visitors interact with our
                website by collecting and reporting information anonymously. This helps us improve our website and your
                experience.
              </li>
              <li>
                <strong>Marketing Cookies:</strong> These cookies are used to track visitors across websites. The
                intention is to display ads that are relevant and engaging for the individual user.
              </li>
            </ul>

            <h2>4. Types of Cookies We Use</h2>
            <p>We use both first-party and third-party cookies on our website:</p>
            <ul>
              <li>
                <strong>First-party cookies:</strong> These are cookies that are set by our website.
              </li>
              <li>
                <strong>Third-party cookies:</strong> These are cookies that are set by a domain different from the one
                you are visiting. We use third-party cookies from services like Google Analytics, Facebook, and other
                advertising partners.
              </li>
            </ul>

            <h2>5. Specific Cookies We Use</h2>
            <p>Here is a list of the main cookies we use on our website:</p>

            <table>
              <thead>
                <tr>
                  <th>Cookie Name</th>
                  <th>Purpose</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>session_id</td>
                  <td>Used to maintain your session</td>
                  <td>Session</td>
                </tr>
                <tr>
                  <td>preferences</td>
                  <td>Stores your preferences such as language and theme</td>
                  <td>1 year</td>
                </tr>
                <tr>
                  <td>_ga</td>
                  <td>Google Analytics - Used to distinguish users</td>
                  <td>2 years</td>
                </tr>
                <tr>
                  <td>_gid</td>
                  <td>Google Analytics - Used to distinguish users</td>
                  <td>24 hours</td>
                </tr>
                <tr>
                  <td>_fbp</td>
                  <td>Facebook - Used to deliver advertisements</td>
                  <td>3 months</td>
                </tr>
              </tbody>
            </table>

            <h2>6. Managing Cookies</h2>
            <p>
              You can control and manage cookies in various ways. Most web browsers allow you to manage your cookie
              preferences. You can:
            </p>
            <ul>
              <li>Delete cookies from your device</li>
              <li>
                Block cookies by activating the setting on your browser that allows you to refuse all or some cookies
              </li>
              <li>Set your browser to notify you when you receive a cookie</li>
            </ul>
            <p>
              Please note that if you choose to block or delete cookies, you may not be able to access certain areas or
              features of our website, and some services may not function properly.
            </p>

            <h2>7. Changes to This Cookie Policy</h2>
            <p>
              We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new
              Cookie Policy on this page and updating the "Last updated" date at the top of this policy.
            </p>

            <h2>8. Contact Us</h2>
            <p>If you have any questions about our Cookie Policy, please contact us at privacy@nexushost.com.</p>
          </motion.div>

          <div className="flex justify-center mt-12">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8" asChild>
              <Link href="/contact">
                Contact Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Related Legal Documents */}
      <section className="py-12 md:py-16 bg-black/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px] [mask-image:radial-gradient(white,transparent_70%)]" />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <h2 className="text-2xl font-bold">Related Legal Documents</h2>
            <p className="text-muted-foreground max-w-[600px]">
              Review our other policies to understand how we handle your data and protect your privacy.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="/terms">Terms of Service</Link>
            </Button>
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="/privacy">Privacy Policy</Link>
            </Button>
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="/refund">Refund Policy</Link>
            </Button>
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="/sla">Service Level Agreement</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

