"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function SettingsPage() {
  const [profilePic, setProfilePic] = useState("/placeholder-user.jpg")
  const [firstName, setFirstName] = useState("محمد")
  const [lastName, setLastName] = useState("عمر")
  const [username, setUsername] = useState("ps_xx")
  const [email] = useState("medabouomar02@outlook.com")
  const [phone, setPhone] = useState("+966 123 456 789")
  const [language, setLanguage] = useState("ar")
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("تم تحديث الملف الشخصي بنجاح")
  }

  const handleSettingsUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("تم حفظ الإعدادات بنجاح")
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 800 * 1024) {
        toast.error("حجم الملف كبير جداً. الحد الأقصى هو 800KB")
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfilePic(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      toast.success("تم تحميل الصورة بنجاح")
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">الإعدادات</h1>
        <p className="text-muted-foreground">إدارة إعدادات حسابك وتفضيلات النظام</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          <TabsTrigger value="security">الأمان</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>تفاصيل الملف الشخصي</CardTitle>
              <CardDescription>قم بتحديث معلوماتك الشخصية هنا</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="flex flex-col items-center gap-4 md:col-span-2">
                  <Avatar className="w-24 h-24 border-2 border-primary">
                    <AvatarImage src={profilePic} alt="Profile" />
                    <AvatarFallback className="text-2xl">
                      {firstName[0]}{lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex gap-2">
                    <Button asChild type="button" className="bg-primary text-white">
                      <Label htmlFor="profile-picture" className="cursor-pointer">
                        رفع صورة جديدة
                      </Label>
                    </Button>
                    <Input
                      id="profile-picture"
                      type="file"
                      accept="image/jpeg,image/png,image/gif"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <Button type="button" variant="outline" onClick={() => setProfilePic("/placeholder-user.jpg")}>
                      إعادة تعيين
                    </Button>
                  </div>
                  <span className="text-xs text-muted-foreground">JPG, PNG, أو GIF. الحد الأقصى للحجم 800KB.</span>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">اسم المستخدم</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="w-full bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName">الاسم الأول</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">اسم العائلة</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <Button type="submit" className="bg-primary text-white px-8">
                    حفظ التغييرات
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات التطبيق</CardTitle>
              <CardDescription>تخصيص تجربة المستخدم حسب تفضيلاتك</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSettingsUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="language">اللغة</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر اللغة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>الإشعارات</Label>
                      <p className="text-sm text-muted-foreground">
                        تلقي إشعارات حول التحديثات الجديدة
                      </p>
                    </div>
                    <Switch
                      checked={notifications}
                      onCheckedChange={setNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>الوضع الليلي</Label>
                      <p className="text-sm text-muted-foreground">
                        تبديل المظهر بين الفاتح والداكن
                      </p>
                    </div>
                    <Switch
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" className="bg-primary text-white px-8">
                    حفظ الإعدادات
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>الأمان</CardTitle>
              <CardDescription>إدارة إعدادات أمان حسابك</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>المصادقة الثنائية (2FA)</Label>
                      <p className="text-sm text-muted-foreground">
                        إضافة طبقة أمان إضافية لحسابك
                      </p>
                    </div>
                    <Button variant="outline">تفعيل</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>جلسات التسجيل</Label>
                      <p className="text-sm text-muted-foreground">
                        عرض وإدارة جلسات تسجيل الدخول النشطة
                      </p>
                    </div>
                    <Button variant="outline">عرض الجلسات</Button>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium text-destructive">منطقة الخطر</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    حذف حسابك بشكل دائم وإزالة جميع بياناتك
                  </p>
                  <Button variant="destructive">حذف الحساب</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
