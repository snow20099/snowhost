import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    console.log('🧪 Testing MongoDB connection...');
    
    // Test database connection
    await connectToDatabase();
    console.log('✅ Database connected successfully');
    
    // Test User model
    console.log('🔍 Testing User model...');
    const userCount = await User.countDocuments();
    console.log(`✅ User model working, total users: ${userCount}`);
    
    // Test creating a test user
    console.log('🆕 Testing user creation...');
    const testUser = await User.create({
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpass',
      balance: 0,
      currency: 'USD',
      accountType: 'user',
      isActive: true,
      servers: [],
      resourceUsage: {
        cpu: 0,
        memory: 0,
        storage: 0,
        network: 0,
        totalStorage: 500,
        totalMemory: 16,
        totalNetwork: 1000,
        lastUpdated: new Date()
      },
      walletStats: {
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
        lastMonthReset: new Date(),
        lastUpdated: new Date()
      },
      verification: {
        isEmailVerified: false,
        isPhoneVerified: false,
        isKYCVerified: false,
        kycLevel: 0,
        twoFactorEnabled: false,
        backupCodes: [],
        loginAttempts: 0,
        loginHistory: []
      },
      preferences: {
        theme: 'dark',
        language: 'en',
        currency: 'USD',
        profileVisibility: 'private',
        showBalance: false,
        notifications: {
          email: true,
          sms: false,
          push: true,
          payment: true,
          security: true
        }
      },
      transactions: [],
      invoices: [],
      savedPaymentMethods: []
    });
    
    console.log('✅ Test user created successfully:', testUser._id);
    
    // Clean up test user
    await User.deleteOne({ _id: testUser._id });
    console.log('✅ Test user cleaned up');
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB test completed successfully',
      userCount,
      testUserCreated: true
    });
    
  } catch (error) {
    console.error('❌ MongoDB test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 