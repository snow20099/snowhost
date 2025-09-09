"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Server, Shield, Zap, Gamepad2, Clock, Globe } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

export default function CS2HostingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32 bg-gradient-to-b from-background via-background/95 to-background/90">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px] [mask-image:radial-gradient(white,transparent_70%)]" />

        {/* Animated gradient orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "12s" }}
        />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <motion.div
              className="space-y-6 lg:w-1/2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
                CS2 Hosting
              </Badge>
              <h1 className="text-4xl font-bold tracking-tighter md:text-5xl/tight lg:text-6xl/tight">
                Premium <span className="text-blue-600">Counter-Strike 2</span> Server Hosting
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                Low-latency CS2 servers with 128-tick rate, advanced anti-cheat integration, and customizable
                configurations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8">
                  View Plans
                </Button>
              </div>
            </motion.div>
            <motion.div
              className="lg:w-1/2 relative h-[300px] w-full rounded-2xl overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Image
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"
                alt="CS2 server visualization"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-50"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Server Plans */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
              Server Plans
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Choose Your Perfect CS2 Server</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              From casual matches to competitive tournaments, we have the perfect plan for your Counter-Strike 2 server.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {[
              {
                title: "Starter",
                price: "$4.99",
                tickRate: "64",
                cpu: "1 vCore",
                ram: "2GB",
                storage: "20GB SSD",
                slots: "12",
                locations: "2",
                popular: false,
                delay: 0,
              },
              {
                title: "Basic",
                price: "$7.99",
                tickRate: "64",
                cpu: "2 vCores",
                ram: "4GB",
                storage: "40GB SSD",
                slots: "16",
                locations: "3",
                popular: false,
                delay: 0.1,
              },
              {
                title: "Standard",
                price: "$12.99",
                tickRate: "128",
                cpu: "2 vCores",
                ram: "6GB",
                storage: "60GB SSD",
                slots: "24",
                locations: "5",
                popular: true,
                delay: 0.2,
              },
              {
                title: "Premium",
                price: "$19.99",
                tickRate: "128",
                cpu: "4 vCores",
                ram: "8GB",
                storage: "80GB SSD",
                slots: "32",
                locations: "7",
                popular: false,
                delay: 0.3,
              },
              {
                title: "Ultimate",
                price: "$29.99",
                tickRate: "128",
                cpu: "6 vCores",
                ram: "12GB",
                storage: "120GB NVMe",
                slots: "48",
                locations: "9",
                popular: false,
                delay: 0.4,
              },
              {
                title: "Enterprise",
                price: "$39.99",
                tickRate: "128",
                cpu: "8 vCores",
                ram: "16GB",
                storage: "160GB NVMe",
                slots: "64",
                locations: "All",
                popular: false,
                delay: 0.5,
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: plan.delay }}
              >
                <CS2PlanCard
                  title={plan.title}
                  price={plan.price}
                  tickRate={plan.tickRate}
                  cpu={plan.cpu}
                  ram={plan.ram}
                  storage={plan.storage}
                  slots={plan.slots}
                  locations={plan.locations}
                  popular={plan.popular}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28 bg-black/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px] [mask-image:radial-gradient(white,transparent_70%)]" />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
              Features
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              CS2 Server <span className="text-blue-600">Features</span>
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Our Counter-Strike 2 servers come with everything you need for the best gaming experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "128-Tick Rate Servers",
                description:
                  "Experience smooth gameplay with our high-performance 128-tick rate servers for competitive play.",
                icon: <Zap className="h-8 w-8 text-blue-600" />,
                delay: 0,
              },
              {
                title: "Anti-Cheat Integration",
                description: "Keep your matches fair with integrated anti-cheat solutions to prevent cheating.",
                icon: <Shield className="h-8 w-8 text-blue-600" />,
                delay: 0.1,
              },
              {
                title: "Custom Control Panel",
                description: "User-friendly control panel for easy server management and configuration.",
                icon: <Server className="h-8 w-8 text-blue-600" />,
                delay: 0.2,
              },
              {
                title: "Plugin Support",
                description: "Easy installation and management of plugins with SourceMod and MetaMod.",
                icon: <Gamepad2 className="h-8 w-8 text-blue-600" />,
                delay: 0.3,
              },
              {
                title: "Automatic Updates",
                description: "Keep your server up-to-date with automatic CS2 updates and maintenance.",
                icon: <Clock className="h-8 w-8 text-blue-600" />,
                delay: 0.4,
              },
              {
                title: "Instant Setup",
                description: "Get your server up and running in minutes with our instant setup process.",
                icon: <Zap className="h-8 w-8 text-blue-600" />,
                delay: 0.5,
              },
              {
                title: "Global Locations",
                description: "Multiple server locations worldwide to ensure low ping for players everywhere.",
                icon: <Globe className="h-8 w-8 text-blue-600" />,
                delay: 0.6,
              },
              {
                title: "DDoS Protection",
                description: "Advanced protection against DDoS attacks to keep your server online during tournaments.",
                icon: <Shield className="h-8 w-8 text-blue-600" />,
                delay: 0.7,
              },
              {
                title: "Custom Maps",
                description: "Upload and manage custom maps and workshop content for your server.",
                icon: <Globe className="h-8 w-8 text-blue-600" />,
                delay: 0.8,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: feature.delay }}
              >
                <FeatureCard title={feature.title} description={feature.description} icon={feature.icon} color="blue" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Control Panel Preview */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              className="lg:w-1/2 space-y-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
                Control Panel
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Easy CS2 Server Management</h2>
              <p className="text-muted-foreground md:text-lg">
                Our intuitive control panel makes it easy to manage your CS2 server, install plugins, configure
                settings, and monitor performance.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span>One-click plugin installation</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span>Easy map management</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span>Real-time console access</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span>Server restart and power management</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span>Config file editor</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span>Player management and ban controls</span>
                </li>
              </ul>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 mt-4">
                Try Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>

            <motion.div
              className="lg:w-1/2 relative h-[400px] w-full rounded-2xl overflow-hidden border border-border/50"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Image
                src="https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=2076&auto=format&fit=crop"
                alt="CS2 server control panel"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-30"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-28 bg-black/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px] [mask-image:radial-gradient(white,transparent_70%)]" />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
              FAQ
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Frequently Asked <span className="text-blue-600">Questions</span>
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Find answers to common questions about our CS2 hosting services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                question: "What is the difference between 64-tick and 128-tick servers?",
                answer:
                  "128-tick servers update the game state 128 times per second, compared to 64 times on 64-tick servers. This results in more responsive gameplay, more accurate hit registration, and an overall smoother experience, which is why competitive players prefer 128-tick servers.",
              },
              {
                question: "Can I install custom plugins on my CS2 server?",
                answer:
                  "Yes, you can install custom plugins using SourceMod and MetaMod. Our control panel makes it easy to install and manage plugins with just a few clicks.",
              },
              {
                question: "How do I set up my CS2 server for competitive matches?",
                answer:
                  "Our servers come pre-configured for competitive play, but you can further customize settings through our control panel. We provide templates for various competitive configurations, including ESL, FACEIT, and more.",
              },
              {
                question: "Do you offer a money-back guarantee?",
                answer:
                  "Yes, we offer a 7-day money-back guarantee on all our CS2 hosting plans. If you're not satisfied with our service, you can request a full refund within 7 days of your purchase.",
              },
              {
                question: "Can I switch server locations?",
                answer:
                  "Yes, you can switch server locations at any time through our control panel. We offer multiple locations worldwide to ensure low ping for players everywhere.",
              },
              {
                question: "How do I set up a GSLT token for my CS2 server?",
                answer:
                  "Our control panel provides an easy way to set up and manage your GSLT (Game Server Login Token). Simply generate a token from your Steam account and enter it in the control panel.",
              },
            ].map((faq, index) => (
              <Card key={index} className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-blue-600/10 to-background/95 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px] [mask-image:radial-gradient(white,transparent_70%)]" />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
            <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
              Get Started Today
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Ready to Start Your CS2 Server?</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              Get your server up and running in minutes with our instant setup process. Join thousands of satisfied CS2
              players today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8">
                Get Started Now
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8">
                View All Plans
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              No credit card required. 7-day free trial available on all plans.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

function CS2PlanCard({
  title,
  price,
  tickRate,
  cpu,
  ram,
  storage,
  slots,
  locations,
  popular = false,
}: {
  title: string
  price: string
  tickRate: string
  cpu: string
  ram: string
  storage: string
  slots: string
  locations: string
  popular?: boolean
}) {
  return (
    <Card
      className={`relative overflow-hidden h-full ${popular ? "border-blue-600 shadow-lg shadow-blue-600/10" : "border-border/50"}`}
    >
      {popular && (
        <div className="absolute top-0 right-0">
          <div className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">Most Popular</div>
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        <div className="mt-1">
          <span className="text-2xl font-bold">{price}</span>
          <span className="text-muted-foreground">/month</span>
        </div>
      </CardHeader>
      <CardContent className="pb-2 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Tick Rate</span>
            <span className="text-sm font-medium">{tickRate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">CPU</span>
            <span className="text-sm font-medium">{cpu}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">RAM</span>
            <span className="text-sm font-medium">{ram}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Storage</span>
            <span className="text-sm font-medium">{storage}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Slots</span>
            <span className="text-sm font-medium">{slots}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Locations</span>
            <span className="text-sm font-medium">{locations}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
    className={`w-full rounded-full ${popular ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`}
    onClick={() => window.open("https://snowhost.cloud/login", "_blank")}
  >
          Select Plan
        </Button>
      </CardFooter>
    </Card>
  )
}

function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function FeatureCard({
  title,
  description,
  icon,
  color = "blue",
}: {
  title: string
  description: string
  icon: React.ReactNode
  color?: string
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 space-y-4 rounded-xl border border-border/50 bg-card/30 hover:bg-card/50 transition-all duration-300 h-full">
      <div className={`p-3 rounded-full bg-${color}-600/10`}>{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

