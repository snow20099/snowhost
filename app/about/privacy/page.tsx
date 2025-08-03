"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-3xl py-12 px-4 text-white">
      <div className="flex flex-col items-center justify-center text-center mb-8">
        <span className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border border-blue-600/20 rounded-full mb-4 select-none">Legal</span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-2">
          <span>Privacy </span>
          <span className="text-blue-600">Policy</span>
        </h1>
        <p className="text-muted-foreground md:text-xl/relaxed">Last updated: March 30, 2025</p>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">1. Introduction</h2>
        <p>
          At SnowHost, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
        </p>
        <p>
          Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access our website or use our services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">2. Information We Collect</h2>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Personal Data:</strong> Name, email address, telephone number, billing address, payment information, and any other information you provide to us.</li>
          <li><strong>Usage Data:</strong> Information about how you use our website and services, including IP address, browser type, device information, pages visited, and time spent on those pages.</li>
          <li><strong>Cookies and Tracking Technologies:</strong> We use cookies and similar tracking technologies to track activity on our website and hold certain information.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">3. How We Use Your Information</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>To provide and maintain our services</li>
          <li>To process and complete transactions</li>
          <li>To send administrative information, such as updates, security alerts, and support messages</li>
          <li>To respond to your comments, questions, and requests</li>
          <li>To improve our website and services</li>
          <li>To send marketing communications, if you have opted in to receive them</li>
          <li>To comply with legal obligations</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">4. Disclosure of Your Information</h2>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Service Providers:</strong> We may share your information with third-party vendors, service providers, and other business partners who perform services on our behalf.</li>
          <li><strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.</li>
          <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">5. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect the security of your personal information. However, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">6. Your Data Protection Rights</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>The right to access your personal information</li>
          <li>The right to rectify inaccurate personal information</li>
          <li>The right to request the deletion of your personal information</li>
          <li>The right to restrict the processing of your personal information</li>
          <li>The right to data portability</li>
          <li>The right to object to the processing of your personal information</li>
        </ul>
        <p className="mt-2">
          To exercise any of these rights, please contact us using the information provided in the "Contact Us" section.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">7. Children's Privacy</h2>
        <p>
          Our services are not intended for individuals under the age of 16. We do not knowingly collect personal information from children under 16. If we become aware that we have collected personal information from a child under 16, we will take steps to delete that information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">8. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">9. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at privacy@snowhost.com.</p>
      </section>
    </div>
  )
}

