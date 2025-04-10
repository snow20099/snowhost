import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, Server, HardDrive, Globe, Shield, Activity, CreditCard, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, John. Here's an overview of your hosting services.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Add New Server</Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Servers</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.9%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bandwidth Used</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2 TB</div>
            <p className="text-xs text-muted-foreground">of 5 TB (24%)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Bill</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$149.99</div>
            <p className="text-xs text-muted-foreground">Due in 14 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Server Status */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Server Status</CardTitle>
            <CardDescription>Current status of your active servers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ServerStatusItem
                name="Gaming Server #1"
                type="Minecraft"
                status="operational"
                location="US East"
                ip="192.168.1.1"
                icon={<Server className="h-4 w-4" />}
              />
              <ServerStatusItem
                name="Web Server"
                type="WordPress"
                status="operational"
                location="EU Central"
                ip="192.168.1.2"
                icon={<Globe className="h-4 w-4" />}
              />
              <ServerStatusItem
                name="VPS #1"
                type="Ubuntu 22.04"
                status="operational"
                location="US West"
                ip="192.168.1.3"
                icon={<HardDrive className="h-4 w-4" />}
              />
              <ServerStatusItem
                name="VDS #1"
                type="Windows Server 2022"
                status="maintenance"
                location="Asia East"
                ip="192.168.1.4"
                icon={<Shield className="h-4 w-4" />}
              />
              <ServerStatusItem
                name="Gaming Server #2"
                type="ARK"
                status="degraded"
                location="US East"
                ip="192.168.1.5"
                icon={<Server className="h-4 w-4" />}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest events on your servers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ActivityItem
                title="Server Restart"
                description="VPS #1 was restarted"
                time="2 hours ago"
                icon={<HardDrive className="h-4 w-4" />}
              />
              <ActivityItem
                title="Backup Completed"
                description="Gaming Server #1 backup completed"
                time="5 hours ago"
                icon={<Server className="h-4 w-4" />}
              />
              <ActivityItem
                title="DDoS Attack Mitigated"
                description="Attack on Gaming Server #2 mitigated"
                time="Yesterday"
                icon={<Shield className="h-4 w-4" />}
              />
              <ActivityItem
                title="SSL Certificate Renewed"
                description="Web Server SSL certificate renewed"
                time="2 days ago"
                icon={<Globe className="h-4 w-4" />}
              />
              <ActivityItem
                title="Maintenance Scheduled"
                description="VDS #1 maintenance scheduled"
                time="3 days ago"
                icon={<Clock className="h-4 w-4" />}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resource Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Usage</CardTitle>
          <CardDescription>CPU, RAM, and storage usage across your servers</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="cpu">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="cpu">CPU</TabsTrigger>
              <TabsTrigger value="ram">RAM</TabsTrigger>
              <TabsTrigger value="storage">Storage</TabsTrigger>
            </TabsList>
            <TabsContent value="cpu" className="pt-4">
              <div className="space-y-4">
                <ResourceUsageItem name="Gaming Server #1" usage={35} total="4 Cores" />
                <ResourceUsageItem name="Web Server" usage={15} total="2 Cores" />
                <ResourceUsageItem name="VPS #1" usage={65} total="2 Cores" />
                <ResourceUsageItem name="VDS #1" usage={10} total="4 Cores" />
                <ResourceUsageItem name="Gaming Server #2" usage={85} total="8 Cores" />
              </div>
            </TabsContent>
            <TabsContent value="ram" className="pt-4">
              <div className="space-y-4">
                <ResourceUsageItem name="Gaming Server #1" usage={45} total="8 GB" />
                <ResourceUsageItem name="Web Server" usage={25} total="4 GB" />
                <ResourceUsageItem name="VPS #1" usage={70} total="4 GB" />
                <ResourceUsageItem name="VDS #1" usage={30} total="16 GB" />
                <ResourceUsageItem name="Gaming Server #2" usage={90} total="16 GB" />
              </div>
            </TabsContent>
            <TabsContent value="storage" className="pt-4">
              <div className="space-y-4">
                <ResourceUsageItem name="Gaming Server #1" usage={55} total="50 GB" />
                <ResourceUsageItem name="Web Server" usage={35} total="30 GB" />
                <ResourceUsageItem name="VPS #1" usage={40} total="80 GB" />
                <ResourceUsageItem name="VDS #1" usage={20} total="200 GB" />
                <ResourceUsageItem name="Gaming Server #2" usage={75} total="100 GB" />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <QuickActionCard
          title="Add New Server"
          description="Deploy a new server in minutes"
          icon={<Server className="h-5 w-5" />}
          href="/dashboard/servers/new"
        />
        <QuickActionCard
          title="Manage Backups"
          description="View and restore server backups"
          icon={<Clock className="h-5 w-5" />}
          href="/dashboard/backups"
        />
        <QuickActionCard
          title="Billing & Invoices"
          description="View and pay your invoices"
          icon={<CreditCard className="h-5 w-5" />}
          href="/dashboard/billing"
        />
        <QuickActionCard
          title="Support Tickets"
          description="Get help from our support team"
          icon={<AlertCircle className="h-5 w-5" />}
          href="/dashboard/support"
        />
      </div>
    </div>
  )
}

function ServerStatusItem({
  name,
  type,
  status,
  location,
  ip,
  icon,
}: {
  name: string
  type: string
  status: "operational" | "degraded" | "maintenance"
  location: string
  ip: string
  icon: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg bg-card/30">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-blue-600/10 text-blue-600">{icon}</div>
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-xs text-muted-foreground">
            {type} • {location} • {ip}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge status={status} />
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/servers/${name.toLowerCase().replace(/\s+/g, "-")}`}>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "operational":
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
          Operational
        </Badge>
      )
    case "degraded":
      return (
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
          Degraded
        </Badge>
      )
    case "maintenance":
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
          Maintenance
        </Badge>
      )
    default:
      return null
  }
}

function ActivityItem({
  title,
  description,
  time,
  icon,
}: {
  title: string
  description: string
  time: string
  icon: React.ReactNode
}) {
  return (
    <div className="flex gap-3">
      <div className="p-2 rounded-md bg-blue-600/10 text-blue-600 h-fit">{icon}</div>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
        <div className="text-xs text-muted-foreground mt-1">{time}</div>
      </div>
    </div>
  )
}

function ResourceUsageItem({
  name,
  usage,
  total,
}: {
  name: string
  usage: number
  total: string
}) {
  let barColor = "bg-green-500"

  if (usage > 80) {
    barColor = "bg-red-500"
  } else if (usage > 60) {
    barColor = "bg-yellow-500"
  }

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{name}</span>
        <span className="text-muted-foreground">
          {usage}% of {total}
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${barColor} rounded-full`} style={{ width: `${usage}%` }} />
      </div>
    </div>
  )
}

function QuickActionCard({
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
    <Card className="hover:bg-card/80 transition-all duration-200">
      <Link href={href} className="block h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="p-2 rounded-md bg-blue-600/10 text-blue-600">{icon}</div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Link>
    </Card>
  )
}

