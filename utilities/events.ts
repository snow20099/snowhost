import mongoose, { Schema, Document } from 'mongoose';

// تعريف واجهة المستخدم
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  country?: string;
  timezone?: string;
  profileImage?: string;
  balance: number;
  currency: string;
  accountType: 'free' | 'premium' | 'enterprise';
  servers: string[];
  invoices: string[];
  resourceUsage: {
    cpu: number;
    memory: number;
    storage: number;
    network: number;
    totalStorage: number;
    totalMemory: number;
    totalNetwork: number;
    lastUpdated: Date;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
  emailVerified?: Date;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}

// إنشاء المخطط
const UserSchema: Schema<IUser> = new Schema({
  name: {
    type: String,
    required: [true, 'الاسم مطلوب'],
    trim: true,
    maxlength: [50, 'الاسم يجب أن يكون أقل من 50 حرف']
  },
  email: {
    type: String,
    required: [true, 'البريد الإلكتروني مطلوب'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'كلمة المرور مطلوبة']
  },
  phone: {
    type: String,
    trim: true,
    sparse: true
  },
  country: {
    type: String,
    trim: true,
    maxlength: [2, 'رمز الدولة يجب أن يكون حرفين']
  },
  timezone: {
    type: String,
    trim: true
  },
  profileImage: {
    type: String,
    default: "/placeholder-user.jpg"
  },
  balance: {
    type: Number,
    default: 0,
    min: [0, 'الرصيد لا يمكن أن يكون سالب']
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'IQD', 'SAR', 'AED']
  },
  accountType: {
    type: String,
    enum: ['free', 'premium', 'enterprise'],
    default: 'free'
  },
  servers: [{
    type: Schema.Types.ObjectId,
    ref: 'Server'
  }],
  invoices: [{
    type: Schema.Types.ObjectId,
    ref: 'Invoice'
  }],
  resourceUsage: {
    cpu: { type: Number, default: 0, min: 0, max: 100 },
    memory: { type: Number, default: 0, min: 0 },
    storage: { type: Number, default: 0, min: 0 },
    network: { type: Number, default: 0, min: 0 },
    totalStorage: { type: Number, default: 500 },
    totalMemory: { type: Number, default: 16 },
    totalNetwork: { type: Number, default: 1000 },
    lastUpdated: { type: Date, default: Date.now }
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    language: {
      type: String,
      default: 'ar',
      enum: ['ar', 'en']
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    }
  },
  emailVerified: Date,
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// إنشاء فهارس للبحث السريع
UserSchema.index({ email: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ 'preferences.language': 1 });

// تطبيق التحقق من صحة البريد الإلكتروني
UserSchema.path('email').validate(function(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}, 'البريد الإلكتروني غير صالح');

// دالة تنظيف قبل الحفظ
UserSchema.pre('save', function(next) {
  // تنظيف رقم الهاتف
  if (this.phone) {
    this.phone = this.phone.trim();
  }
  
  // تأكيد أن الصورة الشخصية لها قيمة افتراضية
  if (!this.profileImage) {
    this.profileImage = "/placeholder-user.jpg";
  }
  
  next();
});

// دالة للحصول على الاسم المختصر للأفاتار
UserSchema.virtual('avatarInitials').get(function() {
  return this.name
    .split(' ')
    .map((name: string) => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

// دالة للحصول على استخدام التخزين كنسبة مئوية
UserSchema.virtual('storagePercentage').get(function() {
  return Math.round((this.resourceUsage.storage / this.resourceUsage.totalStorage) * 100);
});

// دالة للحصول على استخدام الذاكرة كنسبة مئوية
UserSchema.virtual('memoryPercentage').get(function() {
  return Math.round((this.resourceUsage.memory / this.resourceUsage.totalMemory) * 100);
});

// دالة لإخفاء البيانات الحساسة عند التحويل إلى JSON
UserSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.emailVerificationToken;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  return userObject;
};

// تصدير النموذج
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
