"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Server, Mail, MessageSquare, ArrowRight, Snowflake, Lock, User, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import ReCAPTCHA from "react-google-recaptcha"
import { motion, AnimatePresence } from "framer-motion"

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  // Check for verification message on component mount
  useEffect(() => {
    const messageParam = searchParams.get('message');
    if (messageParam === 'verification_required') {
      setMessage("تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب قبل تسجيل الدخول.");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!recaptchaToken) {
      setError("يرجى إكمال التحقق من reCAPTCHA")
      return
    }
    
    setIsLoading(true)
    setError("")
    setMessage("")
    
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })
      
      console.log("Login response:", res) // للتشخيص
      
      if (res?.ok && !res?.error) {
        // تسجيل دخول ناجح
        window.location.href = "/dashboard"
      } else {
        // تسجيل دخول فاشل
        if (res?.error === 'Email not verified') {
          setError("يرجى التحقق من بريدك الإلكتروني أولاً. تحقق من صندوق الوارد الخاص بك أو اطلب رابط تحقق جديد.")
        } else {
          setError(res?.error || "بيانات تسجيل الدخول غير صحيحة")
        }
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("حدث خطأ أثناء تسجيل الدخول")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token)
    if (token && error === "يرجى إكمال التحقق من reCAPTCHA") {
      setError("")
    }
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
        <div className="mx-auto grid w-full max-w-md gap-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center space-y-4 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20"
            >
              <Snowflake className="h-8 w-8 text-sky-300 animate-spin" style={{ animationDuration: "3s" }} />
              <span className="font-bold text-2xl text-white">سنو هوست</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl font-bold text-white"
            >
              مرحباً بعودتك
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-sky-200 text-lg"
            >
              أدخل بياناتك للوصول إلى حسابك
            </motion.p>
          </motion.div>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="border-0 bg-white/10 backdrop-blur-md shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10" />
              <form onSubmit={handleLogin} className="relative z-10">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold text-white">تسجيل الدخول</CardTitle>
                  <CardDescription className="text-sky-200">
                    أدخل بريدك الإلكتروني وكلمة المرور
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Email Input */}
                  <div className="input-group">
                    <input
                      id="email"
                      type="email"
                      className="input w-full"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <label htmlFor="email" className="user-label">
                      <Mail className="inline w-4 h-4 mr-2" />
                      البريد الإلكتروني
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

                  {/* Forgot Password Link */}
                  <div className="flex justify-end">
                    <Link 
                      href="/forgot-password" 
                      className="text-sm text-sky-300 hover:text-sky-200 hover:underline transition-colors"
                    >
                      نسيت كلمة المرور؟
                    </Link>
                  </div>

                  {/* Messages */}
                  <AnimatePresence>
                    {message && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-green-400 text-sm bg-green-900/20 p-4 rounded-lg border border-green-500/30"
                      >
                        {message}
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

                  {/* ReCAPTCHA */}
                  <div className="flex justify-center">
                    <ReCAPTCHA
                      sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                      onChange={handleRecaptchaChange}
                      theme="dark"
                    />
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" className="border-sky-400 data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600" />
                    <label htmlFor="remember" className="text-sm font-normal text-sky-200">
                      تذكرني
                    </label>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-6">
                  {/* Login Button */}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white rounded-full h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <span className="mr-3">جاري تسجيل الدخول...</span>
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
                        تسجيل الدخول
                        <ArrowRight className="ml-3 h-5 w-5" />
                      </div>
                    )}
                  </Button>

                  {/* Divider */}
                  <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-sky-400/30" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white/10 backdrop-blur-sm px-4 text-sky-200">أو استمر مع</span>
                    </div>
                  </div>

                  {/* Social Login */}
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <Button
                      variant="outline"
                      type="button"
                      className="bg-white/10 backdrop-blur-sm border-sky-400/50 text-sky-200 hover:bg-sky-600/20 hover:text-white transition-all duration-300 h-12"
                      onClick={() => signIn('google')}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Google
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      className="bg-white/10 backdrop-blur-sm border-sky-400/50 text-sky-200 hover:bg-sky-600/20 hover:text-white transition-all duration-300 h-12"
                      onClick={() => signIn('discord')}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Discord
                    </Button>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </motion.div>

          {/* Sign Up Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center text-sky-200"
          >
            ليس لديك حساب؟{" "}
            <Link href="/signup" className="text-sky-300 hover:text-sky-200 hover:underline font-semibold transition-colors">
              سجل الآن
            </Link>
          </motion.p>
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


