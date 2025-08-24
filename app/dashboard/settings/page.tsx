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
import { Loader2, Save, Upload, RotateCcw, User, Settings, Shield } from "lucide-react"
import { useSession } from "next-auth/react"
import { emitProfileUpdate } from "@/utilities/events"

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
            // فصل رمز البلد عن رقم الهاتف
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
          
          // إرسال إشعار للمكونات الأخرى
          emitProfileUpdate({ image: newImage });
          
          toast.success("تم تحميل الصورة بنجاح", {
            description: "تم تحديث الصورة في جميع أنحاء التطبيق",
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
      // دمج الرمز الدولي مع رقم الهاتف
      const fullPhone = `${selectedCountryCode} ${phoneNumber}`;
      
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
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
      
      if (!response.ok) {
        throw new Error('فشل في تحديث البيانات');
      }
      
      const updatedUser = await response.json();
      setUserProfile(updatedUser);
      
      // إرسال إشعار بتحديث الاسم والصورة
      emitProfileUpdate({ 
        name: updatedUser.name,
        image: profileImage !== "/placeholder-user.jpg" ? profileImage : undefined
      });
      
      // إظهار رسالة نجاح واضحة
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

  // معالج تغيير بيانات المستخدم
  const handleProfileChange = (field: keyof UserProfile, value: any) => {
    if (userProfile) {
      const updatedUser = {
        ...userProfile,
        [field]: value
      };
      
      setUserProfile(updatedUser);
      
      // إذا تم تغيير الاسم، أرسل إشعار فوري
      if (field === 'name') {
        emitProfileUpdate({ name: value });
      }
    }
  };

  // معالج تغيير إعدادات التفضيلات
  const handlePreferenceChange = (field: string, value: any) => {
    if (userProfile) {
      const updatedUser = {
        ...userProfile,
        preferences: {
          ...userProfile.preferences,
          [field]: value
        }
      };
      setUserProfile(updatedUser);
    }
  };

  // معالج تغيير إعدادات الإشعارات
  const handleNotificationChange = (field: string, value: boolean) => {
    if (userProfile) {
      const updatedUser = {
        ...userProfile,
        preferences: {
          ...userProfile.preferences,
          notifications: {
            ...userProfile.preferences.notifications,
            [field]: value
          }
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

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>المعلومات الشخصية</CardTitle>
              <CardDescription>
                تحديث معلومات الملف الشخصي الخاص بك
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                {/* قسم الصورة الشخصية */}
                <div className="flex items-center space-x-4 space-x-reverse">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={profileImage} alt={userProfile.name} />
                    <AvatarFallback className="text-lg">
                      {userProfile.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        تحميل صورة
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="flex items-center gap-2"
                        onClick={() => {
                          setProfileImage("/placeholder-user.jpg");
                          emitProfileUpdate({ image: "/placeholder-user.jpg" });
                          toast.success("تم إعادة تعيين الصورة");
                        }}
                      >
                        <RotateCcw className="w-4 h-4" />
                        إعادة تعيين
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      JPG, PNG أو GIF. الحد الأقصى 800KB
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* المعلومات الأساسية */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم الكامل</Label>
                    <Input
                      id="name"
                      value={userProfile.name}
                      onChange={(e) => handleProfileChange('name', e.target.value)}
                      placeholder="أدخل الاسم الكامل"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userProfile.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>

                {/* رقم الهاتف */}
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <div className="flex gap-2">
                    <Select value={selectedCountryCode} onValueChange={setSelectedCountryCode}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+964">🇮🇶 +964</SelectItem>
                        <SelectItem value="+966">🇸🇦 +966</SelectItem>
                        <SelectItem value="+971">🇦🇪 +971</SelectItem>
                        <SelectItem value="+962">🇯🇴 +962</SelectItem>
                        <SelectItem value="+961">🇱🇧 +961</SelectItem>
                        <SelectItem value="+20">🇪🇬 +20</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="رقم الهاتف"
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* البلد والمنطقة الزمنية */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">البلد</Label>
                    <Select value={userProfile.country || ""} onValueChange={(value) => handleProfileChange('country', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر البلد" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IQ">العراق</SelectItem>
                        <SelectItem value="SA">السعودية</SelectItem>
                        <SelectItem value="AE">الإمارات</SelectItem>
                        <SelectItem value="JO">الأردن</SelectItem>
                        <SelectItem value="LB">لبنان</SelectItem>
                        <SelectItem value="EG">مصر</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">المنطقة الزمنية</Label>
                    <Select value={userProfile.timezone || ""} onValueChange={(value) => handleProfileChange('timezone', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المنطقة الزمنية" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Baghdad">بغداد (GMT+3)</SelectItem>
                        <SelectItem value="Asia/Riyadh">الرياض (GMT+3)</SelectItem>
                        <SelectItem value="Asia/Dubai">دبي (GMT+4)</SelectItem>
                        <SelectItem value="Asia/Amman">عمان (GMT+3)</SelectItem>
                        <SelectItem value="Asia/Beirut">بيروت (GMT+2)</SelectItem>
                        <SelectItem value="Africa/Cairo">القاهرة (GMT+2)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button type="submit" disabled={isUpdating} className="w-full">
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 ml-2" />
                      حفظ التغييرات
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>التفضيلات</CardTitle>
              <CardDescription>
                تخصيص تجربة استخدام التطبيق
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* المظهر */}
              <div className="space-y-2">
                <Label>المظهر</Label>
                <Select 
                  value={userProfile.preferences.theme} 
                  onValueChange={(value) => handlePreferenceChange('theme', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">فاتح</SelectItem>
                    <SelectItem value="dark">داكن</SelectItem>
                    <SelectItem value="system">حسب النظام</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* اللغة */}
              <div className="space-y-2">
                <Label>اللغة</Label>
                <Select 
                  value={userProfile.preferences.language} 
                  onValueChange={(value) => handlePreferenceChange('language', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* إعدادات الإشعارات */}
              <div className="space-y-4">
                <Label className="text-base font-medium">الإشعارات</Label>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">إشعارات البريد الإلكتروني</p>
                      <p className="text-sm text-muted-foreground">استقبال إشعارات عبر البريد الإلكتروني</p>
                    </div>
                    <Switch
                      checked={userProfile.preferences.notifications.email}
                      onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">إشعارات التطبيق</p>
                      <p className="text-sm text-muted-foreground">استقبال إشعارات فورية في التطبيق</p>
                    </div>
                    <Switch
                      checked={userProfile.preferences.notifications.push}
                      onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">إشعارات الرسائل النصية</p>
                      <p className="text-sm text-muted-foreground">استقبال إشعارات عبر الرسائل النصية</p>
                    </div>
                    <Switch
                      checked={userProfile.preferences.notifications.sms}
                      onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>الأمان</CardTitle>
              <CardDescription>
                إدارة إعدادات الأمان وكلمة المرور
              </CardDescription>
            </CardContent>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">تغيير كلمة المرور</h3>
                  <Button variant="outline">
                    تغيير كلمة المرور
                  </Button>
                </div>

                <div>
                  <h3 className="font-medium mb-2">المصادقة الثنائية</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    تأمين إضافي لحسابك باستخدام المصادقة الثنائية
                  </p>
                  <Button variant="outline">
                    تفعيل المصادقة الثنائية
                  </Button>
                </div>

                <div>
                  <h3 className="font-medium mb-2">الجلسات النشطة</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    عرض وإدارة الأجهزة المتصلة بحسابك
                  </p>
                  <Button variant="outline">
                    إدارة الجلسات
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
