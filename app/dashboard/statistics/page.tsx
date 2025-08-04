import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { BarChart3, Users, ShoppingCart, Server } from "lucide-react"

export default function StatisticsPage() {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Statistics</h1>
        <p className="text-muted-foreground">Overview of your platform's key metrics and usage statistics.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <div className="p-2 rounded-md bg-background border border-border/30">
              <ShoppingCart className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <CardTitle className="text-lg">Orders</CardTitle>
              <CardDescription className="text-xs">Total orders this month</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">42</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <div className="p-2 rounded-md bg-background border border-border/30">
              <Users className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <CardTitle className="text-lg">Users</CardTitle>
              <CardDescription className="text-xs">Active users</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">128</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <div className="p-2 rounded-md bg-background border border-border/30">
              <Server className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <CardTitle className="text-lg">Servers</CardTitle>
              <CardDescription className="text-xs">Active servers</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <div className="p-2 rounded-md bg-background border border-border/30">
              <BarChart3 className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <CardTitle className="text-lg">Revenue</CardTitle>
              <CardDescription className="text-xs">This month</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$1,250</div>
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
