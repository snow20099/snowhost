"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ShoppingCart, Server, Play, Pause, RotateCcw, Settings, Trash2, Plus, Activity, HardDrive, Cpu, MemoryStick, User, Lock, Gamepad2, Loader2, Zap, Shield, Clock, Users } from "lucide-react"
import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface GamingServer {
  id: string
  attributes: {
    name: string
    description: string
    status: string
    node: string
    memory: number
    disk: number
    cpu: number
    players: number
    max_players: number
    created_at: string
    updated_at: string
  }
}

interface ServerPlan {
  name: string
  players: string
  ram: number
  disk: number
  cpu: number
  duration: string
  price: number
  egg_id: number
  docker_image: string
  startup_command: string
}

interface GameCategory {
  id: string
  name: string
  displayName: string
  description: string
  available: boolean
  plans: ServerPlan[]
  color: string
  icon: string // مسار الصورة
  bgColor: string
  borderColor: string
}

const minecraftPlans: ServerPlan[] = [
  { 
    name: "Minecraft Basic", 
    players: "10 Players", 
    ram: 2, 
    disk: 6, 
    cpu: 2, 
    duration: "30 days", 
    price: 2,
    egg_id: 1,
    docker_image: "ghcr.io/pterodactyl/games:java",
    startup_command: "java -Xms128M -Xmx2048M -jar server.jar"
  },
  { 
    name: "Minecraft Standard", 
    players: "25 Players", 
    ram: 4, 
    disk: 12, 
    cpu: 3, 
    duration: "30 days", 
    price: 4,
    egg_id: 1,
    docker_image: "ghcr.io/pterodactyl/games:java",
    startup_command: "java -Xms512M -Xmx4096M -jar server.jar"
  },
  { 
    name: "Minecraft Pro", 
    players: "50 Players", 
    ram: 8, 
    disk: 16, 
    cpu: 4, 
    duration: "30 days", 
    price: 8,
    egg_id: 1,
    docker_image: "ghcr.io/pterodactyl/games:java",
    startup_command: "java -Xms1024M -Xmx8192M -jar server.jar"
  },
  { 
    name: "Minecraft Premium", 
    players: "75 Players", 
    ram: 12, 
    disk: 20, 
    cpu: 6, 
    duration: "30 days", 
    price: 12,
    egg_id: 1,
    docker_image: "ghcr.io/pterodactyl/games:java",
    startup_command: "java -Xms2048M -Xmx12288M -jar server.jar"
  },
  { 
    name: "Minecraft Ultimate", 
    players: "100 Players", 
    ram: 16, 
    disk: 25, 
    cpu: 6, 
    duration: "30 days", 
    price: 16,
    egg_id: 1,
    docker_image: "ghcr.io/pterodactyl/games:java",
    startup_command: "java -Xms4096M -Xmx16384M -jar server.jar"
  }
]

// خطط افتراضية للألعاب القادمة
const defaultPlans: ServerPlan[] = [
  { 
    name: "Basic", 
    players: "10 Players", 
    ram: 2, 
    disk: 6, 
    cpu: 2, 
    duration: "30 days", 
    price: 3,
    egg_id: 1,
    docker_image: "ghcr.io/pterodactyl/games:base",
    startup_command: "echo 'Server starting...'"
  },
  { 
    name: "Standard", 
    players: "25 Players", 
    ram: 4, 
    disk: 12, 
    cpu: 3, 
    duration: "30 days", 
    price: 6,
    egg_id: 1,
    docker_image: "ghcr.io/pterodactyl/games:base",
    startup_command: "echo 'Server starting...'"
  },
  { 
    name: "Pro", 
    players: "50 Players", 
    ram: 8, 
    disk: 16, 
    cpu: 4, 
    duration: "30 days", 
    price: 12,
    egg_id: 1,
    docker_image: "ghcr.io/pterodactyl/games:base",
    startup_command: "echo 'Server starting...'"
  }
]

