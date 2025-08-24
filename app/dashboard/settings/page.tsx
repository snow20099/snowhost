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
import { emitProfileUpdate } from "@/utilities/events"  // ← تأكد من وجود هذا الاستيراد

// استبدل معالج تحميل الصورة الحالي بهذا:
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

// استبدل معالج تحديث الملف الشخصي الحالي بهذا:
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

// استبدل زر إعادة تعيين الصورة بهذا:
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

// استبدل معالج تغيير بيانات المستخدم بهذا:
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

