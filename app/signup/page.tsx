"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Server, Mail, MessageSquare, ArrowLeft, ArrowRight, Snowflake, Lock, User, Eye, EyeOff, AtSign } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { signIn } from "next-auth/react"

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const totalSteps = 2
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    // Debug: Show all form values
    console.log('Form values before submission:', {
      firstName,
      lastName,
      username,
      email,
      password: password ? '***' : 'empty'
    })
    
    // Validate required fields
    if (!firstName || !lastName || !username || !email || !password) {
      const missingFields = []
      if (!firstName) missingFields.push('firstName')
      if (!lastName) missingFields.push('lastName')
      if (!username) missingFields.push('username')
      if (!email) missingFields.push('email')
      if (!password) missingFields.push('password')
      
      console.error('Missing required fields:', missingFields)
      setError(`الحقول المطلوبة: ${missingFields.join(', ')}`)
      setIsLoading(false)
      return
    }
    
    try {
      // Prepare data for registration
      const userData = {
        name: `${firstName} ${lastName}`,
        username,
        email, 
        password 
      }
      
      console.log('Sending registration data:', {
        ...userData,
        password: password ? '***' : 'empty'
      })
      
      // Step 1: Register user account
      const registerRes = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })
      
      console.log('Register API response status:', registerRes.status)
      
      if (!registerRes.ok) {
        const data = await registerRes.json()
        console.error('Register API error:', data)
        throw new Error(data.error || "Registration failed")
      }
      
      const registerData = await registerRes.json()
      console.log('Register API success:', registerData)

      // Step 2: Show success message and redirect to login
      console.log('Registration successful, showing verification message...')
      setError(""); // Clear any previous errors
      // Show success message and redirect to login after a delay
      setTimeout(() => {
        window.location.href = "/login?message=verification_required";
      }, 2000);
      
    } catch (error) {
      console.error('Signup error:', error)
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
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
              إنشاء حساب جديد
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-sky-200 text-lg"
            >
              سجل الآن للبدء مع سنو هوست
            </motion.p>
          </motion.div>

          {/* Signup Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="border-0 bg-white/10 backdrop-blur-md shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10" />
              <form onSubmit={step === totalSteps ? handleSignup : nextStep} className="relative z-10">
                <CardHeader className="text-center pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-2xl font-bold text-white">التسجيل</CardTitle>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalSteps }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 w-10 rounded-full transition-all duration-300 ${i < step ? "bg-sky-600" : "bg-sky-400/30"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <CardDescription className="text-sky-200">
                    {step === 1 ? "أنشئ حسابك للبدء" : "أكمل ملفك الشخصي"}
                  </CardDescription>
                </CardHeader>

                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
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

                        {/* Confirm Password Input */}
                        <div className="input-group">
                          <input
                            id="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            className="input w-full pr-12"
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

                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-sm bg-red-900/20 p-4 rounded-lg border border-red-500/30"
                          >
                            {error}
                          </motion.div>
                        )}
                      </CardContent>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent className="space-y-6">
                        <div className="text-center mb-6">
                          <Server className="h-16 w-16 mx-auto text-sky-300 mb-3" />
                          <h3 className="text-xl font-semibold text-white">معلومات الحساب</h3>
                          <p className="text-sm text-sky-200">سيتم إنشاء حساب في الموقع</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          {/* First Name Input */}
                          <div className="input-group">
                            <input
                              id="first-name"
                              type="text"
                              className="input w-full"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              required
                            />
                            <label htmlFor="first-name" className="user-label">
                              <User className="inline w-4 h-4 mr-2" />
                              الاسم الأول
                            </label>
                          </div>

                          {/* Last Name Input */}
                          <div className="input-group">
                            <input
                              id="last-name"
                              type="text"
                              className="input w-full"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              required
                            />
                            <label htmlFor="last-name" className="user-label">
                              <User className="inline w-4 h-4 mr-2" />
                              الاسم الأخير
                            </label>
                          </div>
                        </div>
                        
                        {/* Username Input */}
                        <div className="input-group">
                          <input
                            id="username"
                            type="text"
                            className="input w-full"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                          />
                          <label htmlFor="username" className="user-label">
                            <AtSign className="inline w-4 h-4 mr-2" />
                            اسم المستخدم
                          </label>
                          <p className="text-xs text-sky-300 mt-2">سيتم استخدامه في الموقع</p>
                        </div>
                        
                        <div className="bg-sky-900/20 p-4 rounded-lg border border-sky-400/30">
                          <h4 className="font-medium text-sky-100 mb-3">معلومات الحساب:</h4>
                          <div className="text-sm text-sky-200 space-y-2">
                            <p><strong>البريد الإلكتروني:</strong> {email}</p>
                            <p><strong>اسم المستخدم:</strong> {username || 'سيتم تحديده'}</p>
                            <p><strong>الاسم الكامل:</strong> {firstName} {lastName}</p>
                            <p className="text-sky-300 font-medium">سيتم إنشاء حساب في الموقع</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox id="terms" required className="border-sky-400 data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600" />
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
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>

                <CardFooter className="flex flex-col space-y-6">
                  <div className="flex w-full gap-4">
                    {step > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="flex-1 bg-white/10 backdrop-blur-sm border-sky-400/50 text-sky-200 hover:bg-sky-600/20 hover:text-white rounded-full h-12 transition-all duration-300"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        رجوع
                      </Button>
                    )}
                    <Button
                      type="submit"
                      className={`${step === 1 ? "w-full" : "flex-1"} bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white rounded-full h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                      disabled={isLoading}
                    >
                      {step < totalSteps ? (
                        <div className="flex items-center justify-center">
                          التالي
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      ) : isLoading ? (
                        <div className="flex items-center">
                          <span className="mr-3">جاري إنشاء الحساب</span>
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
                        "إنشاء الحساب"
                      )}
                    </Button>
                  </div>

                  {step === 1 && (
                    <>
                      {/* Divider */}
                      <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-sky-400/30" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white/10 backdrop-blur-sm px-4 text-sky-200">أو سجل مع</span>
                        </div>
                      </div>

                      {/* Social Signup */}
                      <div className="grid grid-cols-2 gap-4 w-full">
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                          className="bg-white/10 backdrop-blur-sm border-sky-400/50 text-sky-200 hover:bg-sky-600/20 hover:text-white transition-all duration-300 h-12"
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Google
                        </Button>
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
                          className="bg-white/10 backdrop-blur-sm border-sky-400/50 text-sky-200 hover:bg-sky-600/20 hover:text-white transition-all duration-300 h-12"
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Discord
                        </Button>
                      </div>
                    </>
                  )}
                </CardFooter>
              </form>
            </Card>
          </motion.div>

          {/* Login Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center text-sky-200"
          >
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="text-sky-300 hover:text-sky-200 hover:underline font-semibold transition-colors">
              تسجيل الدخول
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
