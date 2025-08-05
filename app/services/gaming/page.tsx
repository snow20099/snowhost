"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Server, Shield, Zap, Gamepad2, Globe, Clock, Cpu, BarChart } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"

export default function GamingHostingPage() {
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
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <motion.div
              className="space-y-6 lg:w-1/2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
                Low Latency Gaming
              </Badge>
              <h1 className="text-4xl font-bold tracking-tighter md:text-5xl/tight lg:text-6xl/tight">
                Premium <span className="text-blue-600">Gaming</span> Hosting
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                High-performance servers optimized for gaming with DDoS protection, low latency, and 24/7 support.
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
                alt="Gaming server visualization"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-50"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Game Types */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
              Game Servers
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Optimized for Your Favorite Games</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Our gaming servers are specifically configured for optimal performance across various game types.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Minecraft",
                description:
                  "High-performance Minecraft servers with instant setup, mod support, and automatic backups.",
                image: "https://image.api.playstation.com/vulcan/ap/rnd/202407/1020/91fe046f742042e3b31e57f7731dbe2226e1fd1e02a36223.jpg",
                href: "/services/gaming/minecraft",
                delay: 0,
              },
              {
                title: "Counter-Strike 2",
                description:
                  "Low-latency CS2 servers with advanced anti-cheat integration and customizable configurations.",
                image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=2076&auto=format&fit=crop",
                href: "/services/gaming/cs2",
                delay: 0.1,
              },
              {
                title: "FiveM",
                description:
                  "Customizable FiveM servers with resource management, database integration, and high performance.",
                image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop",
                href: "/services/gaming/fivem",
                delay: 0.2,
              },
              {
                title: "ARK: Survival Evolved",
                description: "Powerful ARK servers with high RAM allocation, SSD storage, and mod support.",
                image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1947&auto=format&fit=crop",
                href: "/services/gaming/ark",
                delay: 0.3,
              },
            ].map((game, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: game.delay }}
              >
                <Link href={game.href}>
                  <Card className="bg-card/50 border-border/50 hover:bg-card/80 transition-all duration-300 h-full overflow-hidden group">
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={game.image || "/placeholder.svg"}
                        alt={game.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-70"></div>
                      <div className="absolute bottom-4 left-4">
                        <h3 className="text-xl font-bold text-white">{game.title}</h3>
                      </div>
                    </div>
                    <CardContent className="pt-4">
                      <p className="text-muted-foreground">{game.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="ghost"
                        className="w-full justify-between group-hover:text-blue-600 transition-colors"
                      >
                        View Plans
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Games Grid */}
      <section className="py-20 md:py-28 bg-black/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px] [mask-image:radial-gradient(white,transparent_70%)]" />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
              Game Library
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              More Popular <span className="text-blue-600">Games</span> We Support
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              We offer optimized hosting for a wide range of popular games with dedicated resources and configurations.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {[
              { name: "Rust", icon: <Gamepad2 className="h-6 w-6" /> },
              { name: "Valheim", icon: <Gamepad2 className="h-6 w-6" /> },
              { name: "Terraria", icon: <Gamepad2 className="h-6 w-6" /> },
              { name: "7 Days to Die", icon: <Gamepad2 className="h-6 w-6" /> },
              { name: "Team Fortress 2", icon: <Gamepad2 className="h-6 w-6" /> },
              { name: "Garry's Mod", icon: <Gamepad2 className="h-6 w-6" /> },
              { name: "Conan Exiles", icon: <Gamepad2 className="h-6 w-6" /> },
              { name: "Factorio", icon: <Gamepad2 className="h-6 w-6" /> },
              { name: "Space Engineers", icon: <Gamepad2 className="h-6 w-6" /> },
              { name: "DayZ", icon: <Gamepad2 className="h-6 w-6" /> },
              { name: "Unturned", icon: <Gamepad2 className="h-6 w-6" /> },
              { name: "Satisfactory", icon: <Gamepad2 className="h-6 w-6" /> },
              { name: "Starbound", icon: <Gamepad2 className="h-6 w-6" /> },
              { name: "Eco", icon: <Gamepad2 className="h-6 w-6" /> },
              { name: "Assetto Corsa", icon: <Gamepad2 className="h-6 w-6" /> },
            ].map((game, index) => (
              <motion.div
                key={game.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="bg-card/50 border-border/50 hover:bg-card/80 transition-all duration-300 h-full">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <div className="p-2 rounded-full bg-blue-600/10 mb-3">{game.icon}</div>
                    <h3 className="font-medium text-sm">{game.name}</h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <Button variant="outline" className="rounded-full px-8">
              View All Games
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
              Features
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Gaming Server <span className="text-blue-600">Features</span>
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Our gaming servers come with everything you need for the best gaming experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "DDoS Protection",
                description:
                  "Advanced protection against distributed denial-of-service attacks to keep your server online.",
                icon: <Shield className="h-8 w-8 text-blue-600" />,
                delay: 0,
              },
              {
                title: "Low Latency Network",
                description: "Optimized network infrastructure for minimal lag and smooth gameplay.",
                icon: <Zap className="h-8 w-8 text-blue-600" />,
                delay: 0.1,
              },
              {
                title: "Custom Control Panel",
                description: "User-friendly control panel for easy server management and configuration.",
                icon: <Server className="h-8 w-8 text-blue-600" />,
                delay: 0.2,
              },
              {
                title: "Mod Support",
                description: "Easy installation and management of mods and plugins for your games.",
                icon: <Gamepad2 className="h-8 w-8 text-blue-600" />,
                delay: 0.3,
              },
              {
                title: "Automatic Backups",
                description: "Regular automated backups to protect your game data and progress.",
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
                title: "Scalable Resources",
                description: "Easily upgrade your server resources as your community grows.",
                icon: <Cpu className="h-8 w-8 text-blue-600" />,
                delay: 0.7,
              },
              {
                title: "Performance Monitoring",
                description: "Real-time monitoring of your server's performance with detailed statistics.",
                icon: <BarChart className="h-8 w-8 text-blue-600" />,
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
                <FeatureCard title={feature.title} description={feature.description} icon={feature.icon} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Control Panel Preview */}
      <section className="py-20 md:py-28 bg-black/40 relative overflow-hidden">
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
                Control Panel
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Powerful Game Server Management</h2>
              <p className="text-muted-foreground md:text-lg">
                Our intuitive control panel makes it easy to manage your game servers, install mods, configure settings,
                and monitor performance.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span>One-click game installation and updates</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span>Easy mod and plugin management</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span>Real-time performance monitoring</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span>Server restart and power management</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span>File manager with code editor</span>
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
                src="https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=2070&auto=format&fit=crop"
                alt="Game server control panel"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-30"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-background relative overflow-hidden">
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
              Testimonials
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              What Our <span className="text-blue-600">Gamers</span> Say
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Don't just take our word for it. Here's what our customers have to say about our gaming servers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "We've been hosting our Minecraft server with SnowHost for over a year now. The performance is incredible, and their support team is always there when we need them.",
                author: "Alex Johnson",
                role: "Minecraft Server Owner",
                game: "Minecraft",
                delay: 0,
              },
              {
                quote:
                  "The CS2 server runs flawlessly with 128-tick rate. We've had zero issues with lag or downtime, which is crucial for our competitive matches.",
                author: "Sarah Williams",
                role: "eSports Team Manager",
                game: "Counter-Strike 2",
                delay: 0.1,
              },
              {
                quote:
                  "Setting up our FiveM server was incredibly easy with SnowHost. The control panel is intuitive, and the performance has been rock solid for our roleplay community.",
                author: "Michael Chen",
                role: "FiveM Community Admin",
                game: "FiveM",
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
                <TestimonialCard
                  quote={testimonial.quote}
                  author={testimonial.author}
                  role={testimonial.role}
                  game={testimonial.game}
                />
              </motion.div>
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
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Ready to Start Your Gaming Server?
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              Get your server up and running in minutes with our instant setup process. Join thousands of satisfied
              gamers today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8">
                Get Started Now
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8">
                Contact Sales
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
  game,
}: {
  quote: string
  author: string
  role: string
  game: string
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
            <p className="text-xs text-blue-600">{game}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

