import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import HexMapGlow from "@/components/HexMapGlow"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WorldMap from '@/components/WorldMap'
import { Shield, Zap, Globe, Cpu, Clock, Headset, Lock, BarChart, Cloud, Repeat, Smartphone } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function FeaturesPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-b from-background to-background/90">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px] [mask-image:radial-gradient(white,transparent_70%)]" />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
              Premium Features
            </Badge>
            <h1 className="text-4xl font-bold tracking-tighter md:text-5xl/tight">
              Powerful <span className="text-blue-600">Features</span> for Your Hosting Needs
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Discover the advanced features that make our hosting services stand out from the competition.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Categories */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="management">Management</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureCard
                  title="SSD Storage"
                  description="All hosting plans include fast SSD storage for optimal performance and reliability."
                  icon={<Zap className="h-8 w-8 text-blue-600" />}
                  category="performance"
                />
                <FeatureCard
                  title="DDoS Protection"
                  description="Advanced protection against distributed denial-of-service attacks to keep your services online."
                  icon={<Shield className="h-8 w-8 text-blue-600" />}
                  category="security"
                />
                <FeatureCard
                  title="99.9% Uptime"
                  description="We guarantee 99.9% uptime for all our hosting services with monitoring and alerts."
                  icon={<Clock className="h-8 w-8 text-blue-600" />}
                  category="performance"
                />
                <FeatureCard
                  title="24/7 Support"
                  description="Technical support available around the clock to assist you with any issues."
                  icon={<Headset className="h-8 w-8 text-blue-600" />}
                  category="management"
                />
                <FeatureCard
                  title="Automated Backups"
                  description="Regular automated backups to protect your data and ensure quick recovery."
                  icon={<Repeat className="h-8 w-8 text-blue-600" />}
                  category="management"
                />
                <FeatureCard
                  title="SSL Certificates"
                  description="Free SSL certificates for all your domains to ensure secure connections."
                  icon={<Lock className="h-8 w-8 text-blue-600" />}
                  category="security"
                />
                <FeatureCard
                  title="Resource Monitoring"
                  description="Real-time monitoring of server resources with detailed analytics and alerts."
                  icon={<BarChart className="h-8 w-8 text-blue-600" />}
                  category="management"
                />
                <FeatureCard
                  title="Global CDN"
                  description="Content delivery network for faster loading times worldwide."
                  icon={<Globe className="h-8 w-8 text-blue-600" />}
                  category="performance"
                />
                <FeatureCard
                  title="Scalable Resources"
                  description="Easily scale your resources up or down as your needs change without downtime."
                  icon={<Cpu className="h-8 w-8 text-blue-600" />}
                  category="management"
                />
                <FeatureCard
                  title="Cloud Infrastructure"
                  description="Built on reliable cloud infrastructure for maximum stability and performance."
                  icon={<Cloud className="h-8 w-8 text-blue-600" />}
                  category="performance"
                />
                <FeatureCard
                  title="Firewall Protection"
                  description="Advanced firewall protection to safeguard your servers from threats."
                  icon={<Shield className="h-8 w-8 text-blue-600" />}
                  category="security"
                />
                <FeatureCard
                  title="Mobile Management"
                  description="Manage your servers on the go with our mobile-friendly control panel."
                  icon={<Smartphone className="h-8 w-8 text-blue-600" />}
                  category="management"
                />
              </div>
            </TabsContent>

            <TabsContent value="performance" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureCard
                  title="SSD Storage"
                  description="All hosting plans include fast SSD storage for optimal performance and reliability."
                  icon={<Zap className="h-8 w-8 text-blue-600" />}
                  category="performance"
                />
                <FeatureCard
                  title="99.9% Uptime"
                  description="We guarantee 99.9% uptime for all our hosting services with monitoring and alerts."
                  icon={<Clock className="h-8 w-8 text-blue-600" />}
                  category="performance"
                />
                <FeatureCard
                  title="Global CDN"
                  description="Content delivery network for faster loading times worldwide."
                  icon={<Globe className="h-8 w-8 text-blue-600" />}
                  category="performance"
                />
                <FeatureCard
                  title="Cloud Infrastructure"
                  description="Built on reliable cloud infrastructure for maximum stability and performance."
                  icon={<Cloud className="h-8 w-8 text-blue-600" />}
                  category="performance"
                />
              </div>
            </TabsContent>

            <TabsContent value="security" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureCard
                  title="DDoS Protection"
                  description="Advanced protection against distributed denial-of-service attacks to keep your services online."
                  icon={<Shield className="h-8 w-8 text-blue-600" />}
                  category="security"
                />
                <FeatureCard
                  title="SSL Certificates"
                  description="Free SSL certificates for all your domains to ensure secure connections."
                  icon={<Lock className="h-8 w-8 text-blue-600" />}
                  category="security"
                />
                <FeatureCard
                  title="Firewall Protection"
                  description="Advanced firewall protection to safeguard your servers from threats."
                  icon={<Shield className="h-8 w-8 text-blue-600" />}
                  category="security"
                />
              </div>
            </TabsContent>

            <TabsContent value="management" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureCard
                  title="24/7 Support"
                  description="Technical support available around the clock to assist you with any issues."
                  icon={<Headset className="h-8 w-8 text-blue-600" />}
                  category="management"
                />
                <FeatureCard
                  title="Automated Backups"
                  description="Regular automated backups to protect your data and ensure quick recovery."
                  icon={<Repeat className="h-8 w-8 text-blue-600" />}
                  category="management"
                />
                <FeatureCard
                  title="Resource Monitoring"
                  description="Real-time monitoring of server resources with detailed analytics and alerts."
                  icon={<BarChart className="h-8 w-8 text-blue-600" />}
                  category="management"
                />
                <FeatureCard
                  title="Scalable Resources"
                  description="Easily scale your resources up or down as your needs change without downtime."
                  icon={<Cpu className="h-8 w-8 text-blue-600" />}
                  category="management"
                />
                <FeatureCard
                  title="Mobile Management"
                  description="Manage your servers on the go with our mobile-friendly control panel."
                  icon={<Smartphone className="h-8 w-8 text-blue-600" />}
                  category="management"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Control Panel */}
      <section className="py-16 md:py-24 bg-black/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="space-y-4 lg:w-1/2">
              <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
                Easy Management
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Powerful Control Panel</h2>
              <p className="text-muted-foreground md:text-lg max-w-[600px]">
                Our intuitive control panel makes it easy to manage your servers, monitor performance, and configure
                settings. Access everything you need in one place.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span>One-click application installations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span>Real-time resource monitoring</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span>Easy backup and restore</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span>Server restart and power management</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span>File manager with code editor</span>
                </li>
              </ul>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 mt-4" asChild>
                <Link href="/dashboard">
                  Try Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="lg:w-1/2 relative h-[300px] w-full rounded-lg overflow-hidden border border-border/50">
              <Image
                src="/Screenshot 2025-08-05 201555.png?height=600&width=800"
                alt="Control panel dashboard"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Network Infrastructure */}
