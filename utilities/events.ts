// الحل البديل الأبسط: استخدام Custom Events

// 1. إنشاء ملف utilities/events.ts
export const PROFILE_UPDATED_EVENT = 'profileUpdated';

export const emitProfileUpdate = (data: { name?: string; image?: string }) => {
  window.dispatchEvent(new CustomEvent(PROFILE_UPDATED_EVENT, { detail: data }));
};

export const listenToProfileUpdates = (callback: (data: { name?: string; image?: string }) => void) => {
  const handler = (event: CustomEvent) => {
    callback(event.detail);
  };
  
  window.addEventListener(PROFILE_UPDATED_EVENT, handler as EventListener);
  
  return () => {
    window.removeEventListener(PROFILE_UPDATED_EVENT, handler as EventListener);
  };
};

// 2. تحديث مكون الهيدر
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { listenToProfileUpdates } from "@/utilities/events";

export default function Header() {
  const { data: session, update: updateSession } = useSession();
  const [currentProfileImage, setCurrentProfileImage] = useState<string>("");

  useEffect(() => {
    // تحميل الصورة المحفوظة عند البداية
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage && savedImage !== "/placeholder-user.jpg") {
      setCurrentProfileImage(savedImage);
    }

    // الاستماع لتحديثات الملف الشخصي
    const unsubscribe = listenToProfileUpdates(async (data) => {
      if (data.image) {
        setCurrentProfileImage(data.image);
      }
      
      if (data.name || data.image) {
        // تحديث الجلسة
        await updateSession({
          ...session,
          user: {
            ...session?.user,
            name: data.name || session?.user?.name,
            image: data.image || session?.user?.image
          }
        });
      }
    });

    return unsubscribe;
  }, [session, updateSession]);

  return (
    <div>
      {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage 
                  src={currentProfileImage || session?.user?.image || undefined} 
                  alt={session?.user?.name || session?.user?.email || "User"} 
                />
                <AvatarFallback>{session?.user?.name?.[0] || session?.user?.email?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">{session?.user?.name || session?.user?.email}</span>
                <ChevronDown className="h-4 w-4" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="flex w-full">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile" className="flex w-full">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="flex w-full">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/billing" className="flex w-full">Billing</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        // باقي الكود للمستخدم غير المسجل
        <div>Login/Register buttons</div>
      )}
    </div>
  );
}

// 3. تحديث صفحة الإعدادات
import { emitProfileUpdate } from "@/utilities/events";

// في SettingsPage.tsx - تحديث معالج تحميل الصورة
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
        localStorage.setItem('profileImage', newImage);
        
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

// تحديث معالج تحديث الملف الشخصي
const handleProfileUpdate = async (e: FormEvent) => {
  e.preventDefault();
  
  if (!userProfile) return;
  
  setIsUpdating(true);
  
  try {
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
    
    // إرسال إشعار بتحديث الاسم
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

// تحديث معالج إعادة تعيين الصورة
<Button 
  type="button" 
  variant="outline" 
  className="flex items-center gap-2"
  onClick={() => {
    setProfileImage("/placeholder-user.jpg");
    localStorage.setItem('profileImage', "/placeholder-user.jpg");
    emitProfileUpdate({ image: "/placeholder-user.jpg" });
  }}
>
  <RotateCcw className="w-4 h-4" />
  إعادة تعيين
</Button>
