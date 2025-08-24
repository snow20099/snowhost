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
  preferences: {
    theme: string;
    language: string;
    notifications: boolean;
    autoUpdate: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
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
  { code: "+1", name: "الولايات المتحدة", flag: "🇺🇸" },
  { code: "+44", name: "المملكة المتحدة", flag: "🇬🇧" },
  { code: "+33", name: "فرنسا", flag: "🇫🇷" },
  { code: "+49", name: "ألمانيا", flag: "🇩🇪" },
];

export default function SettingsPage() {
  // استخدام الجلسة لتحديث بيانات المستخدم في الرأس
  const { data: session, update: updateSession } = useSession();
  
  // حالة بيانات المستخدم
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // حالة التحميل
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<string>("/placeholder-user.jpg");
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("+966");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // جلب بيانات المستخدم عند تحميل المكون
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // حفظ البيانات في localStorage عند التغيير
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
      localStorage.setItem('profileImage', profileImage);
      localStorage.setItem('selectedCountryCode', selectedCountryCode);
      localStorage.setItem('phoneNumber', phoneNumber);
    }
  }, [userProfile, profileImage, selectedCountryCode, phoneNumber]);

  // دالة لجلب بيانات المستخدم من API
  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      
      // محاولة جلب البيانات المحفوظة محلياً أولاً
      const savedProfile = localStorage.getItem('userProfile');
      const savedImage = localStorage.getItem('profileImage');
      const savedCountryCode = localStorage.getItem('selectedCountryCode');
      const savedPhone = localStorage.getItem('phoneNumber');
      
      if (savedProfile && savedImage && savedCountryCode && savedPhone) {
        setUserProfile(JSON.parse(savedProfile));
        setProfileImage(savedImage);
        setSelectedCountryCode(savedCountryCode);
        setPhoneNumber(savedPhone);
        setIsLoading(false);
        return;
      }
      
      // إذا لم توجد بيانات محفوظة، جلبها من API
      const response = await fetch('/api/user/profile');
      
      if (!response.ok) {
        throw new Error('فشل في جلب بيانات المستخدم');
      }
      
      const userData = await response.json();
      setUserProfile(userData);
      
      // إذا كان هناك رقم هاتف، فصل الرمز الدولي عن الرقم
      if (userData.phone) {
        const phoneParts = userData.phone.split(' ');
        if (phoneParts.length > 1) {
          setSelectedCountryCode(phoneParts[0]);
          setPhoneNumber(phoneParts.slice(1).join(' '));
        } else {
          setPhoneNumber(userData.phone);
        }
      }
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
        }),
      });
      
      if (!response.ok) {
        throw new Error('فشل في تحديث البيانات');
      }
      
      const updatedUser = await response.json();
      setUserProfile(updatedUser);
      
      // تحديث جلسة next-auth لتعكس التغييرات في الرأس
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          name: updatedUser.name,
          image: profileImage !== "/placeholder-user.jpg" ? profileImage : session?.user?.image
        }
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
      
      // إظهار رسالة نجاح واضحة
      toast.success("تم حفظ الإعدادات بنجاح", {
        description: "تم تحديث تفضيلاتك بنجاح",
        duration: 3000,
        position: "top-center"
      });
    } catch (error) {
      console.error("Update error:", error);
      toast.error("فشل في حفظ الإعدادات", {
        description: "يرجى المحاولة مرة أخرى",
        duration: 3000,
        position: "top-center"
      });
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
        if (e.target?.result) {
          const newImage = e.target.result as string;
          setProfileImage(newImage);
          
          // تحديث الجلسة فوراً عند تغيير الصورة
          updateSession({
            ...session,
            user: {
              ...session?.user,
              image: newImage
            }
          });
          
          toast.success("تم تحميل الصورة بنجاح", {
            description: "لا تنس حفظ التغييرات",
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

  // معالج تغيير بيانات المستخدم
  const handleProfileChange = (field: keyof UserProfile, value: any) => {
    if (userProfile) {
      const updatedUser = {
        ...userProfile,
        [field]: value
      };
      
      setUserProfile(updatedUser);
      
      // إذا تم تغيير الاسم، قم بتحديث الجلسة أيضاً
      if (field === 'name') {
        updateSession({
          ...session,
          user: {
            ...session?.user,
            name: value
          }
        });
      }
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
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            الملف الشخصي
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            الإعدادات
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
                      onClick={() => {
                        setProfileImage("/placeholder-user.jpg");
                        updateSession({
                          ...session,
                          user: {
                            ...session?.user,
                            image: null
                          }
                        });
                      }}
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
      </Tabs>
    </div>
  )
}