<section className="py-16 md:py-24 bg-background">
  <div className="container px-4 md:px-6">
    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
      <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
        Global Network
      </Badge>
      <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Premium Network Infrastructure</h2>
      <p className="max-w-[700px] text-muted-foreground md:text-lg">
        Our global network of data centers ensures low latency and high availability for your services.
      </p>
    </div>
    <div className="relative h-[400px] w-full rounded-lg overflow-hidden border border-border/50">
      <WorldMap />
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NetworkLocationCard location="North America" ping="10ms" />
          <NetworkLocationCard location="Europe" ping="25ms" />
          <NetworkLocationCard location="Asia" ping="40ms" />
          <NetworkLocationCard location="Australia" ping="60ms" />
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Technical Specifications */}
      <section className="py-16 md:py-24 bg-blue-600/10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Technical Specifications</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Our hosting infrastructure is built with the latest technology to ensure optimal performance.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SpecificationCard
              title="Hardware"
              specs={[
                "Intel Xeon Processors",
                "DDR4 ECC RAM",
                "NVMe SSD Storage",
                "RAID 10 Configuration",
                "Redundant Power Supplies",
              ]}
            />
            <SpecificationCard
              title="Network"
              specs={[
                "100 Gbps Network Capacity",
                "Multiple Tier-1 Providers",
                "BGP Routing",
                "Anti-DDoS Protection",
                "IPv4 and IPv6 Support",
              ]}
            />
            <SpecificationCard
              title="Software"
              specs={[
                "Latest Linux Distributions",
                "Windows Server Options",
                "cPanel/WHM/Plesk Available",
                "Docker Support",
                "One-Click Application Installer",
              ]}
            />
            <SpecificationCard
              title="Security"
              specs={[
                "Hardware Firewall Protection",
                "DDoS Mitigation",
                "Free SSL Certificates",
                "Regular Security Updates",
                "Intrusion Detection System",
              ]}
            />
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({
  title,
  description,
  icon,
  category,
}: {
  title: string
  description: string
  icon: React.ReactNode
  category: string
}) {
  return (
    <Card className="bg-card/50 border-border/50 hover:bg-card/80 transition-all duration-200">
      <CardHeader>
        <div className="p-3 rounded-full bg-blue-600/10 w-fit mb-4">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-muted-foreground">{description}</CardDescription>
      </CardContent>
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

function NetworkLocationCard({ location, ping }: { location: string; ping: string }) {
  return (
    <Card className="bg-card/80 border-border/50">
      <CardContent className="p-4 flex flex-col items-center text-center">
        <p className="font-medium">{location}</p>
        <p className="text-sm text-muted-foreground">Avg. Ping: {ping}</p>
      </CardContent>
    </Card>
  )
}

function SpecificationCard({ title, specs }: { title: string; specs: string[] }) {
  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {specs.map((spec, index) => (
            <li key={index} className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
              <span>{spec}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

