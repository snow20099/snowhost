'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Server, RefreshCw, Database, ExternalLink, Settings, CreditCard } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface MongoDBServer {
  id: string
  name: string
  plan: string
  price: number
  specs: {
    ram: number
    disk: number
    cpu: number
  }
  status: string
  createdAt: string
  updatedAt: string
  expiresAt: string
  autoRenewal: boolean
  lastBillingDate: string
  nextBillingDate: string
  isExpired: boolean
  daysUntilExpiry: number
  pterodactylId: number
  ip: string
  location: string
  port: number
}

export default function MyServersPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [servers, setServers] = useState<MongoDBServer[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserServers()
    }
  }, [session])

  // فحص تلقائي للخوادم المنتهية وإيقافها
  useEffect(() => {
    if (servers.length > 0) {
      checkAndSuspendExpiredServers()
    }
  }, [servers])

  // فحص تلقائي للخوادم المنتهية
  useEffect(() => {
    if (servers.length > 0) {
      const expiredServers = servers.filter(server => server.isExpired)
      if (expiredServers.length > 0) {
        console.log(`⚠️ Found ${expiredServers.length} expired servers:`, expiredServers.map(s => s.name))
        
        // إظهار تنبيه للمستخدم
        toast({
          title: "⚠️ تنبيه",
          description: `يوجد ${expiredServers.length} خادم منتهي الصلاحية. قم بإيقافها يدوياً أو تجديدها.`,
          variant: "default"
        })
      }
    }
  }, [servers])

  const fetchUserServers = async () => {
    try {
      setLoading(true)
      // استخدام API الجديد لجلب البيانات من MongoDB
      const response = await fetch('/api/user/servers')
      if (response.ok) {
        const data = await response.json()
        setServers(data.servers || [])
        console.log('📊 Fetched servers from MongoDB:', data.servers)
      } else {
        console.error('❌ Failed to fetch servers from MongoDB:', response.statusText)
        toast({
          title: "خطأ",
          description: "فشل في جلب الخوادم من قاعدة البيانات",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('❌ Error fetching user servers from MongoDB:', error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب الخوادم من قاعدة البيانات",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const refreshServers = async () => {
    setRefreshing(true)
    await fetchUserServers()
    setRefreshing(false)
    toast({
      title: "تم التحديث",
      description: "تم تحديث قائمة الخوادم"
    })
  }

  const handleRenewServer = async (serverId: string, months: number = 1) => {
    try {
      toast({
        title: "جاري التجديد",
        description: "جاري تجديد الخادم..."
      })

      const response = await fetch('/api/servers/renew', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ serverId, months })
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "✅ تم التجديد",
          description: data.message
        })
        
        // إعادة تشغيل الخادم تلقائياً إذا كان موقوف
        const server = servers.find(s => s.id === serverId)
        if (server?.pterodactylId && server.status === 'suspended') {
          try {
            console.log(`🔄 إعادة تشغيل الخادم ${server.pterodactylId} تلقائياً بعد التجديد`)
            
            const unsuspendResponse = await fetch('/api/pterodactyl/servers/unsuspend', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ serverId: server.pterodactylId })
            })

            if (unsuspendResponse.ok) {
              toast({
                title: "✅ تم إعادة التشغيل",
                description: "تم إعادة تشغيل الخادم تلقائياً بعد التجديد"
              })
            } else {
              toast({
                title: "⚠️ تحذير",
                description: "تم التجديد لكن فشل في إعادة تشغيل الخادم. قم بإعادة تشغيله يدوياً من لوحة التحكم.",
                variant: "default"
              })
            }
          } catch (error) {
            console.warn('Error auto-unsuspending server:', error)
          }
        }
        
        // Refresh servers after renewal
        await fetchUserServers()
      } else {
        const errorData = await response.json()
        toast({
          title: "❌ خطأ في التجديد",
          description: errorData.error,
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error renewing server:', error)
      toast({
        title: "❌ خطأ",
        description: "حدث خطأ أثناء تجديد الخادم",
        variant: "destructive"
      })
    }
  }

  // فحص تلقائي للخوادم المنتهية وإيقافها
  const checkAndSuspendExpiredServers = async () => {
    try {
      const expiredServers = servers.filter(server => {
        const now = new Date()
        const expiresAt = new Date(server.expiresAt)
        return expiresAt <= now && !server.isExpired
      })

      if (expiredServers.length === 0) return

      console.log(`🔄 Found ${expiredServers.length} expired servers, suspending them...`)

      for (const server of expiredServers) {
        try {
          if (server.pterodactylId) {
            console.log(`🔄 Suspending expired server ${server.pterodactylId} (${server.name})`)
            
            const response = await fetch('/api/pterodactyl/servers/suspend', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ serverId: server.pterodactylId })
            })

            if (response.ok) {
              console.log(`✅ Server ${server.pterodactylId} suspended successfully`)
              
              // Update server status in MongoDB
              await fetch('/api/servers/update-status', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                  serverId: server.id, 
                  status: 'suspended',
                  isExpired: true 
                })
              })
            } else {
              console.error(`❌ Failed to suspend server ${server.pterodactylId}`)
            }
          }
        } catch (error) {
          console.error(`❌ Error suspending server ${server.id}:`, error)
        }
      }

      // Refresh servers after suspension
      await fetchUserServers()
      
    } catch (error) {
      console.error('Error in auto-suspend check:', error)
    }
  }

  // Redirect to login if not authenticated
  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Server className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">يرجى تسجيل الدخول</h3>
          <p className="text-muted-foreground mb-4">
            يجب تسجيل الدخول لعرض الخوادم الخاصة بك
          </p>
          <Button asChild>
            <a href="/login">تسجيل الدخول</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">خوادمي</h1>
          <p className="text-muted-foreground">
            إدارة الخوادم الخاصة بك وعرض معلوماتها
          </p>
        </div>
        <Button onClick={refreshServers} disabled={refreshing} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          تحديث
        </Button>
      </div>

      {/* Statistics Cards */}
      {servers.length > 0 && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">إجمالي الخوادم</p>
                  <p className="text-2xl font-bold">{servers.length}</p>
                </div>
                <span className="text-2xl">🖥️</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">الخوادم النشطة</p>
                  <p className="text-2xl font-bold text-green-600">
                    {servers.filter(s => !s.isExpired).length}
                  </p>
                </div>
                <span className="text-2xl">✅</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">الخوادم المنتهية</p>
                  <p className="text-2xl font-bold text-red-600">
                    {servers.filter(s => s.isExpired).length}
                  </p>
                </div>
                <span className="text-2xl">❌</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">تنتهي قريباً</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {servers.filter(s => s.daysUntilExpiry <= 7 && !s.isExpired).length}
                  </p>
                </div>
                <span className="text-2xl">⚠️</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Servers Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">جاري تحميل الخوادم...</p>
          </div>
        </div>
      ) : servers.length === 0 ? (
        <div className="text-center py-12">
          <Server className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">لا توجد خوادم</h3>
          <p className="text-muted-foreground mb-4">
            لم تقم بإنشاء أي خوادم بعد. ابدأ بإنشاء خادم جديد من صفحة الخدمات.
          </p>
          <Button asChild>
            <a href="/dashboard/services/gaming">
              إنشاء خادم جديد
            </a>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {servers.map((server) => (
            <ServerCard 
              key={server.id} 
              server={server} 
              onRenew={handleRenewServer}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Server Card Component
function ServerCard({ 
  server, 
  onRenew
}: { 
  server: MongoDBServer
  onRenew: (serverId: string, months: number) => void
}) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">{server.name}</CardTitle>
          <Badge className={getStatusColor(server.status)}>
            {getStatusText(server.status)}
          </Badge>
        </div>
        <CardDescription className="text-base">
          {server.specs.ram} RAM, {server.specs.disk} GB Disk, {server.specs.cpu}% CPU
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* معلومات الخادم الأساسية */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <span className="text-muted-foreground mb-1">الخطة:</span>
            <span className="font-semibold text-lg text-blue-600">
              {server.plan}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground mb-1">السعر:</span>
            <span className="font-semibold text-lg text-green-600">
              ${server.price}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground mb-1">الذاكرة:</span>
            <span className="font-semibold text-lg">
              {formatBytes(server.specs.ram * 1024 * 1024)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground mb-1">القرص:</span>
            <span className="font-semibold text-lg">
              {formatBytes(server.specs.disk * 1024 * 1024)}
            </span>
          </div>
        </div>
        
        {/* معلومات التواريخ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <span className="text-muted-foreground mb-1">تاريخ الإنشاء:</span>
            <span className="font-semibold text-sm">
              {formatDate(server.createdAt)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground mb-1">تاريخ الانتهاء:</span>
            <span className={`font-semibold text-sm ${
              server.isExpired ? 'text-red-600' : 'text-green-600'
            }`}>
              {formatDate(server.expiresAt)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground mb-1">الأيام المتبقية:</span>
            <span className={`font-semibold text-sm ${
              server.daysUntilExpiry <= 7 ? 'text-red-600' : 
              server.daysUntilExpiry <= 30 ? 'text-orange-600' : 'text-green-600'
            }`}>
              {server.daysUntilExpiry} يوم
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground mb-1">التجديد التلقائي:</span>
            <span className={`font-semibold text-sm ${
              server.autoRenewal ? 'text-green-600' : 'text-red-600'
            }`}>
              {server.autoRenewal ? 'مفعل' : 'معطل'}
            </span>
          </div>
        </div>
        
        {/* معلومات الفواتير */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <span className="text-muted-foreground mb-1">آخر فاتورة:</span>
            <span className="font-semibold text-sm">
              {formatDate(server.lastBillingDate)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground mb-1">الفاتورة القادمة:</span>
            <span className="font-semibold text-sm text-blue-600">
              {formatDate(server.nextBillingDate)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground mb-1">السعر الشهري:</span>
            <span className="font-semibold text-lg text-green-600">
              ${server.price}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground mb-1">حالة الخادم:</span>
            <Badge className={getStatusColor(server.status)}>
              {getStatusText(server.status)}
            </Badge>
          </div>
        </div>
        
        {/* معلومات إضافية */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <span className="text-muted-foreground mb-1">المعالج:</span>
            <span className="font-semibold text-lg">
              {server.specs.cpu}%
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground mb-1">IP:</span>
            <span className="font-semibold text-sm">
              {server.ip === 'pending' ? 'قيد التحميل...' : server.ip}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground mb-1">المنفذ:</span>
            <span className="font-semibold text-sm">
              {server.port}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground mb-1">آخر تحديث:</span>
            <span className="font-semibold text-sm">
              {formatDate(server.updatedAt)}
            </span>
          </div>
        </div>
        
        {/* معلومات Pterodactyl */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <Database className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">معلومات Pterodactyl</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-blue-600 dark:text-blue-400">ID:</span> {server.pterodactylId}
            </div>
            <div>
              <span className="text-blue-600 dark:text-blue-400">الموقع:</span> {server.location}
            </div>
          </div>
        </div>

        {/* تأكيد حفظ التواريخ */}
        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-600">💾</span>
            <span className="text-sm font-medium text-green-800 dark:text-green-200">التواريخ محفوظة في قاعدة البيانات</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-green-600 dark:text-green-400">تاريخ الانتهاء:</span> {formatDate(server.expiresAt)}
            </div>
            <div>
              <span className="text-green-600 dark:text-green-400">الأيام المتبقية:</span> {server.daysUntilExpiry} يوم
            </div>
          </div>
        </div>
        
        {/* تنبيه انتهاء الصلاحية */}
        {server.isExpired && (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-red-600">⚠️</span>
              <span className="text-sm font-medium text-red-800 dark:text-red-200">انتهت صلاحية الخادم</span>
            </div>
            <p className="text-sm text-red-600 dark:text-red-400 mb-3">
              تم إيقاف الخادم تلقائياً. قم بالتجديد لاستئناف الخدمة.
            </p>
            <div className="flex gap-2">
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => onRenew(server.id, 1)}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                تجديد لمدة شهر
              </Button>
              <Button 
                variant="outline"
                onClick={() => onRenew(server.id, 3)}
              >
                تجديد لمدة 3 أشهر
              </Button>
            </div>
          </div>
        )}
        
        {!server.isExpired && server.daysUntilExpiry <= 7 && (
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-orange-600">⚠️</span>
              <span className="text-sm font-medium text-orange-800 dark:text-orange-200">تنبيه انتهاء الصلاحية</span>
            </div>
            <p className="text-sm text-orange-600 dark:text-orange-400 mb-3">
              ينتهي الخادم خلال {server.daysUntilExpiry} أيام. قم بالتجديد لتجنب إيقاف الخدمة.
            </p>
            <div className="flex gap-2">
              <Button 
                className="bg-orange-600 hover:bg-orange-700 text-white"
                onClick={() => onRenew(server.id, 1)}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                تجديد لمدة شهر
              </Button>
              <Button 
                variant="outline"
                onClick={() => onRenew(server.id, 3)}
              >
                تجديد لمدة 3 أشهر
              </Button>
            </div>
          </div>
        )}

        {/* خيارات التجديد للخوادم النشطة */}
        {!server.isExpired && server.daysUntilExpiry > 7 && (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-600">💳</span>
              <span className="text-sm font-medium text-green-800 dark:text-green-200">خيارات التجديد</span>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 mb-3">
              يمكنك تجديد الخادم مبكراً للحصول على خصم
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => onRenew(server.id, 1)}
              >
                تجديد لمدة شهر
              </Button>
              <Button 
                variant="outline"
                onClick={() => onRenew(server.id, 3)}
              >
                تجديد لمدة 3 أشهر
              </Button>
            </div>
          </div>
        )}

        {/* خيارات الإدارة */}
        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="ghost" asChild className="flex-1">
            <a href={`https://panel.snowhost.cloud/server/${server.pterodactylId}`} target="_blank" rel="noopener noreferrer">
              <Settings className="h-4 w-4 mr-2" />
              إدارة الخادم
            </a>
          </Button>
          <Button size="sm" variant="ghost" asChild className="flex-1">
            <a href={`https://panel.snowhost.cloud/server/${server.pterodactylId}/files`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              إدارة الملفات
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Utility functions
const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'expired':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'expiring_soon':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    case 'suspended':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'installing':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'active':
      return 'نشط'
    case 'expired':
      return 'منتهي الصلاحية'
    case 'expiring_soon':
      return 'ينتهي قريباً'
    case 'suspended':
      return 'معلق'
    case 'installing':
      return 'قيد التثبيت'
    default:
      return 'غير معروف'
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
} 