"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Server, Globe, Cpu, Shield, Zap, Clock, Headset, ChevronRight } from "lucide-react"
import Link from "next/link"
import ServerStatusDisplay from "@/components/server-status-display"
import Image from "next/image"
import { motion } from "framer-motion"
// Import the 3D server visualization component
import ServerVisualization from "@/components/3d-server-visualization"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-36 bg-gradient-to-b from-background via-background/95 to-background/90">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px] [mask-image:radial-gradient(white,transparent_70%)]" />

        {/* Animated gradient orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "12s" }}
        />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
                99.9% Uptime Guarantee
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Snow <span className="text-blue-600">Hosting</span> Solutions
            </motion.h1>

            <motion.p
              className="max-w-[700px] text-muted-foreground md:text-xl/relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              sEverything you need for gaming, VPS, VDS, and web hosting with premium performance and 24/7 support.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8" asChild>
                <Link href="/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
                <Link href="/pricing">View Plans</Link>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Decorative server illustration */}
        <motion.div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-6xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 0.2, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <svg viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="currentColor"
              className="text-blue-600/10"
            ></path>
          </svg>
        </motion.div>
      </section>

      {/* Server Status */}
      <section className="py-8 border-t border-border/40 bg-background/95">
        <div className="container px-4 md:px-6">
          <ServerStatusDisplay />
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
              Our Services
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Premium Hosting Solutions</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Choose the perfect hosting solution for your needs with our range of specialized services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Gaming Hosting",
                description: "Low-latency servers optimized for gaming with DDoS protection.",
                icon: <Server className="h-12 w-12 text-blue-600" />,
                href: "/services/gaming",
                delay: 0,
              },
              {
                title: "VPS Hosting",
                description: "Virtual private servers with dedicated resources and full root access.",
                icon: <Cpu className="h-12 w-12 text-blue-600" />,
                href: "/services/vps",
                delay: 0.1,
              },
              {
                title: "VDS Hosting",
                description: "Virtual dedicated servers with enhanced isolation and performance.",
                icon: <Shield className="h-12 w-12 text-blue-600" />,
                href: "/services/vds",
                delay: 0.2,
              },
              {
                title: "Web Hosting",
                description: "Reliable web hosting with one-click installs and 99.9% uptime.",
                icon: <Globe className="h-12 w-12 text-blue-600" />,
                href: "/services/web",
                delay: 0.3,
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: service.delay }}
              >
                <ServiceCard
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  href={service.href}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-black/40 to-background/95 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px] [mask-image:radial-gradient(white,transparent_70%)]" />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
              Why Choose Us
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Why Choose <span className="text-blue-600">SnowHost</span>
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Experience the difference with our premium hosting features and benefits.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Lightning Fast Performance",
                description: "SSD storage and optimized server configurations for maximum speed.",
                icon: <Zap className="h-8 w-8 text-blue-600" />,
                delay: 0,
              },
              {
                title: "99.9% Uptime Guarantee",
                description: "Reliable service with minimal downtime and performance monitoring.",
                icon: <Clock className="h-8 w-8 text-blue-600" />,
                delay: 0.1,
              },
              {
                title: "24/7 Expert Support",
                description: "Technical support available around the clock to assist you.",
                icon: <Headset className="h-8 w-8 text-blue-600" />,
                delay: 0.2,
              },
              {
                title: "DDoS Protection",
                description: "Advanced protection against distributed denial-of-service attacks.",
                icon: <Shield className="h-8 w-8 text-blue-600" />,
                delay: 0.3,
              },
              {
                title: "Scalable Resources",
                description: "Easily upgrade your plan as your needs grow without downtime.",
                icon: <Cpu className="h-8 w-8 text-blue-600" />,
                delay: 0.4,
              },
              {
                title: "Global Network",
                description: "Strategically located data centers for optimal performance worldwide.",
                icon: <Globe className="h-8 w-8 text-blue-600" />,
                delay: 0.5,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: feature.delay }}
              >
                <FeatureCard title={feature.title} description={feature.description} icon={feature.icon} />
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-center mb-8">Interactive Server Visualization</h3>
            <ServerVisualization />
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
              Testimonials
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">What Our Customers Say</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Don't just take our word for it. Here's what our customers have to say about SnowHost.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "SnowHost has been a game-changer for our Minecraft server. The performance is incredible, and their support team is always there when we need them.",
                author: "Snow",
                role: "Gaming Community Owner",
                delay: 0,
              },
              {
                quote:
                  "I've tried many hosting providers, but SnowHost offers the best balance of performance, reliability, and price. Their VPS hosting is unmatched.",
                author: "Pablo.ejs",
                role: "Web Developer",
                delay: 0.1,
              },
              {
                quote:
                  "The uptime is truly impressive. In the past year, our website has experienced zero downtime, which is crucial for our e-commerce business.",
                author: "technoksa",
                role: "E-commerce Business Owner",
                delay: 0.2,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: testimonial.delay }}
              >
                <TestimonialCard quote={testimonial.quote} author={testimonial.author} role={testimonial.role} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 md:py-28 bg-black/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px] [mask-image:radial-gradient(white,transparent_70%)]" />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
              Pricing
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Transparent <span className="text-blue-600">Pricing</span> Plans
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Choose the perfect plan for your needs with our flexible pricing options.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Starter",
                price: "$4.99",
                description: "Perfect for small projects and personal websites",
                features: ["2GB RAM", "20GB SSD Storage", "1 CPU Core", "1TB Bandwidth", "24/7 Support"],
                popular: false,
                delay: 0,
              },
              {
                title: "Professional",
                price: "$12.99",
                description: "Ideal for growing businesses and gaming servers",
                features: [
                  "8GB RAM",
                  "50GB SSD Storage",
                  "2 CPU Cores",
                  "2TB Bandwidth",
                  "Priority Support",
                  "DDoS Protection",
                ],
                popular: true,
                delay: 0.1,
              },
              {
                title: "Enterprise",
                price: "$24.99",
                description: "For high-traffic websites and demanding applications",
                features: [
                  "16GB RAM",
                  "100GB SSD Storage",
                  "4 CPU Cores",
                  "5TB Bandwidth",
                  "Priority Support",
                  "DDoS Protection",
                  "Daily Backups",
                ],
                popular: false,
                delay: 0.2,
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: plan.delay }}
              >
                <PricingCard
                  title={plan.title}
                  price={plan.price}
                  description={plan.description}
                  features={plan.features}
                  popular={plan.popular}
                />
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Button variant="outline" className="rounded-full px-8" asChild>
              <Link href="/pricing">
                View All Plans
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-blue-600/10 to-background/95 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px] [mask-image:radial-gradient(white,transparent_70%)]" />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div
              className="space-y-6 lg:w-1/2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
                Get Started Today
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Ready to Experience Premium Hosting?
              </h2>
              <p className="text-muted-foreground md:text-lg max-w-[600px]">
                Join thousands of satisfied customers who trust SnowHost for their hosting needs. Get started today
                with our 30-day money-back guarantee.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8" asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              className="lg:w-1/2 relative h-[300px] w-full rounded-2xl overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Image
                src="/dedicated-server-feature.webp?height=600&width=800"
                alt="Server rack visualization"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-50"></div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

