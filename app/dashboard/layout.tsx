"use client"

import type React from "react"
import { Badge } from "@/components/ui/badge";
import { Home, Server, CreditCard, Wallet, User, BarChart3, Gamepad2, Cloud, Globe, Settings } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

export default function DashboardLayout({ children }: { children: React.ReactNode; }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Check authentication
  useEffect(() => {
    if (status === "loading") return; // Still loading
    
    if (status === "unauthenticated") {
      // Show toast notification before redirecting
      toast({
        title: "تنبيه",
        description: "يرجى تسجيل الدخول أولاً",
        variant: "destructive",
        duration: 5000, // 5 seconds
      });
      
      // Redirect to login page
      router.push('/login');
    }
  }, [status, router]);

  // Show loading while checking auth
  if (status === "loading") {
    return (
      <div className="flex h-screen bg-gradient-to-br from-sky-600 via-sky-800 to-black items-center justify-center">
        <div className="text-white text-xl">جاري التحميل...</div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    return null; // Will redirect to login
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-sky-600 via-sky-800 to-black">
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0 bg-sky-900/90 backdrop-blur-sm border-r border-sky-700 shadow-lg">
        <div className="p-4 border-b border-sky-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">❄️</span>
            </div>
            <span className="text-xl font-bold text-white">سنو هوست</span>
          </div>
        </div>
        
        <div className="p-4">
          {/* Main Menu */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-sky-300 mb-4 uppercase tracking-wider">القائمة الرئيسية</h3>
            <div className="space-y-2">
              <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-lg text-sky-100 hover:bg-sky-800/50 hover:text-white transition-colors">
                <Home className="h-5 w-5" />
                <span>لوحة التحكم</span>
              </Link>
              <Link href="/dashboard/servers" className="flex items-center gap-3 p-3 rounded-lg text-sky-100 hover:bg-sky-800/50 hover:text-white transition-colors">
                <Server className="h-5 w-5" />
                <span>خوادمي</span>
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-sky-300 mb-4 uppercase tracking-wider">الخدمات</h3>
            <div className="space-y-2">
              <Link href="/dashboard/services/gaming" className="flex items-center gap-3 p-3 rounded-lg text-sky-100 hover:bg-sky-800/50 hover:text-white transition-colors">
                <Gamepad2 className="h-5 w-5" />
                <span>استضافة الألعاب</span>
              </Link>
              <div className="flex items-center gap-3 p-3 rounded-lg text-sky-400/50 cursor-not-allowed">
                <Cloud className="h-5 w-5" />
                <span>استضافة VPS</span>
                <Badge variant="secondary" className="text-xs">قريباً</Badge>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg text-sky-400/50 cursor-not-allowed">
                <Globe className="h-5 w-5" />
                <span>استضافة الويب</span>
                <Badge variant="secondary" className="text-xs">قريباً</Badge>
              </div>
            </div>
          </div>

          {/* Account */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-sky-300 mb-4 uppercase tracking-wider">الحساب</h3>
            <div className="space-y-2">
              <Link href="/dashboard/billing" className="flex items-center gap-3 p-3 rounded-lg text-sky-100 hover:bg-sky-800/50 hover:text-white transition-colors">
                <CreditCard className="h-5 w-5" />
                <span>الفواتير</span>
              </Link>
              <Link href="/dashboard/wallet" className="flex items-center gap-3 p-3 rounded-lg text-sky-100 hover:bg-sky-800/50 hover:text-white transition-colors">
                <Wallet className="h-5 w-5" />
                <span>المحفظة</span>
              </Link>
              <Link href="/dashboard/profile" className="flex items-center gap-3 p-3 rounded-lg text-sky-100 hover:bg-sky-800/50 hover:text-white transition-colors">
                <User className="h-5 w-5" />
                <span>الملف الشخصي</span>
              </Link>
              <Link href="/dashboard/settings" className="flex items-center gap-3 p-3 rounded-lg text-sky-100 hover:bg-sky-800/50 hover:text-white transition-colors">
                <Settings className="h-5 w-5" />
                <span>الإعدادات</span>
              </Link>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="p-4 border-t border-sky-700 mt-auto">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-sky-800/50 border border-sky-600">
            <BarChart3 className="h-5 w-5 text-sky-300" />
            <div className="flex-1">
              <div className="text-sm font-medium text-sky-100">حالة النظام</div>
              <div className="text-xs text-sky-200">جميع الخدمات تعمل بشكل طبيعي</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-sky-600 via-sky-800 to-black">
        <main className="flex-1 p-6 bg-transparent">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
