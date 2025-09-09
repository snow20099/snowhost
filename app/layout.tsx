import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import CookieConsent from "@/components/cookie-consent"
import LiveChatWidget from "@/components/live-chat-widget"
import ClientProviders from "@/components/ClientProviders"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })
const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700", "800", "900"], 
  variable: "--font-poppins", 
  display: "swap" 
})
const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: "--font-jetbrains-mono", 
  display: "swap" 
})

export const metadata: Metadata = {
  title: "SnowHost - استضافة خوادم الألعاب المتطورة",
  description: "احصل على أفضل تجربة استضافة للعبة مع أداء عالي ودعم 24/7",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable} font-tajawal bg-background`}>
        <ClientProviders>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CookieConsent />
            <LiveChatWidget />
          </div>
        </ClientProviders>
      </body>
    </html>
  )
}