"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Snowflake } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setSuccess(true)
      } else {
        const data = await response.json()
        setError(data.error || 'حدث خطأ أثناء إرسال طلب إعادة تعيين كلمة المرور')
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-600 via-sky-800 to-black flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "8s" }} />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-sky-800/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "12s" }} />
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-sky-400/10 rounded-full blur-2xl animate-float" />
        </div>

        <div className="container px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mx-auto w-full max-w-md"
          >
            <Card className="border-0 bg-white/10 backdrop-blur-md shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10" />
              <div className="relative z-10">
                <CardHeader className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600/20 border border-green-500/30"
                  >
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </motion.div>
                  <CardTitle className="text-2xl font-bold text-white">تم إرسال الطلب بنجاح</CardTitle>
                  <CardDescription className="text-sky-200 text-lg">
                    تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <Alert className="bg-green-900/20 border-green-500/30">
                      <AlertDescription className="text-green-200">
                        تحقق من صندوق الوارد الخاص بك واتبع التعليمات لإعادة تعيين كلمة المرور.
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <Button asChild className="w-full bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white rounded-full h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <Link href="/login">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        العودة لتسجيل الدخول
                      </Link>
                    </Button>
                  </motion.div>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Custom CSS for animations */}
        <style jsx>{`
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
              نسيت كلمة المرور؟
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-sky-200 text-lg"
            >
              أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور
            </motion.p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="border-0 bg-white/10 backdrop-blur-md shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10" />
              <form onSubmit={handleSubmit} className="relative z-10">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold text-white">إعادة تعيين كلمة المرور</CardTitle>
                  <CardDescription className="text-sky-200">
                    سنرسل رابطاً لبريدك الإلكتروني
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

                  {/* Error Message */}
                  <AnimatePresence>
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

                <CardFooter className="flex flex-col space-y-6">
                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white rounded-full h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <span className="mr-3">جاري الإرسال...</span>
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
                      "إرسال رابط إعادة التعيين"
                    )}
                  </Button>

                  {/* Back to Login Link */}
                  <div className="text-center">
                    <Link 
                      href="/login" 
                      className="inline-flex items-center text-sky-300 hover:text-sky-200 hover:underline font-semibold transition-colors"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      العودة لتسجيل الدخول
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Card>
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