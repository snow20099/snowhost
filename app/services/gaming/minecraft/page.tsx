"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Server, Shield, Zap, Gamepad2, Clock, Globe, Cpu } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

export default function MinecraftHostingPage() {
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
                Minecraft Hosting
              </Badge>
              <h1 className="text-4xl font-bold tracking-tighter md:text-5xl/tight lg:text-6xl/tight">
                Premium <span className="text-blue-600">Minecraft</span> Server Hosting
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                High-performance Minecraft servers with instant setup, mod support, and automatic backups for
                communities of all sizes.
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
                src="https://image.api.playstation.com/vulcan/ap/rnd/202407/1020/91fe046f742042e3b31e57f7731dbe2226e1fd1e02a36223.jpg"
                alt="Minecraft server visualization"
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
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Choose Your Perfect Minecraft Server
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              From small survival servers to large modded communities, we have the perfect plan for your Minecraft
              world.
            </p>
          </div>

          <Tabs defaultValue="java" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto mb-8">
              <TabsTrigger
                value="java"
                className="data-[state=active]:bg-blue-600/10 data-[state=active]:text-blue-600"
              >
                Java Edition
              </TabsTrigger>
              <TabsTrigger
                value="bedrock"
                className="data-[state=active]:bg-blue-600/10 data-[state=active]:text-blue-600"
              >
                Bedrock Edition
              </TabsTrigger>
            </TabsList>

            <TabsContent value="java" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {[
                  {
                    title: "Starter",
                    price: "$1",
                    ram: "1GB",
                    cpu: "1 vCore",
                    storage: "10GB SSD",
                    players: "10",
                    plugins: "5",
                    backups: "Daily",
                    popular: false,
                    delay: 0,
                  },
                  {
                    title: "Basic",
                    price: "$2",
                    ram: "2GB",
                    cpu: "2 vCores",
                    storage: "20GB SSD",
                    players: "20",
                    plugins: "10",
                    backups: "Daily",
                    popular: false,
                    delay: 0.1,
                  },
                  {
                    title: "Standard",
                    price: "$4",
                    ram: "4GB",
                    cpu: "2 vCores",
                    storage: "40GB SSD",
                    players: "40",
                    plugins: "Unlimited",
                    backups: "12-Hour",
                    popular: true,
                    delay: 0.2,
                  },
                  {
                    title: "Premium",
                    price: "$8",
                    ram: "8GB",
                    cpu: "4 vCores",
                    storage: "80GB SSD",
                    players: "80",
                    plugins: "Unlimited",
                    backups: "6-Hour",
                    popular: false,
                    delay: 0.3,
                  },
                  {
                    title: "Ultimate",
                    price: "$12",
                    ram: "12GB",
                    cpu: "6 vCores",
                    storage: "120GB NVMe",
                    players: "120",
                    plugins: "Unlimited",
                    backups: "3-Hour",
                    popular: false,
                    delay: 0.4,
                  },
                  {
                    title: "Enterprise",
                    price: "$16",
                    ram: "16GB",
                    cpu: "8 vCores",
                    storage: "160GB NVMe",
                    players: "Unlimited",
                    plugins: "Unlimited",
                    backups: "Hourly",
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
                    <MinecraftPlanCard
                      title={plan.title}
                      price={plan.price}
                      ram={plan.ram}
                      cpu={plan.cpu}
                      storage={plan.storage}
                      players={plan.players}
                      plugins={plan.plugins}
                      backups={plan.backups}
                      popular={plan.popular}
                    />
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="bedrock" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {[
                  {
                    title: "Starter",
                    price: "$1",
                    ram: "1GB",
                    cpu: "1 vCore",
                    storage: "10GB SSD",
                    players: "10",
                    addons: "5",
                    backups: "Daily",
                    popular: false,
                    delay: 0,
                  },
                  {
                    title: "Basic",
                    price: "$2",
                    ram: "2GB",
                    cpu: "2 vCores",
                    storage: "20GB SSD",
                    players: "20",
                    addons: "10",
                    backups: "Daily",
                    popular: false,
                    delay: 0.1,
                  },
                  {
                    title: "Standard",
                    price: "$4",
                    ram: "4GB",
                    cpu: "2 vCores",
                    storage: "40GB SSD",
                    players: "40",
                    addons: "Unlimited",
                    backups: "12-Hour",
                    popular: true,
                    delay: 0.2,
                  },
                  {
                    title: "Premium",
                    price: "$8",
                    ram: "8GB",
                    cpu: "4 vCores",
                    storage: "80GB SSD",
                    players: "80",
                    addons: "Unlimited",
                    backups: "6-Hour",
                    popular: false,
                    delay: 0.3,
                  },
                  {
                    title: "Ultimate",
                    price: "$12",
                    ram: "12GB",
                    cpu: "6 vCores",
                    storage: "120GB NVMe",
                    players: "120",
                    addons: "Unlimited",
                    backups: "3-Hour",
                    popular: false,
                    delay: 0.4,
                  },
                  {
                    title: "Enterprise",
                    price: "$16",
                    ram: "16GB",
                    cpu: "8 vCores",
                    storage: "160GB NVMe",
                    players: "Unlimited",
                    addons: "Unlimited",
                    backups: "Hourly",
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
                    <MinecraftPlanCard
                      title={plan.title}
                      price={plan.price}
                      ram={plan.ram}
                      cpu={plan.cpu}
                      storage={plan.storage}
                      players={plan.players}
                      plugins={plan.addons}
                      backups={plan.backups}
                      popular={plan.popular}
                      isBedrock={true}
                    />
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
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
              Minecraft Server <span className="text-blue-600">Features</span>
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Our Minecraft servers come with everything you need for the best gaming experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "One-Click Mod Installation",
                description: "Install popular modpacks like Forge, Fabric, Spigot, and Paper with just one click.",
                icon: <Zap className="h-8 w-8 text-blue-600" />,
                delay: 0,
              },
              {
                title: "DDoS Protection",
                description:
                  "Advanced protection against distributed denial-of-service attacks to keep your server online.",
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
                title: "Plugin Manager",
                description: "Easy installation and management of plugins with our built-in plugin manager.",
                icon: <Gamepad2 className="h-8 w-8 text-blue-600" />,
                delay: 0.3,
              },
              {
                title: "Automatic Backups",
                description: "Regular automated backups to protect your world data and player progress.",
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
                title: "Subdomain & Custom Domain",
                description: "Get a free subdomain or use your own custom domain for your Minecraft server.",
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
                <FeatureCard title={feature.title} description={feature.description} icon={feature.icon} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modpack Support */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
              Modpack Support
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Popular Modpacks & <span className="text-blue-600">Server Types</span>
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              We support a wide range of Minecraft modpacks and server types with one-click installation.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "Vanilla", icon: <Gamepad2 className="h-6 w-6" /> },
              { name: "Spigot", icon: <Gamepad2 className="h-6 w-6" /> },
              { name: "Paper", icon: <Gamepad2 className="h-6 w-6" /> },
              { name: "Forge", icon: <Gamepad2 className="h-6 w-6" /> },
              { name: "Fabric", icon: <Gamepad2 className="h-6 w-6" /> },
              { name: "Bukkit", icon: <Gamepad2 className="h-6 w-6" /> },
              { name: "SpongeForge", icon: <Gamepad2 className="h-6 w-6" /> },
              { name: "CraftBukkit", icon: <Gamepad2 className="h-6 w-6" /> },
              { name: "Purpur", icon: <Gamepad2 className="h-6 w-6" /> },
              { name: "Mohist", icon: <Gamepad2 className="h-6 w-6" /> },
              { name: "Magma", icon: <Gamepad2 className="h-6 w-6" /> },
              { name: "Tuinity", icon: <Gamepad2 className="h-6 w-6" /> },
            ].map((modpack, index) => (
              <motion.div
                key={modpack.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="bg-card/50 border-border/50 hover:bg-card/80 transition-all duration-300 h-full">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <div className="p-2 rounded-full bg-blue-600/10 mb-3">{modpack.icon}</div>
                    <h3 className="font-medium text-sm">{modpack.name}</h3>
                  </CardContent>
                </Card>
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
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Easy Minecraft Server Management
              </h2>
              <p className="text-muted-foreground md:text-lg">
                Our intuitive control panel makes it easy to manage your Minecraft server, install mods, configure
                settings, and monitor performance.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-2" />
                  <span>One-click modpack installation</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-2" />
                  <span>Easy plugin management</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-2" />
                  <span>Real-time console access</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-2" />
                  <span>Server restart and power management</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-2" />
                  <span>File manager with code editor</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-2" />
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
                src="https://images.unsplash.com/photo-1633419461186-7d40a38105ec?q=80&w=1780&auto=format&fit=crop"
                alt="Minecraft server control panel"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-30"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
              FAQ
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Frequently Asked <span className="text-blue-600">Questions</span>
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Find answers to common questions about our Minecraft hosting services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                question: "How do I install mods on my Minecraft server?",
                answer:
                  "Our control panel makes it easy to install mods with just one click. Simply navigate to the 'Mods' section, select the modpack you want to install, and click 'Install'. You can also upload custom mods via the file manager.",
              },
              {
                question: "Can I upgrade my plan later?",
                answer:
                  "Yes, you can upgrade your plan at any time with just a few clicks. Your server will be automatically migrated to the new plan with minimal downtime.",
              },
              {
                question: "How many players can join my server?",
                answer:
                  "The number of players depends on your plan, ranging from 10 players on our Starter plan to unlimited players on our Enterprise plan. The actual performance will depend on your server's mods and plugins.",
              },
              {
                question: "Do you offer a money-back guarantee?",
                answer:
                  "Yes, we offer a 7-day money-back guarantee on all our Minecraft hosting plans. If you're not satisfied with our service, you can request a full refund within 7 days of your purchase.",
              },
              {
                question: "Can I use my own domain name?",
                answer:
                  "Yes, you can use your own domain name with our Minecraft hosting. We provide a free subdomain (yourserver.snowhost.cloud) by default, but you can easily set up your custom domain through our control panel.",
              },
              {
                question: "How often are backups created?",
                answer:
                  "Backup frequency depends on your plan, ranging from daily backups on our Starter and Basic plans to hourly backups on our Enterprise plan. You can also create manual backups at any time.",
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
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Ready to Start Your Minecraft Server?
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              Get your server up and running in minutes with our instant setup process. Join thousands of satisfied
              Minecraft players today!
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

function MinecraftPlanCard({
  title,
  price,
  ram,
  cpu,
  storage,
  players,
  plugins,
  backups,
  popular = false,
  isBedrock = false,
}: {
  title: string
  price: string
  ram: string
  cpu: string
  storage: string
  players: string
  plugins: string
  backups: string
  popular?: boolean
  isBedrock?: boolean
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
            <span className="text-sm text-muted-foreground">RAM</span>
            <span className="text-sm font-medium">{ram}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">CPU</span>
            <span className="text-sm font-medium">{cpu}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Storage</span>
            <span className="text-sm font-medium">{storage}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Players</span>
            <span className="text-sm font-medium">{players}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">{isBedrock ? "Add-ons" : "Plugins"}</span>
            <span className="text-sm font-medium">{plugins}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Backups</span>
            <span className="text-sm font-medium">{backups}</span>
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

