"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, Server, HardDrive, Globe, Shield, Activity, CreditCard, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"

interface UserData {
  id: string
  name: string
  email: string
  balance: number
  currency: string
  accountType: string
  servers: Array<{
    id: string
    name: string
    type: string
    status: string
    ip: string
    location: string
    createdAt: string
  }>
  invoices: Array<{
    id: string
    amount: number
    status: string
    service: string
    date: string
  }>
  resourceUsage: {
    cpu: number
    memory: number
    storage: number
    network: number
    totalStorage: number
    totalMemory: number
    totalNetwork: number
    lastUpdated: string
  }
  preferences: {
    theme: string
    language: string
    notifications: boolean
  }
  createdAt: string
}

export default function DashboardPage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/profile')
        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }
        const data = await response.json()
        setUserData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  // Function to update resource usage
  const updateResourceUsage = async (newUsage: any) => {
    try {
      const response = await fetch('/api/user/resource-usage', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUsage),
      })
      
      if (response.ok) {
        const updatedData = await response.json()
        setUserData(prev => prev ? {
          ...prev,
          resourceUsage: updatedData.resourceUsage
        } : null)
      }
    } catch (error) {
      console.error('Failed to update resource usage:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error || !userData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
          <p className="text-red-500">Failed to load dashboard data</p>
        </div>
      </div>
    )
  }

  // Calculate statistics
  const activeServers = userData.servers.filter(server => server.status === 'active').length
  const totalServers = userData.servers.length
  const pendingInvoices = userData.invoices.filter(invoice => invoice.status === 'pending')
  const totalPendingAmount = pendingInvoices.reduce((sum, invoice) => sum + invoice.amount, 0)
  
  // Use real resource usage data
  const { resourceUsage } = userData

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {userData.name}. Here's an overview of your hosting services.</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Servers</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeServers}</div>
            <p className="text-xs text-muted-foreground">
              {totalServers > 0 ? `${totalServers} total servers` : 'No servers yet'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeServers > 0 ? '99.9%' : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userData.currency} {userData.balance.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {pendingInvoices.length > 0 ? `${pendingInvoices.length} pending invoices` : 'No pending invoices'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userData.currency} {totalPendingAmount.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {pendingInvoices.length > 0 ? `${pendingInvoices.length} invoices` : 'All paid'}
            </p>
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
            {userData.servers.length > 0 ? (
            <div className="space-y-4">
                {userData.servers.map((server) => (
              <ServerStatusItem
                    key={server.id}
                    name={server.name}
                    type={server.type}
                    status={server.status}
                    location={server.location}
                    ip={server.ip}
                    icon={getServerIcon(server.type)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Server className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No servers yet</p>
            </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            {userData.servers.length > 0 ? (
            <div className="space-y-4">
                {userData.servers.slice(0, 3).map((server, index) => (
              <ActivityItem
                    key={server.id}
                    title={`${server.name} ${server.status === 'active' ? 'Online' : 'Offline'}`}
                    description={`${server.type} server in ${server.location}`}
                    time={`${index + 1} hour${index > 0 ? 's' : ''} ago`}
                    icon={getServerIcon(server.type)}
              />
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground text-sm">No recent activity</p>
            </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resource Usage */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
          <CardTitle>Resource Usage</CardTitle>
          <CardDescription>Current resource utilization across your servers</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => updateResourceUsage({
                cpu: Math.floor(Math.random() * 80) + 10,
                memory: Math.floor(Math.random() * 80) + 10,
                storage: Math.floor(Math.random() * 60) + 10,
                network: Math.floor(Math.random() * 70) + 10
              })}
            >
              Refresh Data
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <ResourceUsageItem name="CPU Usage" usage={resourceUsage.cpu} total="100%" />
            <ResourceUsageItem name="Memory Usage" usage={resourceUsage.memory} total={`${resourceUsage.totalMemory}GB`} />
            <ResourceUsageItem name="Storage Usage" usage={resourceUsage.storage} total={`${resourceUsage.totalStorage}GB`} />
            <ResourceUsageItem name="Network Usage" usage={resourceUsage.network} total={`${resourceUsage.totalNetwork}GB`} />
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            Last updated: {new Date(resourceUsage.lastUpdated).toLocaleString()}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <QuickActionCard
          title="View Statistics"
          description="Check detailed performance metrics"
          icon={<Activity className="h-5 w-5" />}
          href="/dashboard/statistics"
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

function getServerIcon(type: string) {
  switch (type.toLowerCase()) {
    case 'gaming':
      return <Server className="h-4 w-4" />
    case 'web':
      return <Globe className="h-4 w-4" />
    case 'vps':
      return <HardDrive className="h-4 w-4" />
    case 'vds':
      return <Shield className="h-4 w-4" />
    default:
      return <Server className="h-4 w-4" />
  }
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
  status: string
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
  switch (status.toLowerCase()) {
    case "active":
    case "operational":
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
          Active
        </Badge>
      )
    case "suspended":
    case "degraded":
      return (
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
          Suspended
        </Badge>
      )
    case "terminated":
    case "maintenance":
      return (
        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
          Terminated
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">
          {status}
        </Badge>
      )
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

