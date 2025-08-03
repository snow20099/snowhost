"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function CookiesPage() {
  return (
    <div className="container mx-auto max-w-3xl py-12 px-4 text-white">
      <div className="flex flex-col items-center justify-center text-center mb-8">
        <span className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border border-blue-600/20 rounded-full mb-4 select-none">Legal</span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-2">
          <span>Cookie </span>
          <span className="text-blue-600">Policy</span>
        </h1>
        <p className="text-muted-foreground md:text-xl/relaxed">Last updated: March 30, 2025</p>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">1. Introduction</h2>
        <p>
          This Cookie Policy explains how SnowHost uses cookies and similar technologies on our website. By using our website, you consent to the use of cookies as described in this policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">2. What Are Cookies?</h2>
        <p>
          Cookies are small text files that are placed on your device by websites you visit. They are widely used to make websites work, or work more efficiently, as well as to provide information to the site owners.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">3. How We Use Cookies</h2>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Essential Cookies:</strong> Necessary for the website to function and cannot be switched off in our systems.</li>
          <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our website by collecting and reporting information anonymously.</li>
          <li><strong>Functional Cookies:</strong> Enable the website to provide enhanced functionality and personalization.</li>
          <li><strong>Targeting Cookies:</strong> May be set through our site by our advertising partners to build a profile of your interests and show you relevant ads on other sites.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">4. Managing Cookies</h2>
        <p>
          You can control and/or delete cookies as you wish – for details, see aboutcookies.org. You can delete all cookies that are already on your device and you can set most browsers to prevent them from being placed. However, if you do this, you may have to manually adjust some preferences every time you visit a site and some services and functionalities may not work.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">5. Changes to This Cookie Policy</h2>
        <p>
          We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last updated" date at the top of this Cookie Policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">6. Contact Us</h2>
        <p>If you have any questions about this Cookie Policy, please contact us at privacy@snowhost.com.</p>
      </section>
    </div>
  )
}

