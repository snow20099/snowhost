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
      emitProfileUpdate({ 
        name: updatedUser.name,
        image: profileImage !== "/placeholder-user.jpg" ? profileImage : undefined
      });
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
      if (field === 'name') emitProfileUpdate({ name: value });
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
          {/* ... باقي كود الملف الشخصي ... */}
        </TabsContent>

        {/* تبويب التفضيلات */}
        <TabsContent value="preferences">
          {/* ... باقي كود التفضيلات ... */}
        </TabsContent>

        {/* تبويب الأمان */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>الأمان</CardTitle>
              <CardDescription>
                إدارة إعدادات الأمان وكلمة المرور
              </CardDescription>
            </CardHeader> {/* ← تم تصحيح الإغلاق هنا */}
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">تغيير كلمة المرور</h3>
                  <Button variant="outline">تغيير كلمة المرور</Button>
                </div>
                <div>
                  <h3 className="font-medium mb-2">المصادقة الثنائية</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    تأمين إضافي لحسابك باستخدام المصادقة الثنائية
                  </p>
                  <Button variant="outline">تفعيل المصادقة الثنائية</Button>
                </div>
                <div>
                  <h3 className="font-medium mb-2">الجلسات النشطة</h3>
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
