"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Camera, Upload } from "lucide-react"

export default function SettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    profilePic: "/placeholder-user.jpg",
    firstName: "Omar",
    lastName: "Medabou",
    username: "ps_xx",
    email: "medabouomar02@outlook.com",
    phone: "+212612345678",
    notifications: true,
    newsletter: false
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // محاكاة طلب API
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast({
        title: "تم حفظ الإعدادات",
        description: "تم تحديث معلوماتك بنجاح",
      })
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حفظ الإعدادات",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 800000) {
        toast({
          title: "خطأ",
          description: "حجم الملف كبير جداً",
          variant: "destructive"
        })
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        handleInputChange("profilePic", e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">الإعدادات</h1>
        <p className="text-muted-foreground">إدارة إعدادات حسابك وتفضيلاتك</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>معلومات الملف الشخصي</CardTitle>
            <CardDescription>
              تحديث صورة الملف الشخصي ومعلوماتك الشخصية
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img 
                  src={profileData.profilePic} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover border-2 border-blue-600" 
                />
                <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer">
                  <Camera className="w-4 h-4 text-white" />
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              <span className="text-xs text-muted-foreground">JPG, PNG, أو GIF. الحجم الأقصى 800KB</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">الاسم الأول</Label>
                <Input
                  id="firstName"
                  value={profileData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">الاسم الأخير</Label>
                <Input
                  id="lastName"
                  value={profileData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">اسم المستخدم</Label>
                <Input
                  id="username"
                  value={profileData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">لا يمكن تغيير البريد الإلكتروني</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>التفضيلات</CardTitle>
            <CardDescription>
              إدارة تفضيلات الإشعارات والاتصالات
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>الإشعارات</Label>
                <p className="text-sm text-muted-foreground">
                  تلقي إشعارات حول أنشطة الحساب
                </p>
              </div>
              <Switch
                checked={profileData.notifications}
                onCheckedChange={(checked) => handleInputChange("notifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>النشرة الإخبارية</Label>
                <p className="text-sm text-muted-foreground">
                  تلقي آخر التحديثات والعروض
                </p>
              </div>
              <Switch
                checked={profileData.newsletter}
                onCheckedChange={(checked) => handleInputChange("newsletter", checked)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline">
            إلغاء
          </Button>
          <Button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              "حفظ التغييرات"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
