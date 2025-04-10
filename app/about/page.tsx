"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Server, Globe, Clock, Zap, Heart } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"

export default function AboutPage() {
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
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "12s" }}
        />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
              Our Story
            </Badge>
            <h1 className="text-4xl font-bold tracking-tighter md:text-5xl/tight lg:text-6xl/tight">
              About <span className="text-blue-600">NexusHost</span>
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              We're on a mission to provide the most reliable, high-performance hosting solutions for gamers,
              developers, and businesses worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              className="lg:w-1/2 relative h-[400px] w-full rounded-2xl overflow-hidden"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop"
                alt="NexusHost team"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-30"></div>
            </motion.div>

            <motion.div
              className="lg:w-1/2 space-y-6"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
                Our Journey
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">From Gamers to Hosting Experts</h2>
              <p className="text-muted-foreground md:text-lg">
                NexusHost was founded in 2018 by a group of passionate gamers who were frustrated with the lack of
                reliable, high-performance hosting options for their gaming servers. What started as a small operation
                serving local gaming communities has grown into a global hosting provider with data centers across five
                continents.
              </p>
              <p className="text-muted-foreground md:text-lg">
                Our team combines technical expertise with a deep understanding of what gamers, developers, and
                businesses need from their hosting services. We're committed to providing not just servers, but complete
                solutions that help our customers succeed.
              </p>
              <div className="pt-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8">
                  Meet Our Team
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 md:py-28 bg-black/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px] [mask-image:radial-gradient(white,transparent_70%)]" />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
              Our Values
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              What Drives <span className="text-blue-600">Us</span>
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Our core values shape everything we do, from how we build our products to how we interact with our
              customers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Performance",
                description:
                  "We're obsessed with speed and reliability. Our infrastructure is built to deliver the best possible performance for your applications.",
                icon: <Zap className="h-8 w-8 text-blue-600" />,
                delay: 0,
              },
              {
                title: "Reliability",
                description:
                  "Downtime is not an option. We engineer our systems for maximum uptime and have redundancies at every level.",
                icon: <Clock className="h-8 w-8 text-blue-600" />,
                delay: 0.1,
              },
              {
                title: "Innovation",
                description:
                  "Technology never stands still, and neither do we. We're constantly exploring new ways to improve our services.",
                icon: <Globe className="h-8 w-8 text-blue-600" />,
                delay: 0.2,
              },
              {
                title: "Customer Focus",
                description:
                  "Our customers' success is our success. We provide the support and tools you need to achieve your goals.",
                icon: <Heart className="h-8 w-8 text-blue-600" />,
                delay: 0.3,
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: value.delay }}
              >
                <Card className="bg-card/50 border-border/50 hover:bg-card/80 transition-all duration-300 h-full">
                  <CardContent className="pt-6 flex flex-col items-center text-center">
                    <div className="p-3 rounded-full bg-blue-600/10 mb-4">{value.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
              Our Impact
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              NexusHost by the <span className="text-blue-600">Numbers</span>
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              We're proud of what we've accomplished and the trust our customers place in us.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: "50,000+",
                label: "Active Servers",
                icon: <Server className="h-8 w-8 text-blue-600" />,
                delay: 0,
              },
              {
                number: "99.99%",
                label: "Uptime",
                icon: <Clock className="h-8 w-8 text-blue-600" />,
                delay: 0.1,
              },
              {
                number: "15+",
                label: "Global Data Centers",
                icon: <Globe className="h-8 w-8 text-blue-600" />,
                delay: 0.2,
              },
              {
                number: "24/7",
                label: "Customer Support",
                icon: <Headset className="h-8 w-8 text-blue-600" />,
                delay: 0.3,
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: stat.delay }}
              >
                <Card className="bg-card/50 border-border/50 hover:bg-card/80 transition-all duration-300 h-full">
                  <CardContent className="pt-6 flex flex-col items-center text-center">
                    <div className="p-3 rounded-full bg-blue-600/10 mb-4">{stat.icon}</div>
                    <h3 className="text-4xl font-bold mb-2 text-blue-600">{stat.number}</h3>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 md:py-28 bg-black/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px] [mask-image:radial-gradient(white,transparent_70%)]" />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
              Our Team
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Meet the <span className="text-blue-600">People</span> Behind NexusHost
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Our diverse team of experts is passionate about technology and committed to your success.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Alex Johnson",
                role: "CEO & Co-Founder",
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop",
                delay: 0,
              },
              {
                name: "Sarah Williams",
                role: "CTO",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
                delay: 0.1,
              },
              {
                name: "Michael Chen",
                role: "Head of Operations",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop",
                delay: 0.2,
              },
              {
                name: "Emily Rodriguez",
                role: "Customer Success Director",
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop",
                delay: 0.3,
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: member.delay }}
              >
                <Card className="bg-card/50 border-border/50 hover:bg-card/80 transition-all duration-300 h-full overflow-hidden">
                  <div className="relative h-64 w-full">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <CardContent className="pt-4 text-center">
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="text-muted-foreground">{member.role}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8">
              View Full Team
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Careers CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-blue-600/10 to-background/95 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px] [mask-image:radial-gradient(white,transparent_70%)]" />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              className="lg:w-1/2 space-y-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
                Join Our Team
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Grow Your Career with NexusHost</h2>
              <p className="text-muted-foreground md:text-lg">
                We're always looking for talented individuals who are passionate about technology and customer service.
                Join our team and help shape the future of hosting.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8" asChild>
                  <Link href="/careers">
                    View Open Positions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="rounded-full px-8">
                  Learn About Benefits
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
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                alt="NexusHost team working"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-30"></div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

function Headset(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M3 11h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2Z" />
      <path d="M19 11h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2Z" />
      <path d="M3 15v-3a9 9 0 0 1 18 0v3" />
    </svg>
  )
}