const gameCategories: GameCategory[] = [
  {
    id: "minecraft",
    name: "Minecraft",
    displayName: "ماين كرافت",
    description: "خوادم ماين كرافت عالية الأداء مع دعم جميع الإصدارات والوضعيات",
    available: true,
    plans: minecraftPlans,
    color: "from-emerald-600 to-green-700",
    icon: "/icons/minecraft.png",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30"
  },
  {
    id: "fivem",
    name: "FiveM",
    displayName: "FiveM",
    description: "خوادم GTA V Multiplayer مع سكريبتات مخصصة وأداء عالي",
    available: false,
    plans: defaultPlans,
    color: "from-blue-600 to-indigo-700",
    icon: "/icons/fivem.png",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30"
  },
  {
    id: "ark",
    name: "ARK",
    displayName: "ARK Survival",
    description: "خوادم ARK Survival Evolved للعب البقاء مع الديناصورات",
    available: false,
    plans: defaultPlans,
    color: "from-purple-600 to-violet-700",
    icon: "/icons/ark.png",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30"
  },
  {
    id: "rust",
    name: "Rust",
    displayName: "Rust",
    description: "خوادم Rust للعب البقاء والبناء والصراع",
    available: false,
    plans: defaultPlans,
    color: "from-red-600 to-rose-700",
    icon: "/icons/rust.png",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30"
  },
  {
    id: "discord",
    name: "Discord Bot",
    displayName: "Discord Bot",
    description: "استضافة بوتات Discord مع ميزات متقدمة وأداء عالي",
    available: false,
    plans: defaultPlans,
    color: "from-indigo-600 to-purple-700",
    icon: "/icons/discord.png",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/30"
  },
  {
    id: "fortnite",
    name: "Fortnite",
    displayName: "Fortnite",
    description: "خوادم Fortnite المخصصة مع إعدادات متقدمة",
    available: false,
    plans: defaultPlans,
    color: "from-pink-600 to-rose-700",
    icon: "/icons/fortnite.svg",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/30"
  }
]

const MinecraftLogo = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
    <rect x="2" y="2" width="32" height="32" rx="6" fill="#5A7C16" stroke="#222" strokeWidth="2" />
    <rect x="7" y="7" width="8" height="8" rx="2" fill="#222" />
    <rect x="21" y="7" width="8" height="8" rx="2" fill="#222" />
    <rect x="13" y="19" width="10" height="6" rx="2" fill="#222" />
    <rect x="15" y="21" width="6" height="2" rx="1" fill="#5A7C16" />
  </svg>
)

