"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { BarChart3, Users, ShoppingCart, Server } from "lucide-react"

export default function StatisticsPage() {
  const [balance, setBalance] = useState(null)
  const [profile, setProfile] = useState(null)
  const [resourceUsage, setResourceUsage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [balanceRes, profileRes, usageRes] = await Promise.all([
          fetch("/api/balance"),
          fetch("/api/profile"),
          fetch("/api/resource-usage"),
        ])

        if (!balanceRes.ok) throw new Error("Failed to load balance")
        if (!profileRes.ok) throw new Error("Failed to load profile")
        if (!usageRes.ok) throw new Error("Failed to load resource usage")

        const balanceData = await balanceRes.json()
        const profileData = await profileRes.json()
        const usageData = await usageRes.json()

        setBalance(balanceData)
        setProfile(profileData)
        setResourceUsage(usageData.resourceUsage)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div>Loading statistics...</div>
  if (error) return <div>Error loading data: {error}</div>

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Statistics</h1>
        <p className="text-muted-foreground">Overview of your platform's key metrics and usage statistics.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Orders - هنا ممكن تغير حسب بياناتك إذا عندك */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <div className="p-2 rounded-md bg-background border border-border/30">
              <ShoppingCart className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <CardTitle className="text-lg">Servers</CardTitle>
              <CardDescription className="text-xs">Total servers you have</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{profile?.servers?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <div className="p-2 rounded-md bg-background border border-border/30">
              <Users className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <CardTitle className="text-lg">Account Type</CardTitle>
              <CardDescription className="text-xs">Your subscription plan</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{profile?.accountType || "Free"}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <div className="p-2 rounded-md bg-background border border-border/30">
              <Server className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <CardTitle className="text-lg">Balance</CardTitle>
              <CardDescription className="text-xs">Your current balance</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {balance?.balance?.toLocaleString()} {balance?.currency}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <div className="p-2 rounded-md bg-background border border-border/30">
              <BarChart3 className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <CardTitle className="text-lg">Resource Usage</CardTitle>
              <CardDescription className="text-xs">Current CPU/Memory/Storage usage</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div>
              CPU: {resourceUsage?.cpu || 0} / {resourceUsage?.totalCPU || "N/A"} <br />
              Memory: {resourceUsage?.memory || 0} GB / {resourceUsage?.totalMemory} GB <br />
              Storage: {resourceUsage?.storage || 0} GB / {resourceUsage?.totalStorage} GB <br />
              Network: {resourceUsage?.network || 0} MB / {resourceUsage?.totalNetwork} MB
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Usage Chart</CardTitle>
          <CardDescription>Server and user activity over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64">
            <span className="text-muted-foreground text-lg">[Bar Chart Placeholder]</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
