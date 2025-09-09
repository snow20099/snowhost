import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ 
        error: "معرف المستخدم مطلوب" 
      }, { status: 400 });
    }
    
    await connectToDatabase();
    
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ 
        error: "المستخدم غير موجود" 
      }, { status: 404 });
    }
    
    return NextResponse.json({
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      originalPassword: user.originalPassword, // Add original password for Pterodactyl
      balance: user.balance || 0,
      currency: user.currency || 'USD',
      authProvider: user.authProvider || 'credentials',
      isEmailVerified: user.verification?.isEmailVerified || false,
      pterodactylAccount: user.pterodactylAccount || null,
      servers: user.servers || [],
      resourceUsage: user.resourceUsage || {
        cpu: 0,
        memory: 0,
        storage: 0,
        network: 0,
        totalStorage: 500,
        totalMemory: 16,
        totalNetwork: 1000,
        lastUpdated: new Date()
      }
    });
    
  } catch (error) {
    console.error('Error in user profile API:', error);
    return NextResponse.json({ 
      error: "خطأ في الخادم" 
    }, { status: 500 });
  }
}