function ServiceCard({
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
    <Card className="bg-card/50 border-border/50 hover:bg-card/80 transition-all duration-300 group h-full">
      <CardHeader>
        <div className="mb-2 p-3 rounded-full bg-blue-600/10 w-fit">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-muted-foreground min-h-[80px]">{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Link href={href} passHref className="w-full">
          <Button variant="ghost" className="w-full justify-between group-hover:text-blue-600 transition-colors">
            Learn More
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 space-y-4 rounded-xl border border-border/50 bg-card/30 hover:bg-card/50 transition-all duration-300 h-full">
      <div className="p-3 rounded-full bg-blue-600/10">{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

function TestimonialCard({
  quote,
  author,
  role,
}: {
  quote: string
  author: string
  role: string
}) {
  return (
    <Card className="bg-card/50 border-border/50 hover:bg-card/80 transition-all duration-300 h-full">
      <CardContent className="pt-6">
        <div className="mb-4 text-4xl text-blue-600">"</div>
        <p className="italic mb-6">{quote}</p>
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-600 font-bold mr-3">
            {author.charAt(0)}
          </div>
          <div>
            <p className="font-semibold">{author}</p>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PricingCard({
  title,
  price,
  description,
  features,
  popular,
}: {
  title: string
  price: string
  description: string
  features: string[]
  popular: boolean
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
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <div className="mt-2">
          <span className="text-3xl font-bold">{price}</span>
          <span className="text-muted-foreground">/month</span>
        </div>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className={`w-full rounded-full ${popular ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`}>
          Get Started
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

