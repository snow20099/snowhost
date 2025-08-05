"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Server, Mail, MessageSquare, ArrowLeft, ArrowRight } from "lucide-react"
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
  const [error, setError] = useState("")

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })
    setIsLoading(false)
    if (res.ok) {
      // هنا رابط التحقق مع كود (الكود راح تولده السيرفر بعد التسجيل عادة)
      // افترضنا أن الكود تم إنشاؤه على السيرفر ورفعه مع الرد أو تستخدم إيميل فقط
      const verificationCode = "generated-code-from-server"; // لازم تجيبه من الرد الحقيقي أو طريقة بديلة

      const verificationLink = `https://yourdomain.com/verify-email?code=${verificationCode}&email=${encodeURIComponent(email)}`

      await fetch("/api/auth/send-verification-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, verificationLink }),
      })

      // تسجيل دخول تلقائي (ممكن تلغيه لو تبغى المستخدم يظل ينتظر التفعيل)
      await signIn("credentials", { email, password, callbackUrl: "/dashboard" })
    } else {
      const data = await res.json()
      setError(data.error || "Registration failed")
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
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 bg-gradient-to-b from-background via-background/95 to-background/90">
      <div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px] [mask-image:radial-gradient(white,transparent_70%)]" />

      {/* Animated gradient orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: "8s" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: "12s" }}
      />

      <div className="container px-4 md:px-6 relative z-10">
        <div className="mx-auto grid w-full max-w-md gap-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center space-y-2 text-center"
          >
            <div className="flex items-center gap-2">
              <Server className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-xl">SnowHost</span>
            </div>
            <h1 className="text-3xl font-bold">Create an account</h1>
            <p className="text-muted-foreground">Sign up to get started with SnowHost</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
              <form onSubmit={step === totalSteps ? handleSignup : nextStep}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Sign Up</CardTitle>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalSteps }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 w-10 rounded-full transition-all duration-300 ${i < step ? "bg-blue-600" : "bg-muted"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <CardDescription>
                    {step === 1 ? "Create your account to get started" : "Complete your profile"}
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
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            className="bg-background/50 border-border/50 focus:border-blue-600"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            required
                            className="bg-background/50 border-border/50 focus:border-blue-600"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm Password</Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            required
                            className="bg-background/50 border-border/50 focus:border-blue-600"
                          />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
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
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="first-name">First name</Label>
                            <Input
                              id="first-name"
                              placeholder="John"
                              required
                              className="bg-background/50 border-border/50 focus:border-blue-600"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="last-name">Last name</Label>
                            <Input
                              id="last-name"
                              placeholder="Doe"
                              required
                              className="bg-background/50 border-border/50 focus:border-blue-600"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">Company (Optional)</Label>
                          <Input
                            id="company"
                            placeholder="Acme Inc."
                            className="bg-background/50 border-border/50 focus:border-blue-600"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="terms" required />
                          <Label htmlFor="terms" className="text-sm font-normal">
                            I agree to the{" "}
                            <Link href="/terms" className="text-blue-600 hover:underline">
                              terms of service
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="text-blue-600 hover:underline">
                              privacy policy
                            </Link>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="newsletter" />
                          <Label htmlFor="newsletter" className="text-sm font-normal">
                            Subscribe to our newsletter for updates and offers
                          </Label>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>

                <CardFooter className="flex flex-col space-y-4">
                  <div className="flex w-full gap-4">
                    {step > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="flex-1 bg-background/50 border-border/50 rounded-full"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                    )}
                    <Button
                      type="submit"
                      className={`${step === 1 ? "w-full" : "flex-1"} bg-blue-600 hover:bg-blue-700 text-white rounded-full`}
                      disabled={isLoading}
                    >
                      {step < totalSteps ? (
                        <div className="flex items-center justify-center">
                          Next
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      ) : isLoading ? (
                        <div className="flex items-center">
                          <span className="mr-2">Creating account</span>
                          <div className="flex space-x-1">
                            <div
                              className="h-2 w-2 bg-white rounded-full animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            ></div>
                            <div
                              className="h-2 w-2 bg-white rounded-full animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            ></div>
                            <div
                              className="h-2 w-2 bg-white rounded-full animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        "Create account"
                      )}
                    </Button>
                  </div>

                  {step === 1 && (
                    <>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">Or sign up with</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                          className="bg-background/50 border-border/50 hover:bg-blue-600/10 hover:text-blue-600 transition-all duration-300"
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Google
                        </Button>
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
                          className="bg-background/50 border-border/50 hover:bg-blue-600/10 hover:text-blue-600 transition-all duration-300"
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

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center text-sm text-muted-foreground"
          >
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </motion.p>
        </div>
      </div>
    </div>
  )
}
