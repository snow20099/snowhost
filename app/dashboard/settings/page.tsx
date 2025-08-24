"use client"

import type React from "react"
import { useState } from "react"
import { usePathname } from "next/navigation"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState("security")

  return (
    <SidebarProvider>
      <div className="flex">
        {/* Sidebar */}
        <Sidebar>
          <SidebarHeader>الإعدادات</SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>عام</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeTab === "security"}
                      onClick={() => setActiveTab("security")}
                    >
                      الأمان
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeTab === "billing"}
                      onClick={() => setActiveTab("billing")}
                    >
                      الفوترة
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <p className="text-xs text-muted-foreground">Snowhost Panel</p>
          </SidebarFooter>
        </Sidebar>

        {/* Main content */}
        <main className="flex-1 p-6">
          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>الأمان</CardTitle>
                <CardDescription>
                  إدارة إعدادات الأمان وكلمة المرور
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold">تغيير كلمة المرور</h3>
                  <p className="text-sm text-muted-foreground">
                    يمكنك تحديث كلمة المرور الخاصة بك هنا.
                  </p>
                  <Button className="mt-2">تغيير كلمة المرور</Button>
                </div>
                <div>
                  <h3 className="font-semibold">المصادقة الثنائية</h3>
                  <p className="text-sm text-muted-foreground">
                    أضف طبقة إضافية من الأمان إلى حسابك.
                  </p>
                  <Button className="mt-2">إعداد 2FA</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "billing" && (
            <Card>
              <CardHeader>
                <CardTitle>الفوترة</CardTitle>
                <CardDescription>
                  إدارة اشتراكاتك ومعلومات الدفع
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>تفاصيل الفوترة ستظهر هنا.</p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </SidebarProvider>
  )
}
