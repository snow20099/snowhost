"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, ChangeEvent, FormEvent, useEffect } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, Save, Upload, RotateCcw, User, Settings, Shield, Palette, Globe, Bell, Cpu, HardDrive, Network, Server } from "lucide-react"

// أنواع TypeScript للبيانات المستندة إلى نموذج MongoDB
interface UserProfile {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  timezone: string;
  balance: number;
  currency: string;
  accountType: string;
  servers: any[];
  invoices: any[];
  resourceUsage: {
    cpu: number;
    memory: number;
    storage: number;
    network: number;
    totalStorage: number;
    totalMemory: number;
    totalNetwork: number;
    lastUpdated: Date;
  };
  preferences: {
    theme: string;
    language: string;
    notifications: boolean;
    autoUpdate: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export default function SettingsPage() {
  // حالة بيانات المستخدم
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // حالة التحميل
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // جلب بيانات المستخدم عند تحميل المكون
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // دالة لجلب بيانات المستخدم من API
  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user/profile');
      
      if (!response.ok) {
        throw new Error('فشل في جلب بيانات المستخدم');
      }
      
      const userData = await response.json();
      setUserProfile(userData);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("فشل في تحميل بيانات الملف الشخصي");
    } finally {
      setIsLoading(false);
    }
  };

  // معالج تحديث البيانات الشخصية
  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!userProfile) return;
    
    setIsUpdating(true);
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userProfile.name,
          phone: userProfile.phone,
          country: userProfile.country,
          timezone: userProfile.timezone,
          theme: userProfile.preferences.theme,
          language: userProfile.preferences.language,
        }),
      });
      
      if (!response.ok) {
        throw new Error('فشل في تحديث البيانات');
      }
      
      const updatedUser = await response.json();
      setUserProfile(updatedUser);
      toast.success("تم تحديث الملف الشخصي بنجاح");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("فشل في تحديث الملف الشخصي");
    } finally {
      setIsUpdating(false);
    }
  };

  // معالج تحديث الإعدادات
  const handleSettingsUpdate = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!userProfile) return;
    
    setIsUpdating(true);
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userProfile.name,
          phone: userProfile.phone,
          country: userProfile.country,
          timezone: userProfile.timezone,
          theme: userProfile.preferences.theme,
          language: userProfile.preferences.language,
          notifications: userProfile.preferences.notifications,
          autoUpdate: userProfile.preferences.autoUpdate,
        }),
      });
      
      if (!response.ok) {
        throw new Error('فشل في تحديث الإعدادات');
      }
      
      const updatedUser = await response.json();
      setUserProfile(updatedUser);
      toast.success("تم حفظ الإعدادات بنجاح");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("فشل في حفظ الإعدادات");
    } finally {
      setIsUpdating(false);
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
        // هنا يمكنك إضافة كود لرفع الصورة إلى الخادم
        toast.success("تم تحميل الصورة بنجاح");
      };
      reader.readAsDataURL(file);
    }
  };

  // معالج تغيير بيانات المستخدم
  const handleProfileChange = (field: keyof UserProfile, value: any) => {
    if (userProfile) {
      setUserProfile(prev => ({
        ...prev!,
        [field]: value
      }));
    }
  };

  // معالج تغيير التفضيلات
  const handlePreferenceChange = (field: keyof UserProfile['preferences'], value: any) => {
    if (userProfile) {
      setUserProfile(prev => ({
        ...prev!,
        preferences: {
          ...prev!.preferences,
          [field]: value
        }
      }));
    }
  };

  // عرض حالة التحميل
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">جاري تحميل البيانات...</span>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-destructive">فشل في تحميل بيانات المستخدم</p>
              <Button onClick={fetchUserProfile} className="mt-4">
                إعادة المحاولة
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <Server className="w-4 h-4" />
            موارد الخادم
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
                    <AvatarImage src="/placeholder-user.jpg" alt="Profile" />
                    <AvatarFallback className="text-2xl">
                      {userProfile.name ? userProfile.name[0] : 'U'}
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
                      className="flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      إعادة تعيين
                    </Button>
                  </div>
                  <span className="text-xs text-muted-foreground">JPG, PNG, أو GIF. الحد الأقصى للحجم 800KB.</span>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم الكامل</Label>
                  <Input
                    id="name"
                    value={userProfile.name || ''}
                    onChange={e => handleProfileChange("name", e.target.value)}
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
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    value={userProfile.phone || ''}
                    onChange={e => handleProfileChange("phone", e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">البلد</Label>
                  <Input
                    id="country"
                    value={userProfile.country || ''}
                    onChange={e => handleProfileChange("country", e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">المنطقة الزمنية</Label>
                  <Select 
                    value={userProfile.timezone || ''} 
                    onValueChange={value => handleProfileChange("timezone", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المنطقة الزمنية" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC+3">(UTC+3) العربية السعودية</SelectItem>
                      <SelectItem value="UTC+4">(UTC+4) الإمارات العربية المتحدة</SelectItem>
                      <SelectItem value="UTC+0">(UTC+0) غرينتش</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="md:col-span-2 flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-primary text-white px-8 flex items-center gap-2"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
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
                      value={userProfile.preferences.language || 'ar'} 
                      onValueChange={value => handlePreferenceChange("language", value)}
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="theme">المظهر</Label>
                    <Select 
                      value={userProfile.preferences.theme || 'light'} 
                      onValueChange={value => handlePreferenceChange("theme", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المظهر" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">فاتح</SelectItem>
                        <SelectItem value="dark">داكن</SelectItem>
                        <SelectItem value="auto">تلقائي</SelectItem>
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
                      checked={userProfile.preferences.notifications || false}
                      onCheckedChange={value => handlePreferenceChange("notifications", value)}
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
                      checked={userProfile.preferences.autoUpdate || false}
                      onCheckedChange={value => handlePreferenceChange("autoUpdate", value)}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-primary text-white px-8 flex items-center gap-2"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
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

        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>موارد الخادم</CardTitle>
              <CardDescription>استعراض استخدام موارد الخادم الخاص بك</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Cpu className="w-4 h-4" />
                      معالج المركز (CPU)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userProfile.resourceUsage.cpu}%</div>
                    <p className="text-xs text-muted-foreground">
                      من أصل {userProfile.resourceUsage.totalMemory} GB ذاكرة
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <HardDrive className="w-4 h-4" />
                      التخزين
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userProfile.resourceUsage.storage} GB</div>
                    <p className="text-xs text-muted-foreground">
                      من أصل {userProfile.resourceUsage.totalStorage} GB سعة تخزين
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Network className="w-4 h-4" />
                      النطاق الترددي
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userProfile.resourceUsage.network} GB</div>
                    <p className="text-xs text-muted-foreground">
                      من أصل {userProfile.resourceUsage.totalNetwork} GB هذا الشهر
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Server className="w-4 h-4" />
                      الخوادم
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userProfile.servers?.length || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      خوادم نشطة في حسابك
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6 text-xs text-muted-foreground">
                آخر تحديث: {new Date(userProfile.resourceUsage.lastUpdated).toLocaleDateString('ar-SA')}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
