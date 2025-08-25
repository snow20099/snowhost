import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
const secret = process.env.NEXTAUTH_SECRET!
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret })
    if (!token?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    await connectToDatabase()
    const user = await User.findOne({ email: token.email }).select('-password')
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
      balance: user.balance,
      currency: user.currency,
      accountType: user.accountType,
      servers: user.servers || [],
      invoices: user.invoices || [],
      resourceUsage: user.resourceUsage || {
        cpu: 0,
        memory: 0,
        storage: 0,
        network: 0,
        totalStorage: 500,
        totalMemory: 16,
        totalNetwork: 1000,
        lastUpdated: new Date()
      },
      preferences: user.preferences,
      createdAt: user.createdAt
    })
  } catch (error) {
    console.error("Profile API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req, secret })
    if (!token?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const body = await req.json()
    await connectToDatabase()
    const updatedUser = await User.findOneAndUpdate(
      { email: token.email },
      {
        $set: {
          name: body.name,
          phone: body.phone,
          country: body.country,
          timezone: body.timezone,
          'preferences.theme': body.theme,
          'preferences.language': body.language,
          updatedAt: new Date()
        }
      },
      { new: true }
    ).select('-password')
    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Update Profile Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
utilities/events.ts
// نظام إدارة الأحداث العامة للتطبيق
type EventCallback = (data: any) => void;
// تخزين المستمعين للأحداث
const eventListeners: { [eventName: string]: EventCallback[] } = {};
/**
 * إضافة مستمع لحدث معين
 */
export const addEventListener = (eventName: string, callback: EventCallback): void => {
  if (!eventListeners[eventName]) {
    eventListeners[eventName] = [];
  }
  eventListeners[eventName].push(callback);
};
/**
 * إزالة مستمع من حدث معين
 */
export const removeEventListener = (eventName: string, callback: EventCallback): void => {
  if (eventListeners[eventName]) {
    eventListeners[eventName] = eventListeners[eventName].filter(cb => cb !== callback);
  }
};
/**
 * إرسال حدث إلى جميع المستمعين
 */
export const emitEvent = (eventName: string, data?: any): void => {
  if (eventListeners[eventName]) {
    eventListeners[eventName].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`خطأ في معالج الحدث ${eventName}:`, error);
      }
    });
  }
};
// دوال مخصصة لتحديث الملف الشخصي
export const emitProfileUpdate = (profileData: { 
  name?: string; 
  image?: string; 
  email?: string 
}): void => {
  emitEvent('profileUpdate', profileData);
};
export const listenToProfileUpdates = (callback: (profileData: any) => void): () => void => {
  addEventListener('profileUpdate', callback);
  
  // إرجاع دالة لإلغاء الاستماع
  return () => {
    removeEventListener('profileUpdate', callback);
  };
};
// دوال إضافية لأحداث أخرى يمكن استخدامها في المستقبل
export const emitUserLogin = (userData: any): void => {
  emitEvent('userLogin', userData);
};
export const emitUserLogout = (): void => {
  emitEvent('userLogout');
};
export const listenToUserEvents = (
  onLogin?: (userData: any) => void,
  onLogout?: () => void
): () => void => {
  const unsubscribers: (() => void)[] = [];
  
  if (onLogin) {
    addEventListener('userLogin', onLogin);
    unsubscribers.push(() => removeEventListener('userLogin', onLogin));
  }
  
  if (onLogout) {
    addEventListener('userLogout', onLogout);
    unsubscribers.push(() => removeEventListener('userLogout', onLogout));
  }
  
  // إرجاع دالة لإلغاء جميع المستمعين
  return () => {
    unsubscribers.forEach(unsubscribe => unsubscribe());
  };
};
// تصدير نوع البيانات للاستخدام في مكونات أخرى
export interface ProfileUpdateData {
  name?: string;
  image?: string;
  email?: string;
}
// دالة تنظيف عامة لإزالة جميع المستمعين
export const clearAllEventListeners = (): void => {
  Object.keys(eventListeners).forEach(eventName => {
    eventListeners[eventName] = [];
  });
};
