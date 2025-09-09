// الحل الأول: استخدام Custom Hook لمشاركة حالة الملف الشخصي

// 1. إنشاء Context لمشاركة بيانات المستخدم
// contexts/UserProfileContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

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

interface UserProfileContextType {
  userProfile: UserProfile | null;
  profileImage: string;
  updateUserProfile: (profile: UserProfile) => void;
  updateProfileImage: (image: string) => void;
}

const UserProfileContext = createContext<UserProfileContextType | null>(null);

export const UserProfileProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, update: updateSession } = useSession();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileImage, setProfileImage] = useState<string>("/placeholder-user.jpg");

  // تحميل البيانات عند التهيئة
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    const savedImage = localStorage.getItem('profileImage');
    
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const updateUserProfile = async (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('userProfile', JSON.stringify(profile));
    
    // تحديث الجلسة
    await updateSession({
      ...session,
      user: {
        ...session?.user,
        name: profile.name,
        image: profileImage !== "/placeholder-user.jpg" ? profileImage : session?.user?.image
      }
    });
  };

  const updateProfileImage = async (image: string) => {
    setProfileImage(image);
    localStorage.setItem('profileImage', image);
    
    // تحديث الجلسة
    await updateSession({
      ...session,
      user: {
        ...session?.user,
        image: image
      }
    });
  };

  return (
    <UserProfileContext.Provider value={{
      userProfile,
      profileImage,
      updateUserProfile,
      updateProfileImage
    }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within UserProfileProvider');
  }
  return context;
};

// 2. تحديث مكون الهيدر
// Header.tsx
import { useSession } from "next-auth/react";
import { useUserProfile } from "@/contexts/UserProfileContext";

export default function Header() {
  const { data: session } = useSession();
  const { profileImage } = useUserProfile();

  return (
    <div>
      {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage 
                  src={profileImage !== "/placeholder-user.jpg" ? profileImage : session?.user?.image || undefined} 
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

// 3. تحديث صفحة الإعدادات لاستخدام الـ Context
// في SettingsPage.tsx - استبدل الكود الموجود

import { useUserProfile } from "@/contexts/UserProfileContext";

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();
  const { userProfile, profileImage, updateUserProfile, updateProfileImage } = useUserProfile();
  
  // باقي الكود...

  // تحديث معالج تحديث الصورة
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) {
        toast.error("حجم الملف كبير جداً. الحد الأقصى هو 800KB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          const newImage = e.target.result as string;
          await updateProfileImage(newImage);
          
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

  // تحديث معالج حفظ الملف الشخصي
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
      
      // استخدام الدالة الجديدة لتحديث الملف الشخصي
      await updateUserProfile(updatedUser);
      
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

  // باقي الكود يبقى كما هو...
}

// 4. إضافة الـ Provider في _app.tsx أو layout.tsx
import { UserProfileProvider } from "@/contexts/UserProfileContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <UserProfileProvider>
        <Component {...pageProps} />
      </UserProfileProvider>
    </SessionProvider>
  );
}
