"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function TermsPage() {
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
              Terms of <span className="text-blue-600">Service</span>
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">Last updated: March 30, 2025</p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
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
              Welcome to SnowHost. These Terms of Service ("Terms") govern your use of our website, products, and
              services ("Services"). By accessing or using our Services, you agree to be bound by these Terms. If you
              disagree with any part of the Terms, you may not access the Services.
            </p>

            <h2>2. Accounts</h2>
            <p>
              When you create an account with us, you must provide accurate, complete, and current information. You are
              responsible for safeguarding the password and for all activities that occur under your account. You agree
              to notify us immediately of any unauthorized use of your account.
            </p>
            <p>
              We reserve the right to terminate or suspend your account at our sole discretion, without notice, for
              conduct that we believe violates these Terms or is harmful to other users of the Services, us, or third
              parties, or for any other reason.
            </p>

            <h2>3. Services and Billing</h2>
            <p>
              SnowHost provides hosting services as described on our website. We reserve the right to modify, suspend,
              or discontinue any part of the Services at any time.
            </p>
            <p>
              You agree to pay all fees associated with the Services you select. Fees are non-refundable except as
              required by law or as explicitly stated in these Terms. You are responsible for all taxes associated with
              the Services.
            </p>

            <h2>4. Acceptable Use</h2>
            <p>You agree not to use the Services to:</p>
            <ul>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on the intellectual property rights of others</li>
              <li>Transmit any material that is defamatory, offensive, or otherwise objectionable</li>
              <li>Distribute malware or other harmful computer code</li>
              <li>Engage in unauthorized access to any system or network</li>
              <li>Interfere with or disrupt the Services or servers or networks connected to the Services</li>
            </ul>

            <h2>5. Content</h2>
            <p>
              You retain all rights to any content you submit, post, or display on or through the Services. By
              submitting, posting, or displaying content, you grant us a worldwide, non-exclusive, royalty-free license
              to use, reproduce, adapt, publish, translate, and distribute your content in any existing or future media.
            </p>
            <p>
              We do not claim ownership of your content, but we require the license to provide and promote the Services.
            </p>

            <h2>6. Termination</h2>
            <p>
              We may terminate or suspend access to our Services immediately, without prior notice or liability, for any
              reason whatsoever, including without limitation if you breach the Terms.
            </p>
            <p>
              All provisions of the Terms which by their nature should survive termination shall survive termination,
              including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of
              liability.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
              In no event shall SnowHost, nor its directors, employees, partners, agents, suppliers, or affiliates, be
              liable for any indirect, incidental, special, consequential or punitive damages, including without
              limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access
              to or use of or inability to access or use the Services.
            </p>

            <h2>8. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will
              provide notice of any changes by posting the new Terms on this page. Your continued use of the Services
              after any such changes constitutes your acceptance of the new Terms.
            </p>

            <h2>9. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at legal@snowhost.com.</p>
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
              <Link href="/privacy">Privacy Policy</Link>
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