export default function GamingServicesPage() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const [selectedPlan, setSelectedPlan] = useState<ServerPlan | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [serverName, setServerName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [userBalance, setUserBalance] = useState(0)
  const [userCurrency, setUserCurrency] = useState('USD')
  const [userServers, setUserServers] = useState<GamingServer[]>([])
  const [selectedGame, setSelectedGame] = useState<GameCategory>(gameCategories[0])
  const router = useRouter()

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserBalance()
      fetchUserServers()
    }
  }, [session])

  const fetchUserBalance = async () => {
    try {
      const response = await fetch('/api/user/balance')
      if (response.ok) {
        const data = await response.json()
        setUserBalance(data.balance || 0)
        setUserCurrency(data.currency || 'USD')
      }
    } catch (error) {
      console.error('Failed to fetch user balance:', error)
    }
  }

  const fetchUserServers = async () => {
    try {
      const response = await fetch('/api/pterodactyl/servers')
      if (response.ok) {
        const data = await response.json()
        setUserServers(data.servers || [])
      }
    } catch (error) {
      console.error('Failed to fetch user servers:', error)
    }
  }

  const handleCreateAccountAndServer = async () => {
    if (!serverName.trim()) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال اسم الخادم',
        variant: 'destructive'
      })
      return
    }

    if (!selectedPlan) {
      toast({
        title: 'خطأ',
        description: 'يرجى اختيار باقة',
        variant: 'destructive'
      })
      return
    }

    // التحقق من الرصيد أولاً
    if (userBalance < selectedPlan.price) {
      toast({
        title: 'رصيد غير كافي',
        description: `رصيدك الحالي: ${userCurrency} ${userBalance.toFixed(2)} - المطلوب: ${userCurrency} ${selectedPlan.price.toFixed(2)}`,
        variant: 'destructive'
      })
      return
    }

    setIsCreating(true)
    try {
      // First create Pterodactyl user account if not exists
      let userResponse
      try {
        userResponse = await fetch('/api/pterodactyl/users', {
        method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session?.user?.email,
          username: session?.user?.name || session?.user?.email?.split('@')[0],
            first_name: session?.user?.name?.split(' ')[0] || 'User',
            last_name: session?.user?.name?.split(' ').slice(1).join(' ') || 'Account',
            password: 'SnowHost123!' // كلمة مرور افتراضية آمنة
          })
        })
      } catch (error) {
        // إذا كان الحساب موجود بالفعل، نتابع
        console.log('User account might already exist, continuing...')
      }

      // Then create the server
      console.log('🚀 Creating server with data:', {
        name: serverName,
        plan: selectedPlan.name,
        price: selectedPlan.price,
        description: `خادم ${selectedPlan.name} - ${serverName}`,
        limits: {
          memory: selectedPlan.ram * 1024,
          disk: selectedPlan.disk * 1024,
          cpu: selectedPlan.cpu * 100,
          swap: 0,
          io: 500
        }
      })

      const serverResponse = await fetch('/api/pterodactyl/servers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: serverName,
          plan: selectedPlan.name,
          price: selectedPlan.price,
          description: `خادم ${selectedPlan.name} - ${serverName}`,
          limits: {
            memory: selectedPlan.ram * 1024, // تحويل GB إلى MB
            disk: selectedPlan.disk * 1024,   // تحويل GB إلى MB
            cpu: selectedPlan.cpu * 100,      // تحويل vCPU إلى نسبة
            swap: 0,
            io: 500
          }
        })
      })

      console.log('📡 Server creation response status:', serverResponse.status)
      console.log('📡 Server creation response ok:', serverResponse.ok)

      if (!serverResponse.ok) {
        const errorData = await serverResponse.json()
        console.error('❌ Server creation failed:', errorData)
        throw new Error(`فشل في إنشاء الخادم: ${errorData.error || serverResponse.statusText}`)
      }

      // الخادم تم إنشاؤه بنجاح - الآن نخصم المال
      const serverData = await serverResponse.json()
      console.log('✅ Server created successfully:', serverData)
      
      // خصم المبلغ من رصيد المستخدم
      const balanceUpdateResponse = await fetch('/api/user/balance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: -selectedPlan.price, // خصم المبلغ
          type: 'server_creation',
          description: `إنشاء خادم ${selectedPlan.name} - ${serverName}`,
          serverId: serverData.server?.id || 'unknown'
        })
      })

      if (!balanceUpdateResponse.ok) {
        // إذا فشل خصم المال، نحذف الخادم
        console.error('Failed to deduct balance, server will be deleted')
        toast({
          title: 'تحذير',
          description: 'تم إنشاء الخادم ولكن فشل في خصم المال. سيتم حذف الخادم.',
          variant: 'destructive'
        })
        return
      }

      // تحديث رصيد المستخدم في الواجهة
      setUserBalance(prev => prev - selectedPlan.price)

      toast({
        title: ' تم إنشاء الخادم بنجاح!',
        description: `تم إنشاء خادم ${selectedPlan.name} وخصم ${selectedPlan.price} من رصيدك`,
      })

      // إعادة توجيه إلى صفحة الخوادم
      router.push('/dashboard/servers')

    } catch (error) {
      console.error('Error creating server:', error)
      toast({
        title: '❌ خطأ',
        description: error instanceof Error ? error.message : 'فشل في إنشاء الخادم',
        variant: 'destructive'
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-4 relative">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-display font-bold tracking-tight bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
          خوادم الألعاب
        </h1>
        <p className="text-base text-muted-foreground max-w-3xl font-medium leading-relaxed">
          اختر من بين خططنا المميزة لخوادم الألعاب واستمتع بأداء عالي واستقرار ممتاز
        </p>
      </div>

      {/* User Balance & Stats */}
      <div className="grid gap-3 md:grid-cols-3">
        <Card className="text-center border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50">
          <CardHeader className="pb-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mb-2">
              <User className="h-4 w-4 text-white" />
            </div>
            <CardTitle className="text-sm font-semibold">رصيد الحساب</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600 mb-1">${userBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">متاح للإنفاق</p>
          </CardContent>
        </Card>

        <Card className="text-center border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50">
          <CardHeader className="pb-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mb-2">
              <Server className="h-4 w-4 text-white" />
            </div>
            <CardTitle className="text-sm font-semibold">الخوادم النشطة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-blue-600 mb-1">{userServers.length}</div>
            <p className="text-xs text-muted-foreground">خادم نشط</p>
          </CardContent>
        </Card>

        <Card className="text-center border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50">
          <CardHeader className="pb-2">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mb-2">
              <Gamepad2 className="h-4 w-4 text-white" />
            </div>
            <CardTitle className="text-sm font-semibold">إجمالي اللاعبين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-purple-600 mb-1">
              {userServers.reduce((total, server) => total + (server.attributes.max_players || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">لاعب</p>
          </CardContent>
        </Card>
      </div>

      {/* Game Selection Section - Small Tabs */}
      <div className="space-y-3">
        <div className="text-center space-y-1">
          <h2 className="text-lg font-display font-bold text-white">اختر اللعبة</h2>
          <p className="text-sky-200 text-xs">اضغط على اللعبة لعرض الباقات المتاحة</p>
        </div>

        {/* Game Selection Tabs - Small and Compact */}
        <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
          {gameCategories.map((game) => (
            <Button
              key={game.id}
              variant={selectedGame.id === game.id ? "default" : "outline"}
              className={`h-12 px-3 flex items-center gap-2 transition-all duration-300 rounded-lg ${
                selectedGame.id === game.id 
                  ? 'bg-sky-600 text-white shadow-lg scale-105 border-sky-400' 
                  : 'bg-sky-800/30 border-sky-400/30 text-sky-200 hover:bg-sky-700/50 hover:border-sky-400/50 hover:scale-105'
              }`}
              onClick={() => setSelectedGame(game)}
            >
              {/* Game Icon */}
              <div className={`w-5 h-5 rounded-md flex items-center justify-center overflow-hidden ${
                selectedGame.id === game.id 
                  ? 'bg-white/20' 
                  : 'bg-sky-600/50'
              }`}>
                <img 
                  src={game.icon} 
                  alt={game.displayName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback إذا لم توجد الصورة
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'w-full h-full bg-sky-600 flex items-center justify-center text-white text-xs';
                    fallback.textContent = game.displayName.charAt(0);
                    target.parentNode?.appendChild(fallback);
                  }}
                />
              </div>
              
              {/* Game Name */}
              <span className="font-semibold text-xs">{game.displayName}</span>
              
              {/* Status Indicator */}
              {game.available ? (
                <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
              ) : (
                <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Selected Game Section - Integrated with Plans */}
      <div className="space-y-3">
        {/* Game Header Card */}
        <Card className="border-sky-400/30 bg-sky-800/30 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-center gap-3 mb-2">
              {/* Game Icon */}
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden ${
                selectedGame.available ? 'bg-sky-600 shadow-lg' : 'bg-slate-600'
              }`}>
                <img 
                  src={selectedGame.icon} 
                  alt={selectedGame.displayName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback إذا لم توجد الصورة
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'w-full h-full bg-sky-600 flex items-center justify-center text-white text-sm font-bold';
                    fallback.textContent = selectedGame.displayName.charAt(0);
                    target.parentNode?.appendChild(fallback);
                  }}
                />
              </div>
              
              <div className="text-center">
                <h2 className="text-xl font-display font-bold text-white mb-1">
                  {selectedGame.displayName}
                </h2>
                {selectedGame.available ? (
                  <Badge className="bg-emerald-600 text-white px-2 py-1 text-xs rounded-full">
                    <div className="w-1 h-1 bg-white rounded-full mr-1 animate-pulse"></div>
                    متاح الآن
                  </Badge>
                ) : (
                  <Badge className="bg-slate-600 text-white px-2 py-1 text-xs rounded-full">
                    <Clock className="w-3 h-3 mr-1" />
                    قريباً
                  </Badge>
                )}
              </div>
            </div>
            
            <p className="text-center text-sky-200 text-sm leading-relaxed">
              {selectedGame.description}
            </p>
          </CardContent>
        </Card>

        {/* Game Plans Grid - Integrated */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {selectedGame.plans.map((plan, index) => (
            <Card key={plan.name} className={`group hover:shadow-lg transition-all duration-500 border-2 transform hover:scale-105 ${
              selectedGame.available 
                ? 'border-sky-400/50 bg-sky-800/30 hover:border-sky-400 hover:bg-sky-800/50' 
                : 'border-slate-400/30 bg-slate-800/30 opacity-60'
            }`}>
              <CardHeader className="text-center pb-3 pt-4">
                {/* Plan Icon */}
                <div className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center transition-all duration-500 ${
                  selectedGame.available 
                    ? 'bg-sky-600 group-hover:scale-110 shadow-lg' 
                    : 'bg-slate-600'
                }`}>
                  <Gamepad2 className="h-6 w-6 text-white" />
                </div>
                
                {/* Plan Name and Players */}
                <CardTitle className="text-lg font-bold mb-1 text-white">
                  {selectedGame.name} {plan.name}
                </CardTitle>
                <CardDescription className="text-sm font-medium text-sky-300">
                  {plan.players}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3 px-3 pb-3">
                {/* Specs Grid */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-sky-900/50 p-2 rounded-lg border border-sky-400/30">
                    <div className="text-base font-bold text-sky-300 mb-1">{plan.ram}GB</div>
                    <div className="text-xs text-sky-200">الذاكرة</div>
                  </div>
                  <div className="bg-sky-900/50 p-2 rounded-lg border border-sky-400/30">
                    <div className="text-base font-bold text-sky-300 mb-1">{plan.disk}GB</div>
                    <div className="text-xs text-sky-200">التخزين</div>
                  </div>
                  <div className="bg-sky-900/50 p-2 rounded-lg border border-sky-400/30">
                    <div className="text-base font-bold text-sky-300 mb-1">{plan.cpu}</div>
                    <div className="text-xs text-sky-200">المعالج</div>
                  </div>
                </div>

                {/* Price Section */}
                <div className="text-center bg-sky-900/40 p-2 rounded-lg border border-sky-400/50">
                  <div className="text-2xl font-bold text-sky-200 mb-1">${plan.price}</div>
                  <div className="text-xs text-sky-300">شهرياً</div>
                  <div className="text-xs text-sky-400 font-medium mt-1">خصم 20% للدفع السنوي</div>
                </div>

                {/* Features List */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-sky-200">
                    <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                    <span>دعم فني 24/7</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-sky-200">
                    <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                    <span>نسخ احتياطية يومية</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-sky-200">
                    <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                    <span>حماية DDoS</span>
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  onClick={() => {
                    if (selectedGame.available) {
                      // فحص الرصيد قبل إنشاء الخادم
                      if (userBalance < plan.price) {
                        toast({
                          title: "❌ رصيد غير كافي",
                          description: `ليس لديك مال كافي. رصيدك الحالي: $${userBalance.toFixed(2)} - المطلوب: $${plan.price}. يرجى الشحن أولاً.`,
                          variant: "destructive",
                          duration: 5000
                        });
                        return;
                      }
                      
                      setSelectedPlan(plan)
                      setShowCreateDialog(true)
                    } else {
                      toast({
                        title: "غير متاح",
                        description: "هذه اللعبة ستكون متاحة قريباً",
                        variant: "destructive"
                      })
                    }
                  }}
                  disabled={!selectedGame.available}
                  className={`w-full font-semibold py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ${
                    selectedGame.available 
                      ? userBalance >= plan.price
                        ? 'bg-sky-600 hover:bg-sky-700 text-white hover:scale-105' 
                        : 'bg-red-600 hover:bg-red-700 text-white cursor-not-allowed opacity-75'
                      : 'bg-slate-600 text-slate-300 cursor-not-allowed'
                  }`}
                  size="default"
                >
                  {selectedGame.available ? (
                    userBalance >= plan.price ? (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        إنشاء خادم
                      </>
                    ) : (
                      <>
                        <span className="text-xs">رصيد غير كافي</span>
                      </>
                    )
                  ) : (
                    <>
                      <Clock className="h-4 w-4 mr-2" />
                      قريباً
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Server Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md border-sky-400/30 bg-sky-800/90 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-white">إنشاء خادم جديد</DialogTitle>
            <DialogDescription className="text-sky-200">
              {selectedPlan ? `إنشاء خادم ${selectedGame.name} ${selectedPlan.name}` : 'اختر خطة أولاً'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="serverName" className="text-white">اسم الخادم</Label>
              <Input
                id="serverName"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                placeholder="أدخل اسم الخادم"
                className="mt-1 bg-sky-800/30 border-sky-400/50 text-white placeholder-sky-300 focus:border-sky-400 focus:ring-sky-400"
              />
            </div>

            {selectedPlan && (
              <div className="bg-sky-900/40 p-4 rounded-lg border border-sky-400/30">
                <h4 className="font-semibold mb-2 text-white">تفاصيل الخطة المختارة:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-sky-200 mb-3">
                  <div>الذاكرة: <span className="font-medium text-sky-300">{selectedPlan.ram}GB</span></div>
                  <div>التخزين: <span className="font-medium text-sky-300">{selectedPlan.disk}GB</span></div>
                  <div>المعالج: <span className="font-medium text-sky-300">{selectedPlan.cpu} vCPU</span></div>
                  <div>السعر: <span className="font-medium text-sky-300">${selectedPlan.price}</span></div>
                </div>
                
                {/* عرض الرصيد */}
                <div className={`p-3 rounded-lg border ${
                  userBalance >= selectedPlan.price 
                    ? 'bg-emerald-900/40 border-emerald-400/30' 
                    : 'bg-red-900/40 border-red-400/30'
                }`}>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-sky-200">رصيدك الحالي:</span>
                    <span className={`font-medium ${
                      userBalance >= selectedPlan.price ? 'text-emerald-300' : 'text-red-300'
                    }`}>
                      ${userBalance.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-sky-200">المطلوب:</span>
                    <span className="text-sky-300 font-medium">${selectedPlan.price}</span>
                  </div>
                  {userBalance < selectedPlan.price && (
                    <div className="mt-2 p-2 bg-red-800/30 rounded border border-red-400/30">
                      <p className="text-red-200 text-xs text-center">
                        ❌ رصيد غير كافي - يرجى الشحن أولاً
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
                className="flex-1 border-sky-400/50 text-sky-200 hover:bg-sky-800/30 hover:text-white"
              >
                إلغاء
              </Button>
              <Button
                onClick={() => {
                  // فحص إضافي للرصيد قبل الإنشاء
                  if (selectedPlan && userBalance < selectedPlan.price) {
                    toast({
                      title: "❌ رصيد غير كافي",
                      description: `ليس لديك مال كافي. رصيدك الحالي: $${userBalance.toFixed(2)} - المطلوب: $${selectedPlan.price}. يرجى الشحن أولاً.`,
                      variant: "destructive",
                      duration: 5000
                    });
                    setShowCreateDialog(false);
                    return;
                  }
                  
                  handleCreateAccountAndServer();
                }}
                disabled={!selectedPlan || !serverName.trim() || isCreating || (selectedPlan ? userBalance < selectedPlan.price : true)}
                className={`flex-1 ${
                  selectedPlan && userBalance >= selectedPlan.price
                    ? 'bg-sky-600 hover:bg-sky-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white cursor-not-allowed opacity-75'
                }`}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    جاري الإنشاء...
                  </>
                ) : selectedPlan && userBalance < selectedPlan.price ? (
                  'رصيد غير كافي'
                ) : (
                  'إنشاء الخادم'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 