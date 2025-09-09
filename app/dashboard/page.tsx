"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Server, 
  Activity, 
  CreditCard, 
  AlertTriangle, 
  Gamepad2, 
  Users, 
  HardDrive, 
  Cpu, 
  Zap,
  ArrowRight,
  CheckCircle
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface UserData {
  id: string
  name: string
  email: string
  balance: number
  currency: string
  authProvider?: 'credentials' | 'google' | 'discord'
  pterodactylAccount?: {
    userId: number
    username: string
    email: string
    panelUrl: string
    password?: string // Added password to the interface
  }
  servers: any[]
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
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login')
      return
    }

    if (session?.user?.email) {
      fetchUserData()
    }
  }, [session, status, router])

    const fetchUserData = async () => {
      try {
        setLoading(true)
      const response = await fetch('/api/user/dashboard')
      if (response.ok) {
        const data = await response.json()
        setUserData(data)
      } else {
        throw new Error('Failed to fetch user data')
      }
      } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

  // Redirect to Pterodactyl setup if user doesn't have account
  useEffect(() => {
    if (userData && !userData.pterodactylAccount?.userId && !isRedirecting) {
      console.log('🔄 User needs Pterodactyl setup, redirecting...');
      setIsRedirecting(true);
      
      // Show toast notification
      toast({
        title: "تحتاج لإعداد حساب Pterodactyl",
        description: userData.authProvider === 'google' || userData.authProvider === 'discord'
          ? `تم تسجيل دخولك عبر ${userData.authProvider === 'google' ? 'Google' : 'Discord'}! سيتم توجيهك لإعداد الحساب الآن`
          : "سيتم توجيهك لصفحة الإعداد الآن",
        duration: 3000,
      });
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/setup-pterodactyl');
      }, 2000);
    }
  }, [userData, router, isRedirecting]);

  const handleSetupPterodactyl = () => {
    router.push('/setup-pterodactyl')
  }

  const handleGoToGaming = () => {
    router.push('/dashboard/services/gaming')
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">جاري تحميل البيانات...</p>
        </div>
      </div>
    )
  }

  if (error || !userData) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <p className="text-red-500">فشل في تحميل بيانات المستخدم</p>
        </div>
      </div>
    )
  }

  const hasPterodactylAccount = !!userData.pterodactylAccount?.userId

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-display font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          مرحباً {userData.name}! 👋
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          لوحة التحكم الخاصة بك - إدارة الخوادم والخدمات
        </p>
      </div>

      {/* Pterodactyl Setup Alert - Show for users without Pterodactyl account */}
      {!hasPterodactylAccount && (
        <Card className="border-0 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                    تحتاج إلى إعداد حساب Pterodactyl
                  </h3>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    {userData.authProvider === 'google' || userData.authProvider === 'discord'
                      ? 'تم تسجيل دخولك عبر ' + (userData.authProvider === 'google' ? 'Google' : 'Discord') + '! تحتاج الآن لإعداد حساب Pterodactyl لإنشاء خوادم الألعاب'
                      : 'لإنشاء خوادم الألعاب، تحتاج إلى إعداد حساب Pterodactyl أولاً'
                    }
                  </p>
                </div>
              </div>
              <Button 
                onClick={handleSetupPterodactyl}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                إعداد الحساب الآن
                <ArrowRight className="h-4 w-4 mr-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pterodactyl Account Status */}
      {hasPterodactylAccount && (
        <Card className="border-0 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                    حساب Pterodactyl مفعل ✅
                  </h3>
                  <p className="text-green-700 dark:text-green-300">
                    تم إنشاء حساب Pterodactyl تلقائياً! يمكنك الآن إنشاء خوادم الألعاب
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={handleGoToGaming}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  إنشاء خادم جديد
                  <ArrowRight className="h-4 w-4 mr-2" />
                </Button>
                <Button 
                  onClick={() => router.push('/dashboard/profile')}
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-100"
                >
                  بيانات حساب Pterodactyl
                  <ArrowRight className="h-4 w-4 mr-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-green-800 dark:text-green-200">رصيد الحساب</CardTitle>
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-1">
              {userData.currency} {userData.balance.toFixed(2)}
            </div>
            <p className="text-sm text-green-700 dark:text-green-300">
              الرصيد المتاح
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-blue-800 dark:text-blue-200">الخوادم النشطة</CardTitle>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Server className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {userData.servers.length}
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              خادم نشط
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-purple-800 dark:text-purple-200">إجمالي الذاكرة</CardTitle>
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
              <HardDrive className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {userData.resourceUsage.totalMemory}GB
            </div>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              الذاكرة المتاحة
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-orange-800 dark:text-orange-200">إجمالي التخزين</CardTitle>
            <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 mb-1">
              {userData.resourceUsage.totalStorage}GB
            </div>
            <p className="text-sm text-orange-700 dark:text-orange-300">
              التخزين المتاح
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">إجراءات سريعة</CardTitle>
            </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center gap-2 p-4 hover:bg-blue-50 dark:hover:bg-blue-950/30"
              onClick={handleGoToGaming}
            >
              <Gamepad2 className="h-8 w-8 text-blue-600" />
              <span className="font-semibold">خوادم الألعاب</span>
                  </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center gap-2 p-4 hover:bg-green-50 dark:hover:bg-green-950/30"
              onClick={() => router.push('/dashboard/wallet')}
            >
              <CreditCard className="h-8 w-8 text-green-600" />
              <span className="font-semibold">المحفظة</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center gap-2 p-4 hover:bg-purple-50 dark:hover:bg-purple-950/30"
              onClick={() => router.push('/dashboard/servers')}
            >
              <Server className="h-8 w-8 text-purple-600" />
              <span className="font-semibold">إدارة الخوادم</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
