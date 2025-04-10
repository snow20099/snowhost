"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, MessageSquare, Mail, Phone, FileText, HelpCircle, Clock } from "lucide-react"
import Link from "next/link"

export default function SupportPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-b from-background to-background/90">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px] [mask-image:radial-gradient(white,transparent_70%)]" />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
              24/7 Support
            </Badge>
            <h1 className="text-4xl font-bold tracking-tighter md:text-5xl/tight">
              We're Here to <span className="text-blue-600">Help</span>
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Get the support you need, when you need it. Our team is available 24/7 to assist you with any questions or
              issues.
            </p>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SupportCard
              title="Live Chat"
              description="Chat with our support team in real-time for immediate assistance."
              icon={<MessageSquare className="h-8 w-8 text-blue-600" />}
              buttonText="Start Chat"
              buttonHref="#"
              buttonAction={() => {
                // In a real app, this would open the chat widget
                const chatButton = document.querySelector("[data-chat-button]") as HTMLButtonElement
                if (chatButton) chatButton.click()
              }}
            />
            <SupportCard
              title="Email Support"
              description="Send us an email and we'll get back to you within 24 hours."
              icon={<Mail className="h-8 w-8 text-blue-600" />}
              buttonText="Email Us"
              buttonHref="mailto:support@nexushost.com"
            />
            <SupportCard
              title="Phone Support"
              description="Call our support team for urgent issues and immediate help."
              icon={<Phone className="h-8 w-8 text-blue-600" />}
              buttonText="Call Now"
              buttonHref="tel:+18001234567"
            />
          </div>
        </div>
      </section>

      {/* Support Tabs */}
      <section className="py-12 md:py-16 bg-black/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <h2 className="text-3xl font-bold">Support Resources</h2>
            <p className="text-muted-foreground max-w-[700px]">
              Find the information you need with our comprehensive support resources
            </p>
          </div>
          <Tabs defaultValue="faq" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="documentation">Documentation</TabsTrigger>
              <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
            </TabsList>
            <TabsContent value="faq">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FaqCard
                  question="What payment methods do you accept?"
                  answer="We accept all major credit cards, PayPal, and cryptocurrency payments including Bitcoin and Ethereum."
                />
                <FaqCard
                  question="Do you offer a money-back guarantee?"
                  answer="Yes, we offer a 30-day money-back guarantee on all our hosting plans. If you're not satisfied, we'll provide a full refund."
                />
                <FaqCard
                  question="How quickly will my server be set up?"
                  answer="Most servers are set up instantly after payment confirmation. VDS servers may take up to 2 hours for provisioning."
                />
                <FaqCard
                  question="Can I upgrade my plan later?"
                  answer="Yes, you can easily upgrade your plan at any time through your control panel. The price difference will be prorated and charged to your account."
                />
                <FaqCard
                  question="Do you provide technical support?"
                  answer="Yes, we offer 24/7 technical support via live chat, email, and ticket system for all our hosting plans."
                />
                <FaqCard
                  question="What is your uptime guarantee?"
                  answer="We guarantee 99.9% uptime for all our hosting services. If we fail to meet this, you'll receive credit on your account."
                />
              </div>
              <div className="flex justify-center mt-8">
                <Button variant="outline" asChild>
                  <Link href="/faq">
                    View All FAQs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="documentation">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DocCard
                  title="Getting Started Guide"
                  description="Learn how to set up and configure your hosting service."
                  icon={<FileText className="h-8 w-8 text-blue-600" />}
                  href="/docs/getting-started"
                />
                <DocCard
                  title="Server Management"
                  description="Learn how to manage and optimize your servers."
                  icon={<FileText className="h-8 w-8 text-blue-600" />}
                  href="/docs/server-management"
                />
                <DocCard
                  title="Security Best Practices"
                  description="Protect your servers with our security recommendations."
                  icon={<FileText className="h-8 w-8 text-blue-600" />}
                  href="/docs/security"
                />
                <DocCard
                  title="Backup and Recovery"
                  description="Learn how to back up and restore your data."
                  icon={<FileText className="h-8 w-8 text-blue-600" />}
                  href="/docs/backup-recovery"
                />
                <DocCard
                  title="Domain Management"
                  description="Configure and manage domains for your hosting."
                  icon={<FileText className="h-8 w-8 text-blue-600" />}
                  href="/docs/domains"
                />
                <DocCard
                  title="API Documentation"
                  description="Integrate with our API for automated management."
                  icon={<FileText className="h-8 w-8 text-blue-600" />}
                  href="/docs/api"
                />
              </div>
              <div className="flex justify-center mt-8">
                <Button variant="outline" asChild>
                  <Link href="/docs">
                    Browse All Documentation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="tickets">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-card/50 border-border/50">
                  <CardHeader>
                    <CardTitle>Submit a Support Ticket</CardTitle>
                    <CardDescription>
                      Create a new support ticket and our team will respond as soon as possible.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Name
                        </label>
                        <Input id="name" placeholder="Your name" className="bg-background/50 border-border/50" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Your email"
                          className="bg-background/50 border-border/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium">
                          Subject
                        </label>
                        <Input
                          id="subject"
                          placeholder="Ticket subject"
                          className="bg-background/50 border-border/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium">
                          Message
                        </label>
                        <Textarea
                          id="message"
                          placeholder="Describe your issue in detail"
                          className="min-h-[120px] bg-background/50 border-border/50"
                        />
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Submit Ticket</Button>
                  </CardFooter>
                </Card>
                <div className="space-y-6">
                  <Card className="bg-card/50 border-border/50">
                    <CardHeader>
                      <CardTitle>Recent Tickets</CardTitle>
                      <CardDescription>View and track your recent support tickets</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <TicketItem
                          id="T-12345"
                          subject="Server Connection Issue"
                          status="open"
                          date="March 29, 2025"
                        />
                        <TicketItem id="T-12344" subject="Billing Question" status="closed" date="March 25, 2025" />
                        <TicketItem
                          id="T-12343"
                          subject="Domain Transfer Help"
                          status="in-progress"
                          date="March 20, 2025"
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/dashboard/tickets">View All Tickets</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card className="bg-card/50 border-border/50">
                    <CardHeader>
                      <CardTitle>Average Response Times</CardTitle>
                      <CardDescription>Our current support response times</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 text-blue-600 mr-2" />
                            <span>Live Chat</span>
                          </div>
                          <span className="text-sm">Under 5 minutes</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 text-blue-600 mr-2" />
                            <span>Email Support</span>
                          </div>
                          <span className="text-sm">Under 24 hours</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <HelpCircle className="h-4 w-4 text-blue-600 mr-2" />
                            <span>Support Tickets</span>
                          </div>
                          <span className="text-sm">Under 12 hours</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <h2 className="text-3xl font-bold">Contact Information</h2>
            <p className="text-muted-foreground max-w-[700px]">Reach out to us through any of these channels</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card/50 border-border/50 text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-blue-600/10">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Email</h3>
                <p className="text-muted-foreground mb-4">For general inquiries and support</p>
                <a href="mailto:support@nexushost.com" className="text-blue-600 hover:underline">
                  support@nexushost.com
                </a>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50 text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-blue-600/10">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Phone</h3>
                <p className="text-muted-foreground mb-4">Available 24/7 for urgent issues</p>
                <a href="tel:+18001234567" className="text-blue-600 hover:underline">
                  +1 (800) 123-4567
                </a>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50 text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-blue-600/10">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Business Hours</h3>
                <p className="text-muted-foreground mb-4">Our support team is available</p>
                <p>24 hours a day, 7 days a week</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-blue-600/10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
            <p className="max-w-[600px] text-muted-foreground">
              Join thousands of satisfied customers who trust NexusHost for their hosting needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Sign Up Now</Button>
              <Button variant="outline">Contact Sales</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function SupportCard({
  title,
  description,
  icon,
  buttonText,
  buttonHref,
  buttonAction,
}: {
  title: string
  description: string
  icon: React.ReactNode
  buttonText: string
  buttonHref: string
  buttonAction?: () => void
}) {
  return (
    <Card className="bg-card/50 border-border/50 hover:bg-card/80 transition-all duration-200">
      <CardContent className="pt-6 flex flex-col items-center text-center">
        <div className="p-3 rounded-full bg-blue-600/10 mb-4">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6">{description}</p>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={buttonAction} asChild={!buttonAction}>
          {buttonAction ? <>{buttonText}</> : <Link href={buttonHref}>{buttonText}</Link>}
        </Button>
      </CardContent>
    </Card>
  )
}

function FaqCard({ question, answer }: { question: string; answer: string }) {
  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="text-lg">{question}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{answer}</p>
      </CardContent>
    </Card>
  )
}

function DocCard({
  title,
  description,
  icon,
  href,
}: {
  title: string
  description: string
  icon: React.ReactNode
  href: string
}) {
  return (
    <Link href={href}>
      <Card className="bg-card/50 border-border/50 hover:bg-card/80 transition-all duration-200 h-full">
        <CardContent className="pt-6 flex flex-col items-center text-center">
          <div className="p-3 rounded-full bg-blue-600/10 mb-4">{icon}</div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

function TicketItem({
  id,
  subject,
  status,
  date,
}: {
  id: string
  subject: string
  status: "open" | "closed" | "in-progress"
  date: string
}) {
  return (
    <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
      <div>
        <div className="font-medium">{subject}</div>
        <div className="text-xs text-muted-foreground">
          {id} • {date}
        </div>
      </div>
      <StatusBadge status={status} />
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "open":
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
          Open
        </Badge>
      )
    case "closed":
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
          Closed
        </Badge>
      )
    case "in-progress":
      return (
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
          In Progress
        </Badge>
      )
    default:
      return null
  }
}

