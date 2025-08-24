"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { BarChart3, Users, ShoppingCart, Server, TrendingUp, TrendingDown } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { useEffect, useState } from 'react'

// Simulated API data - replace with your actual API endpoints
const fetchStatistics = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    orders: {
      current: 1247,
      previous: 1089,
      percentage: 14.5
    },
    users: {
      current: 3428,
      previous: 3201,
      percentage: 7.1
    },
    servers: {
      current: 12,
      previous: 15,
      percentage: -20
    },
    revenue: {
      current: 28450,
      previous: 24200,
      percentage: 17.6
    }
  }
}

const fetchChartData = async () => {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  return [
    { month: 'Jan', users: 2400, orders: 890, revenue: 18200 },
    { month: 'Feb', users: 2680, orders: 920, revenue: 19800 },
    { month: 'Mar', users: 2890, orders: 1100, revenue: 22400 },
    { month: 'Apr', users: 3100, orders: 980, revenue: 21200 },
    { month: 'May', users: 3250, orders: 1150, revenue: 25600 },
    { month: 'Jun', users: 3428, orders: 1247, revenue: 28450 }
  ]
}

interface StatData {
  current: number
  previous: number
  percentage: number
}

interface Statistics {
  orders: StatData
  users: StatData
  servers: StatData
  revenue: StatData
}

interface ChartDataPoint {
  month: string
  users: number
  orders: number
  revenue: number
}

export default function StatisticsPage() {
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [chartLoading, setChartLoading] = useState(true)

  useEffect(() => {
    // Fetch statistics data
    fetchStatistics().then(data => {
      setStatistics(data)
      setLoading(false)
    })

    // Fetch chart data
    fetchChartData().then(data => {
      setChartData(data)
      setChartLoading(false)
    })
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ar-SA').format(num)
  }

  const StatCard = ({ 
    title, 
    description, 
    value, 
    icon: Icon, 
    iconColor, 
    data, 
    isLoading,
    isCurrency = false 
  }: {
    title: string
    description: string
    value: string | number
    icon: any
    iconColor: string
    data?: StatData
    isLoading: boolean
    isCurrency?: boolean
  }) => (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <div className={`p-2 rounded-md bg-background border border-border/30`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className="flex-1">
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription className="text-xs">{description}</CardDescription>
        </div>
        {data && !isLoading && (
          <div className="flex items-center gap-1">
            {data.percentage > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${
              data.percentage > 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {data.percentage > 0 ? '+' : ''}{data.percentage}%
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-9 bg-gray-200 rounded w-20"></div>
          </div>
        ) : (
          <div className="text-3xl font-bold">
            {isCurrency ? formatCurrency(Number(value)) : formatNumber(Number(value))}
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">الإحصائيات</h1>
        <p className="text-muted-foreground">نظرة عامة على المقاييس الرئيسية للمنصة وإحصائيات الاستخدام.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="الطلبات"
          description="إجمالي الطلبات هذا الشهر"
          value={statistics?.orders.current || 0}
          icon={ShoppingCart}
          iconColor="text-blue-500"
          data={statistics?.orders}
          isLoading={loading}
        />

        <StatCard
          title="المستخدمين"
          description="المستخدمين النشطين"
          value={statistics?.users.current || 0}
          icon={Users}
          iconColor="text-green-500"
          data={statistics?.users}
          isLoading={loading}
        />

        <StatCard
          title="الخوادم"
          description="الخوادم النشطة"
          value={statistics?.servers.current || 0}
          icon={Server}
          iconColor="text-purple-500"
          data={statistics?.servers}
          isLoading={loading}
        />

        <StatCard
          title="الإيرادات"
          description="هذا الشهر"
          value={statistics?.revenue.current || 0}
          icon={BarChart3}
          iconColor="text-yellow-500"
          data={statistics?.revenue}
          isLoading={loading}
          isCurrency={true}
        />
      </div>

      {/* Usage Chart */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>مخطط الاستخدام</CardTitle>
          <CardDescription>نشاط الخادم والمستخدمين خلال الـ 6 أشهر الماضية</CardDescription>
        </CardHeader>
        <CardContent>
          {chartLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="text-muted-foreground text-sm mt-2">جاري تحميل البيانات...</span>
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'revenue') {
                        return [formatCurrency(Number(value)), 'الإيرادات']
                      }
                      return [formatNumber(Number(value)), name === 'users' ? 'المستخدمين' : 'الطلبات']
                    }}
                  />
                  <Bar dataKey="users" fill="#10b981" name="users" />
                  <Bar dataKey="orders" fill="#3b82f6" name="orders" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Revenue Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>اتجاه الإيرادات</CardTitle>
          <CardDescription>نمو الإيرادات الشهرية</CardDescription>
        </CardHeader>
        <CardContent>
          {chartLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="text-muted-foreground text-sm mt-2">جاري تحميل البيانات...</span>
            </span>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(Number(value)), 'الإيرادات']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#f59e0b" 
                    strokeWidth={3}
                    dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
