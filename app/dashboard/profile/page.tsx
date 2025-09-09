"use client"

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, Shield, Edit, Save, X, Snowflake, CreditCard, Wallet, ArrowRight } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'pterodactyl'>('profile');
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    country: "",
    timezone: ""
  });
  const [pterodactylData, setPterodactylData] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setProfileData({
        name: session.user.name || "",
        email: session.user.email || "",
        username: session.user.email?.split('@')[0] || "",
        phone: "",
        country: "المملكة العربية السعودية",
        timezone: "Asia/Riyadh"
      });
      
      // Fetch Pterodactyl data
      fetchPterodactylData();
    }
  }, [session]);

  const fetchPterodactylData = async () => {
    try {
      const response = await fetch('/api/user/dashboard');
      if (response.ok) {
        const data = await response.json();
        setPterodactylData(data.pterodactylAccount);
      }
    } catch (error) {
      console.error('Error fetching Pterodactyl data:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Here you would typically update the user profile in your database
      // For now, we'll just simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم تحديث ملفك الشخصي",
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحديث الملف الشخصي",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData({
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      username: session?.user?.email?.split('@')[0] || "",
      phone: "",
      country: "المملكة العربية السعودية",
      timezone: "Asia/Riyadh"
    });
    setIsEditing(false);
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">الملف الشخصي</h1>
          <p className="text-sky-200">إدارة معلومات حسابك الشخصي</p>
        </div>
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <Button
                onClick={handleSave}
                disabled={loading}
                className="bg-sky-600 hover:bg-sky-700 text-white"
              >
                {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="border-sky-400/50 text-sky-200 hover:bg-sky-600/20 hover:text-white"
              >
                إلغاء
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-sky-600 hover:bg-sky-700 text-white"
            >
              <Edit className="h-4 w-4 mr-2" />
              تعديل
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-sky-800/30 p-1 rounded-lg border border-sky-400/30">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === 'profile'
              ? 'bg-sky-600 text-white shadow-lg'
              : 'text-sky-300 hover:text-white hover:bg-sky-700/50'
          }`}
        >
          <User className="h-4 w-4 inline mr-2" />
          المعلومات الشخصية
        </button>
        <button
          onClick={() => setActiveTab('pterodactyl')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === 'pterodactyl'
              ? 'bg-sky-600 text-white shadow-lg'
              : 'text-sky-300 hover:text-white hover:bg-sky-700/50'
          }`}
        >
          <Snowflake className="h-4 w-4 inline mr-2" />
          بيانات Pterodactyl
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <Card className="border-sky-400/30 bg-sky-800/50 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-sky-300" />
                  المعلومات الشخصية
                </CardTitle>
                <CardDescription className="text-sky-200">
                  تحديث معلوماتك الشخصية وإعدادات الحساب
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">الاسم الكامل</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      disabled={!isEditing}
                      className="bg-sky-800/30 border-sky-400/50 text-white placeholder-sky-300 focus:border-sky-400 focus:ring-sky-400 disabled:opacity-50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-white">اسم المستخدم</Label>
                    <Input
                      id="username"
                      value={profileData.username}
                      onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                      disabled={!isEditing}
                      className="bg-sky-800/30 border-sky-400/50 text-white placeholder-sky-300 focus:border-sky-400 focus:ring-sky-400 disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      value={profileData.email}
                      disabled
                      className="bg-sky-800/30 border-sky-400/50 text-sky-300 opacity-50"
                    />
                    <p className="text-xs text-sky-400">البريد الإلكتروني لا يمكن تغييره</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      disabled={!isEditing}
                      placeholder="+966 50 123 4567"
                      className="bg-sky-800/30 border-sky-400/50 text-white placeholder-sky-300 focus:border-sky-400 focus:ring-sky-400 disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-white">البلد</Label>
                    <Input
                      id="country"
                      value={profileData.country}
                      onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                      disabled={!isEditing}
                      className="bg-sky-800/30 border-sky-400/50 text-white placeholder-sky-300 focus:border-sky-400 focus:ring-sky-400 disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-white">المنطقة الزمنية</Label>
                    <Input
                      id="timezone"
                      value={profileData.timezone}
                      onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
                      disabled={!isEditing}
                      className="bg-sky-800/30 border-sky-400/50 text-white placeholder-sky-300 focus:border-sky-400 focus:ring-sky-400 disabled:opacity-50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Info */}
          <div className="space-y-6">
            {/* Account Status */}
            <Card className="border-sky-400/30 bg-sky-800/50 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-sky-300" />
                  حالة الحساب
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sky-200">البريد الإلكتروني</span>
                  <Badge className="bg-green-600 text-white">مؤكد</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sky-200">نوع الحساب</span>
                  <Badge className="bg-sky-600 text-white">عادي</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sky-200">تاريخ التسجيل</span>
                  <span className="text-sky-100 text-sm">2024</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-sky-400/30 bg-sky-800/50 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white">إجراءات سريعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full border-sky-400/50 text-sky-200 hover:bg-sky-600/20 hover:text-white"
                  onClick={() => window.open('/dashboard/billing', '_blank')}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  عرض الفواتير
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-sky-400/50 text-sky-200 hover:bg-sky-600/20 hover:text-white"
                  onClick={() => window.open('/dashboard/wallet', '_blank')}
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  إدارة المحفظة
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Pterodactyl Tab Content */}
      {activeTab === 'pterodactyl' && (
        <div className="space-y-6">
          {pterodactylData ? (
            <Card className="border-sky-400/30 bg-sky-800/50 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Snowflake className="h-5 w-5 text-sky-300" />
                  بيانات حساب Pterodactyl
                </CardTitle>
                <CardDescription className="text-sky-200">
                  معلومات حسابك في نظام إدارة الخوادم
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white font-medium">اسم المستخدم:</Label>
                    <div className="mt-1 p-3 bg-sky-800/30 rounded-lg border border-sky-400/50">
                      <span className="text-white font-mono">
                        {pterodactylData.username}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-white font-medium">البريد الإلكتروني:</Label>
                    <div className="mt-1 p-3 bg-sky-800/30 rounded-lg border border-sky-400/50">
                      <span className="text-white">
                        {pterodactylData.email}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-white font-medium">كلمة المرور:</Label>
                    <div className="mt-1 p-3 bg-sky-800/30 rounded-lg border border-sky-400/50">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-mono">
                          {showPassword ? pterodactylData.password : '••••••••••••'}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowPassword(!showPassword)}
                          className="h-8 px-3 text-xs border-sky-400/50 text-sky-200 hover:bg-sky-600/20 hover:text-white"
                        >
                          {showPassword ? 'إخفاء' : 'عرض كلمة المرور'}
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-sky-400 mt-1">
                      احتفظ بكلمة المرور في مكان آمن - يمكنك تغييرها لاحقاً من لوحة تحكم Pterodactyl
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-white font-medium">رابط لوحة التحكم:</Label>
                    <div className="mt-1 p-3 bg-sky-800/30 rounded-lg border border-sky-400/50">
                      <a 
                        href={pterodactylData.panelUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sky-300 hover:text-sky-100 underline"
                      >
                        {pterodactylData.panelUrl}
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => window.open(pterodactylData.panelUrl, '_blank')}
                    className="bg-sky-600 hover:bg-sky-700 text-white"
                  >
                    فتح لوحة التحكم
                    <ArrowRight className="h-4 w-4 mr-2" />
                  </Button>
                  
                  <Button
                    onClick={() => {
                      if (pterodactylData.password) {
                        navigator.clipboard.writeText(pterodactylData.password);
                        toast({
                          title: "تم نسخ كلمة المرور",
                          description: "تم نسخ كلمة المرور إلى الحافظة",
                        });
                      }
                    }}
                    variant="outline"
                    className="border-sky-400/50 text-sky-200 hover:bg-sky-600/20 hover:text-white"
                  >
                    نسخ كلمة المرور
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-sky-400/30 bg-sky-800/50 backdrop-blur-sm shadow-2xl">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-sky-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Snowflake className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  لا يوجد حساب Pterodactyl
                </h3>
                <p className="text-sky-200 mb-4">
                  يبدو أنه لم يتم إنشاء حساب Pterodactyl بعد. يرجى الانتظار أو التواصل مع الدعم الفني.
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-sky-600 hover:bg-sky-700 text-white"
                >
                  تحديث الصفحة
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Profile Information */}
    </div>
  );
} 