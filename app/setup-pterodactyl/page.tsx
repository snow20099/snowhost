"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Server, Mail, MessageSquare, ArrowRight, Snowflake, Lock, User, Eye, EyeOff, Settings, Database, Shield, Zap } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

export default function SetupPterodactylPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  // Auto-fill form with user data if OAuth user
  useEffect(() => {
    if (session?.user && status === "authenticated") {
      console.log('🔍 Session user data:', session.user);
      
      // Auto-fill email
      if (session.user.email) {
        setEmail(session.user.email);
      }
      
      // Auto-fill username from email
      if (session.user.email) {
        setUsername(session.user.email.split('@')[0]);
      }
      
      // Auto-fill name
      if (session.user.name) {
        const nameParts = session.user.name.split(' ');
        setFirstName(nameParts[0] || '');
        setLastName(nameParts.slice(1).join(' ') || '');
      }
      
      console.log('✅ Form auto-filled with OAuth user data');
    }
  }, [session, status]);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login');
    }
  }, [status, router]);

  // Check if user already has Pterodactyl account and redirect to dashboard
  useEffect(() => {
    if (session?.user?.email && status === "authenticated") {
      console.log('🔍 Checking if user already has Pterodactyl account...');
      
      const checkExistingAccount = async () => {
        try {
          const response = await fetch('/api/user/dashboard');
          if (response.ok) {
            const userData = await response.json();
            
            if (userData.pterodactylAccount?.userId) {
              console.log('✅ User already has Pterodactyl account, redirecting to dashboard');
              
              toast({
                title: "لديك حساب Pterodactyl بالفعل",
                description: "سيتم توجيهك للداشبورد",
                duration: 3000,
              });
              
              setTimeout(() => {
                router.push('/dashboard');
              }, 2000);
            } else {
              console.log('ℹ️ User needs to setup Pterodactyl account');
            }
          }
        } catch (error) {
          console.error('❌ Error checking user data:', error);
        }
      };
      
      checkExistingAccount();
    }
  }, [session, status, router]);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!agreedToTerms) {
      setError("يجب الموافقة على الشروط والأحكام")
      return
    }
    
    if (password !== confirmPassword) {
      setError("كلمات المرور غير متطابقة")
      return
    }
    
    setIsLoading(true)
    setError("")
    setSuccess("")
    
    try {
      const response = await fetch("/api/pterodactyl/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          password,
          first_name: firstName,
          last_name: lastName
        }),
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "فشل في إنشاء الحساب")
      }
      
      setSuccess("تم إنشاء حساب Pterodactyl بنجاح!")
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
      
    } catch (error) {
      setError(error instanceof Error ? error.message : "حدث خطأ أثناء إنشاء الحساب")
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-600 via-sky-800 to-black flex items-center justify-center">
        <div className="text-white text-xl">جاري التحميل...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 via-sky-800 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-sky-800/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "12s" }} />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-sky-400/10 rounded-full blur-2xl animate-float" />
      </div>

      {/* Floating Snowflakes */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 15 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-sky-300 rounded-full opacity-60"
            initial={{ y: -100, x: Math.random() * 100 }}
            animate={{ 
              y: 1000,
              x: Math.random() * 100
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 8
            }}
          />
        ))}
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 mb-6"
            >
              <Snowflake className="h-8 w-8 text-sky-300 animate-spin" style={{ animationDuration: "3s" }} />
              <span className="font-bold text-2xl text-white">سنو هوست</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl font-bold text-white mb-4"
            >
              إعداد حساب Pterodactyl
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-sky-200 text-lg max-w-2xl mx-auto"
            >
              {session.user.name ? `مرحباً ${session.user.name}! ` : ''}أنشئ حسابك في نظام إدارة الخوادم لبدء استخدام خدماتنا
            </motion.p>
          </motion.div>

          {/* Main Content Grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid lg:grid-cols-2 gap-8 items-start"
          >
            {/* Form Card */}
            <Card className="border-0 bg-white/10 backdrop-blur-md shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10" />
              <form onSubmit={handleSetup} className="relative z-10">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold text-white">معلومات الحساب</CardTitle>
                  <CardDescription className="text-sky-200">
                    {session.user.name ? 'تم ملء بعض البيانات تلقائياً' : 'أدخل بياناتك لإنشاء الحساب'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Current User Info (for OAuth users) */}
                  {session.user.name && (
                    <div className="bg-gradient-to-r from-sky-900/30 to-blue-900/30 p-6 rounded-xl border-2 border-sky-400/40 shadow-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <h4 className="font-semibold text-sky-100 text-lg">معلوماتك الحالية</h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 px-3 bg-sky-800/20 rounded-lg">
                          <span className="text-sky-300 font-medium">الاسم:</span>
                          <span className="text-sky-100 font-semibold">{session.user.name}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 px-3 bg-sky-800/20 rounded-lg">
                          <span className="text-sky-300 font-medium">البريد الإلكتروني:</span>
                          <span className="text-sky-100 font-semibold">{session.user.email}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 px-3 bg-sky-800/20 rounded-lg">
                          <span className="text-sky-300 font-medium">نوع الحساب:</span>
                          <span className="text-sky-100 font-semibold">
                            {session.user.email?.includes('@gmail.com') ? 'Google' : 
                             session.user.email?.includes('@discord.com') ? 'Discord' : 'الموقع'}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-sky-800/10 rounded-lg border border-sky-400/20">
                        <p className="text-xs text-sky-300 text-center">
                          ✨ هذه البيانات ثابتة ولا يمكن تغييرها - يمكنك فقط إدخال كلمة المرور
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Email Input - Read Only for OAuth users */}
                  <div className="input-group">
                    <input
                      id="email"
                      type="email"
                      className="input w-full bg-sky-900/30 cursor-not-allowed"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      readOnly={!!session.user.name}
                      disabled={!!session.user.name}
                    />
                    <label htmlFor="email" className="user-label">
                      <Mail className="inline w-4 h-4 mr-2" />
                      البريد الإلكتروني
                      {session.user.name && <span className="text-xs text-sky-400 ml-2">(ثابت)</span>}
                    </label>
                  </div>

                  {/* Username Input - Read Only for OAuth users */}
                  <div className="input-group">
                    <input
                      id="username"
                      type="text"
                      className="input w-full bg-sky-900/30 cursor-not-allowed"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      readOnly={!!session.user.name}
                      disabled={!!session.user.name}
                    />
                    <label htmlFor="username" className="user-label">
                      <User className="inline w-4 h-4 mr-2" />
                      اسم المستخدم
                      {session.user.name && <span className="text-xs text-sky-400 ml-2">(ثابت)</span>}
                    </label>
                  </div>

                  {/* Password Input */}
                  <div className="input-group">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="input w-full pr-12"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <label htmlFor="password" className="user-label">
                      <Lock className="inline w-4 h-4 mr-2" />
                      كلمة المرور
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sky-300 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Confirm Password Input */}
                  <div className="input-group">
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      className="input w-full pr-12"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <label htmlFor="confirm-password" className="user-label">
                      <Lock className="inline w-4 h-4 mr-2" />
                      تأكيد كلمة المرور
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sky-300 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Name Inputs - Read Only for OAuth users */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* First Name Input */}
                    <div className="input-group">
                      <input
                        id="first-name"
                        type="text"
                        className="input w-full bg-sky-900/30 cursor-not-allowed"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        readOnly={!!session.user.name}
                        disabled={!!session.user.name}
                      />
                      <label htmlFor="first-name" className="user-label">
                        <User className="inline w-4 h-4 mr-2" />
                        الاسم الأول
                        {session.user.name && <span className="text-xs text-sky-400 ml-2">(ثابت)</span>}
                      </label>
                    </div>

                    {/* Last Name Input */}
                    <div className="input-group">
                      <input
                        id="last-name"
                        type="text"
                        className="input w-full bg-sky-900/30 cursor-not-allowed"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        readOnly={!!session.user.name}
                        disabled={!!session.user.name}
                      />
                      <label htmlFor="last-name" className="user-label">
                        <User className="inline w-4 h-4 mr-2" />
                        الاسم الأخير
                        {session.user.name && <span className="text-xs text-sky-400 ml-2">(ثابت)</span>}
                      </label>
                    </div>
                  </div>

                  {/* Terms Agreement */}
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                      className="border-sky-400 data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600" 
                    />
                    <label htmlFor="terms" className="text-sm font-normal text-sky-200">
                      أوافق على{" "}
                      <Link href="/terms" className="text-sky-300 hover:text-sky-200 hover:underline">
                        شروط الخدمة
                      </Link>{" "}
                      و{" "}
                      <Link href="/privacy" className="text-sky-300 hover:text-sky-200 hover:underline">
                        سياسة الخصوصية
                      </Link>
                    </label>
                  </div>

                  {/* Messages */}
                  <AnimatePresence>
                    {success && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-green-400 text-sm bg-green-900/20 p-4 rounded-lg border border-green-500/30"
                      >
                        {success}
                      </motion.div>
                    )}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-400 text-sm bg-red-900/20 p-4 rounded-lg border border-red-500/30"
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>

                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white rounded-full h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <span className="mr-3">جاري إنشاء الحساب...</span>
                        <div className="flex space-x-1">
                          {[0, 150, 300].map((delay) => (
                            <div
                              key={delay}
                              className="h-2 w-2 bg-white rounded-full animate-bounce"
                              style={{ animationDelay: `${delay}ms` }}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        إنشاء الحساب
                        <ArrowRight className="ml-3 h-5 w-5" />
                      </div>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            {/* Info Card */}
            <Card className="border-0 bg-white/10 backdrop-blur-md shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10" />
              <div className="relative z-10">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold text-white">مميزات الحساب</CardTitle>
                  <CardDescription className="text-sky-200">
                    ما ستحصل عليه مع حساب Pterodactyl
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-sky-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Server className="h-5 w-5 text-sky-300" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">إدارة الخوادم</h4>
                        <p className="text-sm text-sky-200">تحكم كامل في خوادم الألعاب والويب</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-sky-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Database className="h-5 w-5 text-sky-300" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">قاعدة البيانات</h4>
                        <p className="text-sm text-sky-200">إدارة قواعد البيانات بسهولة</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-sky-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Shield className="h-5 w-5 text-sky-300" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">الأمان</h4>
                        <p className="text-sm text-sky-200">حماية متقدمة لخوادمك</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-sky-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Zap className="h-5 w-5 text-sky-300" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">أداء عالي</h4>
                        <p className="text-sm text-sky-200">خوادم سريعة وموثوقة</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-sky-900/20 p-4 rounded-lg border border-sky-400/30">
                    <h4 className="font-medium text-sky-100 mb-2">ملاحظات مهمة:</h4>
                    <ul className="text-sm text-sky-200 space-y-1">
                      <li>• سيتم إنشاء الحساب فوراً</li>
                      <li>• يمكنك الوصول للوحة التحكم مباشرة</li>
                      <li>• احتفظ بكلمة المرور في مكان آمن</li>
                      <li>• يمكنك تغيير كلمة المرور لاحقاً</li>
                    </ul>
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>

          {/* Back to Dashboard Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-8"
          >
            <Link 
              href="/dashboard" 
              className="inline-flex items-center text-sky-300 hover:text-sky-200 hover:underline font-semibold transition-colors"
            >
              <ArrowRight className="ml-2 h-4 w-4 rotate-180" />
              العودة للوحة التحكم
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Custom CSS for Input Effects */}
      <style jsx>{`
        .input-group {
          position: relative;
        }

        .input {
          border: solid 1.5px #9e9e9e;
          border-radius: 1rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 1rem;
          font-size: 1rem;
          color: #f5f5f5;
          transition: all 150ms cubic-bezier(0.4,0,0.2,1);
          backdrop-filter: blur(10px);
        }

        .input::placeholder {
          color: transparent;
        }

        .user-label {
          position: absolute;
          left: 15px;
          top: 50%;
          color: #e8e8e8;
          pointer-events: none;
          transform: translateY(-50%);
          transition: 150ms cubic-bezier(0.4,0,0.2,1);
          display: flex;
          align-items: center;
          font-size: 1rem;
        }

        .input:focus, .input:valid {
          outline: none;
          border: 1.5px solid #1a73e8;
          background: rgba(255, 255, 255, 0.15);
        }

        .input:focus ~ .user-label, .input:valid ~ .user-label {
          transform: translateY(-50%) scale(0.8);
          background-color: #1e293b;
          padding: 0 0.5em;
          color: #2196f3;
          border-radius: 0.5rem;
          top: 0;
          left: 10px;
        }

        .input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: rgba(30, 41, 59, 0.6);
          border-color: #475569;
        }

        .input:disabled ~ .user-label {
          color: #94a3b8;
          opacity: 0.8;
        }

        .input:disabled ~ .user-label span {
          color: #64748b;
          font-weight: normal;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
} 