"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Server, Globe, HardDrive, Shield, Loader2, AlertCircle } from "lucide-react"

interface ServerData {
  id: string
  name: string
  type: string
  status: string
  ip: string
  location: string
  createdAt: string
}

export default function ServersPage() {
  const [servers, setServers] = useState<ServerData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await fetch('/api/user/profile')
        if (!response.ok) {
          throw new Error('Failed to fetch servers')
        }
        const data = await response.json()
        setServers(data.servers || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchServers()
  }, [])

  const getServerIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'gaming':
        return <Server className="h-5 w-5 text-blue-500" />
      case 'web':
        return <Globe className="h-5 w-5 text-green-500" />
      case 'vps':
        return <HardDrive className="h-5 w-5 text-blue-400" />
      case 'vds':
        return <Shield className="h-5 w-5 text-yellow-500" />
      default:
        return <Server className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'text-green-500'
      case 'suspended':
        return 'text-yellow-500'
      case 'terminated':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'Active'
      case 'suspended':
        return 'Suspended'
      case 'terminated':
        return 'Terminated'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
          <p className="text-red-500">Failed to load servers</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">My Servers</h1>
        <p className="text-muted-foreground">
          {servers.length > 0 
            ? `Here you can view all your active and inactive servers. (${servers.length} servers)`
            : "You don't have any servers yet."
          }
        </p>
      </div>
      
      {servers.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {servers.map((server) => (
            <Card key={server.id} className="flex flex-col">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div className="p-2 rounded-md bg-background border border-border/30">
                  {getServerIcon(server.type)}
                </div>
                <div>
                  <CardTitle className="text-lg">{server.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {server.type} • {server.location}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 mt-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Status:</span>
                  <span className={getStatusColor(server.status)}>
                    {getStatusText(server.status)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>IP:</span>
                  <span>{server.ip}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Created:</span>
                  <span>{new Date(server.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Server className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No servers found</h3>
          <p className="text-muted-foreground">
            You haven't deployed any servers yet. Your servers will appear here once you create them.
          </p>
        </div>
      )}
    </div>
  )
} 