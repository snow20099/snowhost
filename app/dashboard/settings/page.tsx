"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, ChangeEvent, FormEvent } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, Save, Upload, RotateCcw, Bell, Shield, Palette } from "lucide-react"

// أنواع TypeScript للبيانات
interface UserProfile {
  profilePic: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
}

interface AppSettings {
  language: string;
  notifications: boolean;
  darkMode: boolean;
  autoUpdate: boolean;
}

export default function SettingsPage() {
  // حالة بيانات المستخدم
  const [userProfile, setUserProfile] = useState<UserProfile>({
    profilePic: "/placeholder-user.jpg",
    firstName: "محمد",
    lastName: "عمر",
    username: "ps_xx",
    email: "medabouomar02@outlook.com",
    phone: "+966 123 456 789"
  });

  // حالة إعدادات التطبيق
  const [appSettings, setAppSettings] = useState<AppSettings>({
    language: "ar",
    notifications: true,
    darkMode: false,
    autoUpdate: true
  });

  // حالة التحميل
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // معالج تحديث البيانات الشخصية
  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // محاكاة طلب API
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("تم تحديث الملف الشخصي بنجاح");
    } catch (error) {
      toast.error("فشل في تحديث الملف الشخصي");
    } finally {
      setIsLoading(false);
    }
  };

  // معالج تحديث الإعدادات
  const handleSettingsUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // محاكاة طلب API
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("تم حفظ الإعدادات بنجاح");
    } catch (error) {
      toast.error("فشل في حفظ الإعدادات");
    } finally {
      setIsLoading(false);
    }
  };

  // معالج تحميل الصورة
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) {
        toast.error("حجم الملف كبير جداً. الحد الأقصى هو 800KB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserProfile(prev => ({
          ...prev,
          profilePic: e.target?.result as string
        }));
        toast.success("تم تحميل الصورة بنجاح");
      };
      reader.readAsDataURL(file);
    }
  };

  // معالج تغيير بيانات المستخدم
  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // معالج تغيير الإعدادات
  const handleSettingChange = (field: keyof AppSettings, value: boolean | string) => {
    setAppSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">الإعدادات</h1>
        <p className="text-muted-foreground">إدارة إعدادات حسابك وتفضيلات النظام</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            الملف الشخصي
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            الإعدادات
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            الأمان
          </TabsTrigger>
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
                    <AvatarImage src={userProfile.profilePic} alt="Profile" />
                    <AvatarFallback className="text-2xl">
                      {userProfile.firstName[0]}{userProfile.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex gap-2">
                    <Button asChild type="button" className="bg-primary text-white">
                      <Label htmlFor="profile-picture" className="cursor-pointer flex items-center gap-2">
                        <Upload className="w-4 h-4" />
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
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => handleProfileChange("profilePic", "/placeholder-user.jpg")}
                      className="flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      إعادة تعيين
                    </Button>
                  </div>
                  <span className="text-xs text-muted-foreground">JPG, PNG, أو GIF. الحد الأقصى للحجم 800KB.</span>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">اسم المستخدم</Label>
                  <Input
                    id="username"
                    value={userProfile.username}
                    onChange={e => handleProfileChange("username", e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userProfile.email}
                    disabled
                    className="w-full bg-muted"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="firstName">الاسم الأول</Label>
                  <Input
                    id="firstName"
                    value={userProfile.firstName}
                    onChange={e => handleProfileChange("firstName", e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">اسم العائلة</Label>
                  <Input
                    id="lastName"
                    value={userProfile.lastName}
                    onChange={e => handleProfileChange("lastName", e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    value={userProfile.phone}
                    onChange={e => handleProfileChange("phone", e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div className="md:col-span-2 flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-primary text-white px-8 flex items-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
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
                    <Select 
                      value={appSettings.language} 
                      onValueChange={value => handleSettingChange("language", value)}
                    >
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
                      checked={appSettings.notifications}
                      onCheckedChange={value => handleSettingChange("notifications", value)}
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
                      checked={appSettings.darkMode}
                      onCheckedChange={value => handleSettingChange("darkMode", value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>التحديث التلقائي</Label>
                      <p className="text-sm text-muted-foreground">
                        تنزيل التحديثات تلقائياً عند توفرها
                      </p>
                    </div>
                    <Switch
                      checked={appSettings.autoUpdate}
                      onCheckedChange={value => handleSettingChange("autoUpdate", value)}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-primary text-white px-8 flex items-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
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

// أيقونات إضافية
function User(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function Settings(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
