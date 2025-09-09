import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import DiscordProvider from "next-auth/providers/discord"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// Debug logging
console.log('🚀 NextAuth config loading...');
console.log('🔑 Environment variables check:', {
  GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
  NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
  MONGODB_URI: !!process.env.MONGODB_URI
});

// Function to create Pterodactyl account for OAuth users
async function createPterodactylAccountForOAuth(user: any) {
  try {
    console.log('🔄 Creating Pterodactyl account for OAuth user:', {
      email: user.email,
      username: user.username,
      name: user.name,
      authProvider: user.authProvider
    });
    
    // Generate a secure random password for OAuth users
    const generateSecurePassword = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
      let password = '';
      for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return password;
    };
    
    const securePassword = generateSecurePassword();
    console.log('🔐 Generated secure password for OAuth user');
    
    // Check if Pterodactyl API is available
    const pterodactylUrl = `${process.env.NEXT_PUBLIC_APP_URL || ''}/api/pterodactyl/users`;
    console.log('🔄 Calling Pterodactyl API:', pterodactylUrl);
    
    const requestBody = {
      username: user.username,
      email: user.email,
      first_name: user.name?.split(' ')[0] || user.username,
      last_name: user.name?.split(' ').slice(1).join(' ') || '',
      password: securePassword // Use generated secure password
    };
    
    console.log('🔄 Request body for Pterodactyl:', {
      ...requestBody,
      password: '***' // Hide password in logs
    });
    
    const pterodactylResponse = await fetch(pterodactylUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    console.log('🔄 Pterodactyl API response status:', pterodactylResponse.status);
    console.log('🔄 Pterodactyl API response headers:', Object.fromEntries(pterodactylResponse.headers.entries()));

    if (pterodactylResponse.ok) {
      const pterodactylData = await pterodactylResponse.json();
      console.log('✅ Pterodactyl account created successfully:', pterodactylData);
      
      // Update user in MongoDB with Pterodactyl account info and password
      const updateData = {
        'pterodactylAccount.userId': pterodactylData.attributes?.id,
        'pterodactylAccount.username': pterodactylData.attributes?.username,
        'pterodactylAccount.email': pterodactylData.attributes?.email,
        'pterodactylAccount.password': securePassword, // Save the generated password
        'pterodactylAccount.panelUrl': `${process.env.PTERODACTYL_URL || ''}/auth/login`,
        'pterodactylAccount.createdAt': new Date(),
        'pterodactylAccount.lastUsed': new Date()
      };
      
      console.log('🔄 Updating MongoDB with Pterodactyl data:', {
        ...updateData,
        'pterodactylAccount.password': '***' // Hide password in logs
      });
      
      await User.findByIdAndUpdate(user._id, updateData);
      
      console.log('✅ Pterodactyl account info saved to MongoDB');
      console.log('🔐 Password saved for OAuth user (can be changed later)');
    } else {
      const errorText = await pterodactylResponse.text();
      console.error('❌ Failed to create Pterodactyl account:', {
        status: pterodactylResponse.status,
        statusText: pterodactylResponse.statusText,
        errorText: errorText
      });
      
      // Try to parse error as JSON
      try {
        const errorJson = JSON.parse(errorText);
        console.error('❌ Pterodactyl API error details:', errorJson);
      } catch (e) {
        console.error('❌ Could not parse error response as JSON');
      }
    }
  } catch (error) {
    console.error('❌ Error creating Pterodactyl account:', {
      error: error,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    throw error;
  }
}

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      needsPterodactylSetup?: boolean;
    }
  }
}

// Check for required environment variables
const requiredEnvVars = {
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  MONGODB_URI: process.env.MONGODB_URI,
};

// Validate environment variables
for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    console.warn(`Warning: ${key} environment variable is not set. Authentication may not work properly.`);
  }
}

