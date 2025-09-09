import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

const secret = process.env.NEXTAUTH_SECRET || "fallback-secret-key-change-in-production";

export async function GET(req: NextRequest) {
  try {
    // Check if NEXTAUTH_SECRET is set
    if (!process.env.NEXTAUTH_SECRET) {
      console.warn("Warning: NEXTAUTH_SECRET environment variable is not set");
    }

    const token = await getToken({ req, secret });
    console.log("Token received:", token ? "Valid token" : "No token");
    
    if (!token?.email) {
      console.log("Authentication failed: No email in token");
      return NextResponse.json({ error: "Unauthorized - Please log in again" }, { status: 401 });
    }
    
    console.log("Connecting to database...");
    await connectToDatabase();
    console.log("Database connected successfully");
    
    console.log("Looking for user with email:", token.email);
    const user = await User.findOne({ email: token.email }).select('-password');
    
    if (!user) {
      console.log("User not found in database");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    console.log("User found, returning data");
    
    // Log user data for debugging
    console.log("User data:", {
      id: user._id,
      name: user.name,
      email: user.email,
      balance: user.balance,
      currency: user.currency,
      authProvider: user.authProvider,
      invoicesCount: user.invoices?.length || 0,
      serversCount: user.servers?.length || 0
    });
    
    const responseData = {
      id: user._id,
      name: user.name,
      email: user.email,
      balance: user.balance || 0,
      currency: user.currency || 'USD',
      authProvider: user.authProvider || 'credentials',
      accountType: user.accountType || 'user',
      servers: user.servers || [],
      pterodactylAccount: user.pterodactylAccount || null,
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
      preferences: user.preferences || {
        theme: 'dark',
        language: 'en',
        currency: 'USD',
        profileVisibility: 'private',
        showBalance: false
      },
      createdAt: user.createdAt
    };
    
    console.log("Response data:", responseData);
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ 
      error: "Internal server error", 
      details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
    }, { status: 500 });
  }
} 