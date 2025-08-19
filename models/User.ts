import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Account Information
  balance: { type: Number, default: 0 },
  currency: { type: String, default: "USD" },
  accountType: { type: String, default: "user", enum: ["user", "admin", "moderator"] },
  isActive: { type: Boolean, default: true },
  
  // Profile Information
  phone: { type: String },
  country: { type: String },
  timezone: { type: String },
  
  // Services & Servers
  servers: [{ 
    id: String,
    name: String,
    type: String, // vps, vds, gaming, web
    status: String, // active, suspended, terminated
    ip: String,
    location: String,
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Resource Usage
  resourceUsage: {
    cpu: { type: Number, default: 0 }, // CPU usage percentage
    memory: { type: Number, default: 0 }, // Memory usage percentage
    storage: { type: Number, default: 0 }, // Storage usage percentage
    network: { type: Number, default: 0 }, // Network usage percentage
    totalStorage: { type: Number, default: 500 }, // Total storage in GB
    totalMemory: { type: Number, default: 16 }, // Total memory in GB
    totalNetwork: { type: Number, default: 1000 }, // Total network in GB
    lastUpdated: { type: Date, default: Date.now }
  },
  
  // Payment Transactions (NEW - Added for real payment integration)
  transactions: [{
    id: { type: String, required: true }, // TXN-timestamp format
    transactionId: { type: String, required: true, unique: true }, // External transaction ID (PayPal, Stripe, etc.)
    amount: { type: Number, required: true },
    type: { type: String, required: true, enum: ['deposit', 'withdrawal'] },
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
    reason: { type: String, required: true }, // Payment description
    
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
      cryptoCurrency: String, // BTC, ETH, USDT
      cryptoAmount: Number,
      cryptoTxHash: String, // Blockchain transaction hash
      
      // For Egyptian Wallets
      egyptianProvider: String, // vodafone, orange, etisalat, we
      egyptianPhone: String,
      egyptianReference: String,
      amountEGP: Number,
      
      // Common fields
      exchangeRate: Number, // For currency conversion
      fees: Number, // Transaction fees
      netAmount: Number // Amount after fees
    },
    
    // Metadata
    ipAddress: String,
    userAgent: String,
    location: String,
    
    date: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }],
  
  // Billing Information (Updated - Enhanced invoice structure)
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
    description: String, // Additional invoice description
    
    // Payment Information
    paidAmount: { type: Number, default: 0 },
    paidDate: Date,
    paymentMethod: String,
    transactionId: String, // Link to transaction
    
    // Due dates
    dueDate: Date,
    
    // Invoice items breakdown
    items: [{
      name: String,
      description: String,
      quantity: { type: Number, default: 1 },
      unitPrice: Number,
      total: Number
    }],
    
    // Tax and fees
    subtotal: Number,
    tax: { type: Number, default: 0 },
    fees: { type: Number, default: 0 },
    total: Number,
    
    date: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }],
  
  // Payment Methods (NEW - Store user's saved payment methods)
  savedPaymentMethods: [{
    id: String,
    type: { 
      type: String, 
      enum: ['paypal', 'stripe_card', 'crypto_wallet', 'egyptian_wallet'] 
    },
    isDefault: { type: Boolean, default: false },
    
    // Method specific data
    details: {
      // For PayPal
      paypalEmail: String,
      
      // For Stripe (don't store sensitive card data - use tokens)
      stripeCustomerId: String,
      stripePaymentMethodId: String,
      cardLast4: String,
      cardBrand: String, // visa, mastercard
      cardExpMonth: Number,
      cardExpYear: Number,
      
      // For Crypto
      walletAddress: String,
      currency: String, // BTC, ETH, USDT
      
      // For Egyptian Wallets
      provider: String, // vodafone, orange, etc.
      phoneNumber: String
    },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }],
  
  // Wallet Statistics (NEW - Track payment history)
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
  
  // Security & Verification (NEW)
  verification: {
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    isKYCVerified: { type: Boolean, default: false }, // Know Your Customer
    kycLevel: { type: Number, default: 0, enum: [0, 1, 2, 3] }, // Verification levels
    
    // 2FA
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: String,
    backupCodes: [String],
    
    // Login security
    loginAttempts: { type: Number, default: 0 },
    lockUntil: Date,
    
    lastLogin: Date,
    loginHistory: [{
      ip: String,
      userAgent: String,
      location: String,
      success: Boolean,
      date: { type: Date, default: Date.now }
    }]
  },
  
  // Settings (Enhanced)
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
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ 'transactions.transactionId': 1 });
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
  if (this.verification.lockUntil && this.verification.lockUntil > new Date()) return 'locked';
  return 'active';
});

export default models.User || model("User", UserSchema);
