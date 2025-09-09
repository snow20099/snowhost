import mongoose, { Schema, models, model } from "mongoose"

// Force fresh model compilation - username field must be included
const UserSchema = new Schema({
  // Basic Information
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true, sparse: true }, // Pterodactyl username
  email: { type: String, required: true, unique: true },
  password: { 
    type: String, 
    required: function(this: any) {
      // Password is only required for credentials provider, not for OAuth
      return this.authProvider === 'credentials';
    },
    default: '' // Default empty string for OAuth users
  },
  originalPassword: { 
    type: String, 
    required: false, // Not required, only for credentials users
    default: '' // Default empty string
  },
  
  // Account Details
  accountType: { 
    type: String, 
    enum: ["user", "admin", "moderator"], 
    default: "user" 
  },
  authProvider: { 
    type: String, 
    enum: ["credentials", "google", "discord"], 
    default: "credentials" 
  },
  isActive: { type: Boolean, default: true },
  
  // Financial Information
  balance: { type: Number, default: 0 },
  currency: { type: String, default: "USD" },
  
  // Servers (Basic)
  servers: [{ 
    id: { type: String, required: true },
    name: { type: String, required: true },
    plan: { type: String, required: true },
    pterodactylId: { type: Number },
    price: { type: Number, required: true },
    specs: {
      ram: { type: Number },
      disk: { type: Number },
      cpu: { type: Number }
    },
    status: { type: String, default: 'active' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    // حقول جديدة للتاريخ والتجديد
    expiresAt: { type: Date, required: true }, // تاريخ انتهاء الصلاحية
    autoRenewal: { type: Boolean, default: false }, // تجديد تلقائي
    lastBillingDate: { type: Date, default: Date.now }, // آخر تاريخ فواتير
    nextBillingDate: { type: Date, default: Date.now }, // تاريخ الفواتير القادمة
    isExpired: { type: Boolean, default: false }, // هل انتهت الصلاحية
    daysUntilExpiry: { type: Number, default: 0 } // الأيام المتبقية
  }],
  
  // Resource Usage
  resourceUsage: {
    cpu: { type: Number, default: 0 },
    memory: { type: Number, default: 0 },
    storage: { type: Number, default: 0 },
    network: { type: Number, default: 0 },
    totalStorage: { type: Number, default: 500 },
    totalMemory: { type: Number, default: 16 },
    totalNetwork: { type: Number, default: 1000 },
    lastUpdated: { type: Date, default: Date.now }
  },
  
  // Payment Transactions
  transactions: [{
    id: { type: String, required: true },
    transactionId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    type: { 
      type: String, 
      required: true, 
      enum: ['deposit', 'withdrawal'] 
    },
    method: { 
      type: String, 
      required: true,
      enum: ['PayPal', 'Stripe', 'Cryptocurrency', 'Egyptian Wallet', 'Bank Transfer', 'Manual']
    },
    status: { 
      type: String, 
      required: true, 
      enum: ['pending', 'completed', 'failed', 'cancelled', 'refunded'],
      default: 'pending'
    },
    reason: { type: String, required: true },
    date: { type: Date, default: Date.now },
    
    // Payment Method Specific Details
    paymentDetails: {
      // For PayPal
      paypalOrderId: String,
      paypalCaptureId: String,
      
      // For Stripe
      stripeSessionId: String,
      stripePaymentIntentId: String,
      
      // For Crypto
      cryptoAddress: String,
      cryptoCurrency: String,
      cryptoAmount: Number,
      cryptoTxHash: String,
      
      // For Egyptian Wallets
      egyptianProvider: String,
      egyptianPhone: String,
      egyptianReference: String,
      amountEGP: Number,
      
      // Common fields
      exchangeRate: Number,
      fees: Number,
      netAmount: Number
    },
    
    // Additional fields
    notes: String,
    tags: [String],
    
    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }],
  
  // Saved Payment Methods
  savedPaymentMethods: [{
    id: { type: String, required: true },
    type: { type: String, required: true, enum: ['card', 'bank', 'paypal'] },
    name: String,
    last4: String,
    brand: String,
    expiryMonth: Number,
    expiryYear: Number,
    isDefault: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Billing Information
  invoices: [{
    id: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { 
      type: String, 
      required: true, 
      enum: ["paid", "pending", "overdue", "cancelled", "refunded"],
      default: "pending"
    },
    service: { type: String, required: true },
    description: String,
    
    // Payment Information
    paidAmount: { type: Number, default: 0 },
    paidDate: Date,
    paymentMethod: String,
    transactionId: String,
    
    // Due dates
    dueDate: Date,
    
    // Billing details
    billingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
  
    // Service details
    serviceDetails: {
      plan: String,
      duration: String,
      startDate: Date,
      endDate: Date,
      autoRenew: { type: Boolean, default: false }
    },
    
    // Additional fields
    notes: String,
    tags: [String],
    
    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }],
  
  // Wallet Statistics
  walletStats: {
    totalDeposits: { type: Number, default: 0 },
    totalWithdrawals: { type: Number, default: 0 },
    totalTransactions: { type: Number, default: 0 },
    
    // By payment method
    paypalTotal: { type: Number, default: 0 },
    stripeTotal: { type: Number, default: 0 },
    cryptoTotal: { type: Number, default: 0 },
    egyptianWalletTotal: { type: Number, default: 0 },
    
    // Monthly stats
    currentMonthDeposits: { type: Number, default: 0 },
    currentMonthWithdrawals: { type: Number, default: 0 },
    lastMonthReset: { type: Date, default: Date.now },
    
    // Limits
    dailyDepositLimit: { type: Number, default: 1000 },
    monthlyDepositLimit: { type: Number, default: 10000 },
    dailyWithdrawalLimit: { type: Number, default: 500 },
    
    lastUpdated: { type: Date, default: Date.now }
  },
  
  // Security & Verification
  verification: {
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    isKYCVerified: { type: Boolean, default: false },
    kycLevel: { type: Number, default: 0 },
    twoFactorEnabled: { type: Boolean, default: false },
    backupCodes: [String],
    loginAttempts: { type: Number, default: 0 },
    loginHistory: [{
      date: { type: Date, default: Date.now },
      ip: String,
      userAgent: String
    }],
    verificationToken: String,
    verificationTokenExpiry: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpiry: Date,
    lockUntil: Date,
    failedAttempts: { type: Number, default: 0 }
  },
  
  // Pterodactyl Account Information
  pterodactylAccount: {
    userId: Number,
    username: String,
    email: String,
    password: String,
    panelUrl: String,
    createdAt: { type: Date, default: Date.now },
    lastUsed: { type: Date, default: Date.now }
  },
  
  // Settings
  preferences: {
    theme: { type: String, default: "dark", enum: ["light", "dark", "auto"] },
    language: { type: String, default: "en" },
    notifications: { 
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true },
      payment: { type: Boolean, default: true },
      security: { type: Boolean, default: true }
    },
    currency: { type: String, default: "USD" },
    timezone: String,
    
    // Privacy settings
    profileVisibility: { type: String, default: "private", enum: ["public", "private"] },
    showBalance: { type: Boolean, default: false }
  }
  
  // Timestamps are handled by the schema options below
}, { timestamps: true });

// Indexes for better performance
UserSchema.index({ 'transactions.status': 1 });
UserSchema.index({ 'transactions.date': -1 });
UserSchema.index({ 'invoices.status': 1 });
UserSchema.index({ createdAt: -1 });

// Pre-save middleware to update timestamps
UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Methods to update wallet stats
UserSchema.methods.updateWalletStats = function() {
  // Ensure transactions array exists
  if (!this.transactions || !Array.isArray(this.transactions)) {
    this.transactions = [];
  }
  
  // Ensure walletStats exists
  if (!this.walletStats) {
    this.walletStats = {
      totalDeposits: 0,
      totalWithdrawals: 0,
      totalTransactions: 0,
      paypalTotal: 0,
      stripeTotal: 0,
      cryptoTotal: 0,
      egyptianWalletTotal: 0,
      currentMonthDeposits: 0,
      currentMonthWithdrawals: 0,
      dailyDepositLimit: 1000,
      monthlyDepositLimit: 10000,
      dailyWithdrawalLimit: 500,
      lastUpdated: new Date()
    };
  }
  
  const deposits = this.transactions.filter((tx: any) => tx.type === 'deposit' && tx.status === 'completed');
  const withdrawals = this.transactions.filter((tx: any) => tx.type === 'withdrawal' && tx.status === 'completed');
  
  this.walletStats.totalDeposits = deposits.reduce((sum: number, tx: any) => sum + tx.amount, 0);
  this.walletStats.totalWithdrawals = withdrawals.reduce((sum: number, tx: any) => sum + tx.amount, 0);
  this.walletStats.totalTransactions = this.transactions.filter((tx: any) => tx.status === 'completed').length;
  
  // Update by payment method
  this.walletStats.paypalTotal = deposits.filter((tx: any) => tx.method === 'PayPal').reduce((sum: number, tx: any) => sum + tx.amount, 0);
  this.walletStats.stripeTotal = deposits.filter((tx: any) => tx.method === 'Stripe').reduce((sum: number, tx: any) => sum + tx.amount, 0);
  this.walletStats.cryptoTotal = deposits.filter((tx: any) => tx.method === 'Cryptocurrency').reduce((sum: number, tx: any) => sum + tx.amount, 0);
  this.walletStats.egyptianWalletTotal = deposits.filter((tx: any) => tx.method === 'Egyptian Wallet').reduce((sum: number, tx: any) => sum + tx.amount, 0);
  
  this.walletStats.lastUpdated = new Date();
};

// Virtual for account status
UserSchema.virtual('accountStatus').get(function() {
  if (!this.isActive) return 'inactive';
  if (this.verification?.lockUntil && this.verification.lockUntil > new Date()) return 'locked';
  return 'active';
});

export default models.User || model("User", UserSchema);