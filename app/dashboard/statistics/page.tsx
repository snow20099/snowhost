"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Server, CreditCard, Activity, ServerOff, TrendingUp, TrendingDown, User } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { useEffect, useState } from 'react'

// Real API functions for user statistics
const fetchUserStatistics = async () => {
  try {
    const response = await fetch('/api/user/statistics', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`API not found`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('User statistics API not available:', error.message)
    return null
  }
}

const fetchUserServerData = async () => {
  try {
    const response = await fetch('/api/user/servers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`API not found`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('User servers API not available:', error.message)
    return null
  }
}

interface UserStatData {
  current: number
  previous: number
  percentage: number
}

interface UserStatistics {
  activeServers: UserStatData
  inactiveServers: UserStatData
  totalSpent: UserStatData
  monthlySpent: UserStatData
}

interface ServerData {
  month: string
  activeServers: number
  inactiveServers: number
  spending: number
}

interface ServerStatusData {
  name: string
  value: number
  color: string
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
  data?: UserStatData
  isLoading: boolean
  isCurrency?: boolean
}) => {
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

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <div className="p-2 rounded-md bg-background border border-border/30">
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
            ) : data.percentage < 0 ? (
              <TrendingDown className="h-4 w-4 text-red-500" />
            ) : null}
            {data.percentage !== 0 && (
              <span className={`text-sm font-medium ${
                data.percentage > 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {data.percentage > 0 ? '+' : ''}{data.percentage}%
              </span>
            )}
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
}

export default function UserStatisticsPage() {
  const [statistics, setStatistics] = useState<UserStatistics | null>(null)
  const [serverData, setServerData] = useState<ServerData[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [serverLoading, setServerLoading] = useState(true)
  const [apiConnected, setApiConnected] = useState(false)

  useEffect(() => {
    // Fetch user statistics data
    fetchUserStatistics().then(data => {
      if (data) {
        setStatistics(data)
        setApiConnected(true)
      }
      setLoading(false)
    })

    // Fetch user server data
    fetchUserServerData().then(data => {
      if (data) {
        setServerData(data)
      }
      setServerLoading(false)
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

  // Prepare pie chart data for server status
  const getServerStatusData = (): ServerStatusData[] => {
    if (!statistics) return []
    
    const activeCount = statistics.activeServers.current
    const inactiveCount = statistics.inactiveServers.current
    
    return [
      { name: 'خوادم نشطة', value: activeCount, color: '#10b981' },
      { name: 'خوادم غير نشطة', value: inactiveCount, color: '#ef4444' }
    ]
  }

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">إحصائياتي الشخصية</h1>
        <p className="text-muted-foreground">نظرة عامة على خوادمك ومصروفاتك الشخصية.</p>
        
        {!apiConnected && !loading && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-yellow-800 text-sm font-medium">
                لم يتم ربط API الإحصائيات الشخصية بعد - يرجى إضافة ملفات API للحصول على بياناتك الحقيقية
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="الخوادم النشطة"
          description={apiConnected ? "خوادمك النشطة حالياً" : "لا توجد بيانات متاحة"}
          value={statistics?.activeServers.current || 0}
          icon={Server}
          iconColor="text-green-500"
          data={statistics?.activeServers}
          isLoading={loading}
        />

        <StatCard
          title="الخوادم غير النشطة"
          description={apiConnected ? "خوادمك المتوقفة" : "لا توجد بيانات متاحة"}
          value={statistics?.inactiveServers.current || 0}
          icon={ServerOff}
          iconColor="text-red-500"
          data={statistics?.inactiveServers}
          isLoading={loading}
        />

        <StatCard
          title="المصروفات الشهرية"
          description={apiConnected ? "إجمالي مصروفاتك هذا الشهر" : "لا توجد بيانات متاحة"}
          value={statistics?.monthlySpent.current || 0}
          icon={CreditCard}
          iconColor="text-blue-500"
          data={statistics?.monthlySpent}
          isLoading={loading}
          isCurrency={true}
        />

        <StatCard
          title="إجمالي المصروفات"
          description={apiConnected ? "إجمالي ما دفعته للآن" : "لا توجد بيانات متاحة"}
          value={statistics?.totalSpent.current || 0}
          icon={Activity}
          iconColor="text-purple-500"
          data={statistics?.totalSpent}
          isLoading={loading}
          isCurrency={true}
        />
      </div>

      {/* Server Status Distribution */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>توزيع حالة الخوادم</CardTitle>
            <CardDescription>نسبة الخوادم النشطة والغير نشطة</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="text-muted-foreground text-sm mt-2">جاري تحميل البيانات...</span>
              </div>
            ) : !apiConnected ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="text-center">
                  <Server className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد بيانات للخوادم</h3>
                  <p className="text-sm text-gray-500">
                    يرجى إضافة ملف API للخوادم في: /api/user/statistics/route.ts
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getServerStatusData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getServerStatusData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Spending Trend */}
        <Card>
          <CardHeader>
            <CardTitle>اتجاه المصروفات</CardTitle>
            <CardDescription>مصروفاتك الشهرية خلال آخر 6 أشهر</CardDescription>
          </CardHeader>
          <CardContent>
            {serverLoading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="text-muted-foreground text-sm mt-2">جاري تحميل البيانات...</span>
              </div>
            ) : !serverData ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="text-center">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد بيانات للمصروفات</h3>
                  <p className="text-sm text-gray-500">
                    سيتم عرض مخطط المصروفات بعد ربط قاعدة البيانات
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={serverData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(Number(value)), 'المصروفات']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="spending" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Servers Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>نشاط الخوادم الشهري</CardTitle>
          <CardDescription>عدد الخوادم النشطة والغير نشطة خلال آخر 6 أشهر</CardDescription>
        </CardHeader>
        <CardContent>
          {serverLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="text-muted-foreground text-sm mt-2">جاري تحميل البيانات...</span>
            </div>
          ) : !serverData ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="text-center">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد بيانات لنشاط الخوادم</h3>
                <p className="text-sm text-gray-500">
                  يرجى إضافة ملف API للخوادم في: /api/user/servers/route.ts
                </p>
              </div>
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serverData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => {
                      return [formatNumber(Number(value)), name === 'activeServers' ? 'خوادم نشطة' : 'خوادم غير نشطة']
                    }}
                  />
                  <Bar dataKey="activeServers" fill="#10b981" name="activeServers" />
                  <Bar dataKey="inactiveServers" fill="#ef4444" name="inactiveServers" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