const handler = NextAuth({
  debug: true, // Enable debug mode
  providers: [
    // Only add providers if environment variables are set
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        profile(profile) {
          console.log('🔍 Google profile received:', profile);
          return {
            id: profile.sub,
            name: profile.name,
            email: profile.email,
            image: profile.picture,
          }
        }
      })
    ] : []),
    ...(process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET ? [
    DiscordProvider({
        clientId: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        authorization: {
          params: {
            scope: 'identify email'
          }
        },
        profile(profile) {
          console.log('🔍 Discord profile received:', {
            id: profile.id,
            username: profile.username,
            email: profile.email,
            avatar: profile.avatar,
            discriminator: profile.discriminator,
            global_name: profile.global_name,
            verified: profile.verified,
            flags: profile.flags
          });
          
          // Check if email is available
          if (!profile.email) {
            console.warn('⚠️ Discord profile missing email! This will prevent account creation.');
            console.warn('⚠️ Discord profile data:', profile);
          }
          
          return {
            id: profile.id,
            name: profile.global_name || profile.username,
            email: profile.email,
            image: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : null,
          }
        }
      })
    ] : []),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        try {
          await connectToDatabase();
          const user = await User.findOne({ email: credentials.email });
          
          if (user && await bcrypt.compare(credentials.password, user.password)) {
            return { 
              id: user._id.toString(), 
              name: user.name, 
              email: user.email,
              authProvider: 'credentials'
            };
          }
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log('🔄 Redirect callback:', { url, baseUrl });
      
      // If user is trying to go to login but they're already authenticated, redirect to dashboard
      if (url === baseUrl + '/login') {
        console.log('🔄 User trying to access login, redirecting to dashboard');
        return `${baseUrl}/dashboard`;
      }
      
      // For dashboard routes, allow access
      if (url === baseUrl + '/dashboard') {
        console.log('🔄 User going to dashboard, allowing access');
        return `${baseUrl}/dashboard`;
      }
      
      // For OAuth callback, redirect to dashboard
      if (url.includes('/api/auth/callback/')) {
        console.log('🔄 OAuth callback detected, redirecting to dashboard');
        return `${baseUrl}/dashboard`;
      }
      
      // Ensure redirect to dashboard for other routes
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    },
    async signIn({ user, account, profile }) {
      console.log('🔐 SignIn callback triggered:', {
        provider: account?.provider,
        userEmail: user?.email,
        userName: user?.name,
        accountType: account?.type,
        profile: profile ? 'Present' : 'Missing',
        accountDetails: account,
        userDetails: user
      });
      
      // If user signed in with OAuth (Google or Discord), save them to MongoDB
      if ((account?.provider === 'google' || account?.provider === 'discord') && user?.email) {
        console.log(`✅ ${account.provider.toUpperCase()} OAuth detected, proceeding to save user...`);
        console.log(`🔍 ${account.provider.toUpperCase()} user details:`, {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image
        });
        
        try {
          console.log('🔄 Attempting database connection...');
          await connectToDatabase();
          console.log('✅ Database connected successfully');
          
          // Check if user already exists
          console.log('🔍 Searching for existing user with email:', user.email);
          const existingUser = await User.findOne({ email: user.email });
          console.log('🔍 Existing user check result:', existingUser ? `Found: ${existingUser._id}` : 'Not found');
          
          if (!existingUser) {
            console.log('🆕 Creating new user in MongoDB...');
            console.log('🆕 User data to create:', {
              name: user.name || user.email.split('@')[0],
              username: user.email.split('@')[0],
              email: user.email,
              authProvider: account.provider
            });
            
            // Check if Pterodactyl account already exists for this email
            console.log('🔍 Checking if Pterodactyl account already exists...');
            try {
              const pterodactylCheckUrl = `${process.env.NEXT_PUBLIC_APP_URL || ''}/api/pterodactyl/users/check-email`;
              const checkResponse = await fetch(pterodactylCheckUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email })
              });
              
              if (checkResponse.ok) {
                const checkData = await checkResponse.json();
                console.log('🔍 Pterodactyl account check result:', checkData);
                
                if (checkData.exists) {
                  console.log('✅ Pterodactyl account already exists, linking to user');
                  
                  // Create user with existing Pterodactyl account
                  const newUser = await User.create({
                    name: user.name || user.email.split('@')[0],
                    username: user.email.split('@')[0],
                    email: user.email,
                    password: '',
                    authProvider: account.provider,
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
                      isEmailVerified: true,
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
                    savedPaymentMethods: [],
                    pterodactylAccount: {
                      userId: checkData.userId,
                      username: checkData.username,
                      email: checkData.email,
                      panelUrl: checkData.panelUrl,
                      createdAt: new Date(),
                      lastUsed: new Date()
                    }
                  });
                  
                  console.log(`✅ ${account.provider.toUpperCase()} user saved to MongoDB with existing Pterodactyl account:`, {
                    id: newUser._id,
                    email: newUser.email,
                    pterodactylUserId: newUser.pterodactylAccount?.userId
                  });
                  
                } else {
                  console.log('ℹ️ No existing Pterodactyl account found, user needs to setup manually');
                  
                  // Create user without Pterodactyl account
                  const newUser = await User.create({
                    name: user.name || user.email.split('@')[0],
                    username: user.email.split('@')[0],
                    email: user.email,
                    password: '',
                    authProvider: account.provider,
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
                      isEmailVerified: true,
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
                  
                  console.log(`✅ ${account.provider.toUpperCase()} user saved to MongoDB successfully:`, {
                    id: newUser._id,
                    email: newUser.email,
                    username: newUser.username,
                    name: newUser.name,
                    authProvider: newUser.authProvider
                  });
                }
              } else {
                console.log('⚠️ Could not check Pterodactyl account, creating user without account');
                
                // Create user without Pterodactyl account (fallback)
                const newUser = await User.create({
                  name: user.name || user.email.split('@')[0],
                  username: user.email.split('@')[0],
                  email: user.email,
                  password: '',
                  authProvider: account.provider,
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
                    isEmailVerified: true,
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
                
                console.log(`✅ ${account.provider.toUpperCase()} user saved to MongoDB successfully (fallback):`, {
                  id: newUser._id,
                  email: newUser.email,
                  username: newUser.username,
                  name: newUser.name,
                  authProvider: newUser.authProvider
                });
              }
            } catch (checkError) {
              console.error('❌ Error checking Pterodactyl account:', checkError);
              
              // Create user without Pterodactyl account (fallback)
              const newUser = await User.create({
                name: user.name || user.email.split('@')[0],
                username: user.email.split('@')[0],
                email: user.email,
                password: '',
                authProvider: account.provider,
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
                  isEmailVerified: true,
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
              
              console.log(`✅ ${account.provider.toUpperCase()} user saved to MongoDB successfully (fallback):`, {
                id: newUser._id,
                email: newUser.email,
                username: newUser.username,
                name: newUser.name,
                authProvider: newUser.authProvider
              });
            }
            
            // Verify the user was actually saved
            const verifyUser = await User.findOne({ email: user.email });
            console.log('🔍 Verification - User found after creation:', verifyUser ? 'YES' : 'NO');
            
            // For OAuth users, DON'T create Pterodactyl account automatically
            // They will be redirected to setup page to enter their own password
            console.log(`ℹ️ ${account.provider.toUpperCase()} user needs to setup Pterodactyl account manually`);
            
          } else {
            console.log(`✅ ${account.provider.toUpperCase()} user already exists in MongoDB:`, existingUser.email);
            console.log(`🔍 Existing user Pterodactyl status:`, {
              hasPterodactylAccount: !!existingUser.pterodactylAccount?.userId,
              pterodactylUserId: existingUser.pterodactylAccount?.userId,
              pterodactylUsername: existingUser.pterodactylAccount?.username
            });
            
            // Check if existing OAuth user needs Pterodactyl account
            if (!existingUser.pterodactylAccount?.userId) {
              console.log(`ℹ️ Existing ${account.provider} user needs to setup Pterodactyl account manually`);
            } else {
              console.log(`✅ User already has Pterodactyl account:`, existingUser.pterodactylAccount.userId);
            }
          }
          
          return true;
        } catch (error) {
          console.error(`❌ Error saving ${account.provider.toUpperCase()} user to MongoDB:`, error);
          console.error('❌ Error details:', {
            name: error instanceof Error ? error.name : 'Unknown',
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : 'No stack trace'
          });
          return true; // Still allow sign in even if saving fails
        }
      } else {
        console.log('⚠️ Not OAuth or missing user data:', {
          isOAuth: account?.provider === 'google' || account?.provider === 'discord',
          hasEmail: !!user?.email,
          accountProvider: account?.provider,
          userEmail: user?.email,
          accountDetails: account,
          userDetails: user
        });
        
        // If Discord user but no email, this is a problem
        if (account?.provider === 'discord' && !user?.email) {
          console.error('❌ Discord OAuth user missing email! This will prevent account creation.');
          console.error('❌ Discord user data:', user);
          console.error('❌ Discord account data:', account);
        }
      }
      
      return true;
    },
    async session({ session, token }) {
      console.log('🔑 Session callback triggered:', {
        sessionUser: session.user?.email,
        tokenId: token.id
      });
      
      if (token && session.user) {
        session.user.id = token.id as string;
        console.log('✅ User ID added to session:', session.user.id);
        
        // Check if user needs Pterodactyl account setup
        if (session.user.email) {
          try {
            await connectToDatabase();
            const user = await User.findOne({ email: session.user.email });
            console.log('🔍 User lookup for Pterodactyl check:', user ? 'Found' : 'Not found');
            
            if (user && !user.pterodactylAccount?.userId) {
              // User doesn't have Pterodactyl account, mark for setup
              (session.user as any).needsPterodactylSetup = true;
              console.log('⚠️ User needs Pterodactyl setup');
            } else if (user?.pterodactylAccount?.userId) {
              console.log('✅ User has Pterodactyl account:', user.pterodactylAccount.userId);
            }
          } catch (error) {
            console.error('❌ Error checking Pterodactyl account:', error);
          }
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      console.log('🎫 JWT callback triggered:', {
        hasUser: !!user,
        userId: user?.id,
        tokenId: token.id
      });
      
      if (user) {
        token.id = user.id;
        console.log('✅ User ID assigned to token:', token.id);
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key-change-in-production",
})

export { handler as GET, handler as POST } 

