"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, ChangeEvent, FormEvent, useEffect, useRef } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, Save, Upload, RotateCcw, User, Settings, Shield, Bell, Lock, Key, Globe } from "lucide-react"
import { useSession } from "next-auth/react"

// تعريف أنواع البيانات
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  timezone?: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
}

// قائمة الرموز الدولية للهواتف
const countryCodes = [
  { code: "+966", name: "السعودية", flag: "🇸🇦" },
  { code: "+971", name: "الإمارات", flag: "🇦🇪" },
  { code: "+973", name: "البحرين", flag: "🇧🇭" },
  { code: "+974", name: "قطر", flag: "🇶🇦" },
  { code: "+968", name: "عمان", flag: "🇴🇲" },
  { code: "+965", name: "الكويت", flag: "🇰🇼" },
  { code: "+20", name: "مصر", flag: "🇪🇬" },
  { code: "+962", name: "الأردن", flag: "🇯🇴" },
  { code: "+963", name: "سوريا", flag: "🇸🇾" },
  { code: "+961", name: "لبنان", flag: "🇱🇧" },
  { code: "+964", name: "العراق", flag: "🇮🇶" },
  { code: "+212", name: "المغرب", flag: "🇲🇦" },
  { code: "+216", name: "تونس", flag: "🇹🇳" },
  { code: "+213", name: "الجزائر", flag: "🇩🇿" },
  { code: "+967", name: "اليمن", flag: "🇾🇪" },
  { code: "+249", name: "السودان", flag: "🇸🇩" },
];

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileImage, setProfileImage] = useState("/placeholder-user.jpg");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("+964");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // تحميل بيانات المستخدم عند تحميل الصفحة
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const userData = await response.json();
          setUserProfile(userData);
          if (userData.phone) {
            const phoneMatch = userData.phone.match(/^(\+\d{1,4})\s(.+)$/);
            if (phoneMatch) {
              setSelectedCountryCode(phoneMatch[1]);
              setPhoneNumber(phoneMatch[2]);
            } else {
              setPhoneNumber(userData.phone);
            }
          }
          if (userData.profileImage) {
            setProfileImage(userData.profileImage);
          }
        }
      } catch (error) {
        console.error("خطأ في تحميل بيانات المستخدم:", error);
        toast.error("فشل في تحميل بيانات المستخدم");
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchUserProfile();
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
  }, [status]);

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
        if (e.target?.result) {
          const newImage = e.target.result as string;
          setProfileImage(newImage);
          toast.success("تم تحميل الصورة بنجاح", {
            description: "تم تحديث الصورة بنجاح",
            duration: 2000
          });
        }
      };
      reader.onerror = () => {
        toast.error("فشل في تحميل الصورة");
      };
      reader.readAsDataURL(file);
    }
  };

  // معالج تحديث الملف الشخصي
  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;
    setIsUpdating(true);
    try {
      const fullPhone = `${selectedCountryCode} ${phoneNumber}`;
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userProfile.name,
          phone: fullPhone,
          country: userProfile.country,
          timezone: userProfile.timezone,
          theme: userProfile.preferences.theme,
          language: userProfile.preferences.language,
          profileImage: profileImage !== "/placeholder-user.jpg" ? profileImage : undefined,
        }),
      });
      if (!response.ok) throw new Error('فشل في تحديث البيانات');
      const updatedUser = await response.json();
      setUserProfile(updatedUser);
      toast.success("تم تحديث الملف الشخصي بنجاح", {
        description: "تم حفظ جميع التغييرات التي أجريتها",
        duration: 3000,
        position: "top-center"
      });
    } catch (error) {
      console.error("Update error:", error);
      toast.error("فشل في تحديث الملف الشخصي", {
        description: "يرجى المحاولة مرة أخرى",
        duration: 3000,
        position: "top-center"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleProfileChange = (field: keyof UserProfile, value: any) => {
    if (userProfile) {
      const updatedUser = { ...userProfile, [field]: value };
      setUserProfile(updatedUser);
    }
  };

  const handlePreferenceChange = (field: string, value: any) => {
    if (userProfile) {
      const updatedUser = {
        ...userProfile,
        preferences: { ...userProfile.preferences, [field]: value }
      };
      setUserProfile(updatedUser);
    }
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    if (userProfile) {
      const updatedUser = {
        ...userProfile,
        preferences: {
          ...userProfile.preferences,
          notifications: { ...userProfile.preferences.notifications, [field]: value }
        }
      };
      setUserProfile(updatedUser);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>يرجى تسجيل الدخول للوصول إلى الإعدادات</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">إعدادات الحساب</h1>
        <p className="text-muted-foreground">إدارة معلومات حسابك وتفضيلاتك</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            الملف الشخصي
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            التفضيلات
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            الأمان
          </TabsTrigger>
        </TabsList>

        {/* تبويب الملف الشخصي */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>الملف الشخصي</CardTitle>
              <CardDescription>
                إدارة معلوماتك الشخصية وصورة الملف الشخصي
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="w-24 h-24 border-2 border-primary">
                    <AvatarImage src={profileImage} alt="Profile" />
                    <AvatarFallback className="text-2xl">
                      {userProfile.name ? userProfile.name[0] : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      className="bg-primary text-white flex items-center gap-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4" />
                      رفع صورة جديدة
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => setProfileImage("/placeholder-user.jpg")}
                    >
                      <RotateCcw className="w-4 h-4" />
                      إعادة تعيين
                    </Button>
                  </div>
                  <span className="text-xs text-muted-foreground">JPG, PNG, أو GIF. الحد الأقصى للحجم 800KB.</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <div className="flex gap-2">
                      <Select value={selectedCountryCode} onValueChange={setSelectedCountryCode}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="رمز الدولة" />
                        </SelectTrigger>
                        <SelectContent>
                          {countryCodes.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.flag} {country.code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        id="phone"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        className="flex-1"
                        placeholder="رقم الهاتف"
                      />
                    </div>
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
                    حفظ التغييرات
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تبويب التفضيلات */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>التفضيلات</CardTitle>
              <CardDescription>
                تخصيص تجربة المستخدم حسب تفضيلاتك
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                <h3 className="font-medium flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  الإشعارات
                </h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>البريد الإلكتروني</Label>
                    <p className="text-sm text-muted-foreground">
                      تلقي إشعارات عبر البريد الإلكتروني
                    </p>
                  </div>
                  <Switch
                    checked={userProfile.preferences.notifications.email || false}
                    onCheckedChange={value => handleNotificationChange("email", value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>الإشعارات الدفعية</Label>
                    <p className="text-sm text-muted-foreground">
                      تلقي إشعارات على الجهاز
                    </p>
                  </div>
                  <Switch
                    checked={userProfile.preferences.notifications.push || false}
                    onCheckedChange={value => handleNotificationChange("push", value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>رسائل SMS</Label>
                    <p className="text-sm text-muted-foreground">
                      تلقي إشعارات عبر الرسائل النصية
                    </p>
                  </div>
                  <Switch
                    checked={userProfile.preferences.notifications.sms || false}
                    onCheckedChange={value => handleNotificationChange("sms", value)}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  className="bg-primary text-white px-8 flex items-center gap-2"
                  disabled={isUpdating}
                  onClick={handleProfileUpdate}
                >
                  {isUpdating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  حفظ التغييرات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تبويب الأمان */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>الأمان</CardTitle>
              <CardDescription>
                إدارة إعدادات الأمان وكلمة المرور
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    تغيير كلمة المرور
                  </h3>
                  <Button variant="outline">تغيير كلمة المرور</Button>
                </div>
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    المصادقة الثنائية
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    تأمين إضافي لحسابك باستخدام المصادقة الثنائية
                  </p>
                  <Button variant="outline">تفعيل المصادقة الثنائية</Button>
                </div>
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    الجلسات النشطة
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    عرض وإدارة الأجهزة المتصلة بحسابك
                  </p>
                  <Button variant="outline">إدارة الجلسات</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
