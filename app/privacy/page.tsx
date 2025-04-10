"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function PrivacyPage() {
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
              Privacy <span className="text-blue-600">Policy</span>
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">Last updated: March 30, 2025</p>
          </div>
        </div>
      </section>

      {/* Privacy Content */}
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
              At SnowHost, we respect your privacy and are committed to protecting your personal data. This Privacy
              Policy explains how we collect, use, disclose, and safeguard your information when you use our website and
              services.
            </p>
            <p>
              Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy,
              please do not access our website or use our services.
            </p>

            <h2>2. Information We Collect</h2>
            <p>We collect several types of information from and about users of our website and services, including:</p>
            <ul>
              <li>
                <strong>Personal Data:</strong> Name, email address, telephone number, billing address, payment
                information, and any other information you provide to us.
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you use our website and services, including IP
                address, browser type, device information, pages visited, and time spent on those pages.
              </li>
              <li>
                <strong>Cookies and Tracking Technologies:</strong> We use cookies and similar tracking technologies to
                track activity on our website and hold certain information.
              </li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect for various purposes, including:</p>
            <ul>
              <li>To provide and maintain our services</li>
              <li>To process and complete transactions</li>
              <li>To send administrative information, such as updates, security alerts, and support messages</li>
              <li>To respond to your comments, questions, and requests</li>
              <li>To improve our website and services</li>
              <li>To send marketing communications, if you have opted in to receive them</li>
              <li>To comply with legal obligations</li>
            </ul>

            <h2>4. Disclosure of Your Information</h2>
            <p>We may disclose your personal information in the following circumstances:</p>
            <ul>
              <li>
                <strong>Service Providers:</strong> We may share your information with third-party vendors, service
                providers, and other business partners who perform services on our behalf.
              </li>
              <li>
                <strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of all or a
                portion of our assets, your information may be transferred as part of that transaction.
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in
                response to valid requests by public authorities.
              </li>
            </ul>

            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect the security of your personal
              information. However, please be aware that no method of transmission over the Internet or method of
              electronic storage is 100% secure.
            </p>

            <h2>6. Your Data Protection Rights</h2>
            <p>Depending on your location, you may have certain rights regarding your personal information, such as:</p>
            <ul>
              <li>The right to access your personal information</li>
              <li>The right to rectify inaccurate personal information</li>
              <li>The right to request the deletion of your personal information</li>
              <li>The right to restrict the processing of your personal information</li>
              <li>The right to data portability</li>
              <li>The right to object to the processing of your personal information</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us using the information provided in the "Contact Us"
              section.
            </p>

            <h2>7. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under the age of 16. We do not knowingly collect personal
              information from children under 16. If we become aware that we have collected personal information from a
              child under 16, we will take steps to delete that information.
            </p>

            <h2>8. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
            </p>

            <h2>9. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at privacy@nexushost.com.</p>
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
              <Link href="/cookies">Cookie Policy</Link>
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

