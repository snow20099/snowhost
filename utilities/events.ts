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
