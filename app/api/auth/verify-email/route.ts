import { NextResponse } from "next/server";
import { verifyEmailToken } from "@/lib/email";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    
    if (!token) {
      return NextResponse.json({ 
        error: "التوكن مطلوب" 
      }, { status: 400 });
    }
    
    // Verify email token
    const verification = await verifyEmailToken(token);
    
    if (!verification.success) {
      return NextResponse.json({ 
        error: verification.error || "فشل في التحقق من البريد الإلكتروني" 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      message: "تم التحقق من البريد الإلكتروني بنجاح! تم إنشاء حساب Pterodactyl تلقائياً. يمكنك الآن تسجيل الدخول.",
      userId: verification.userId
    });
    
  } catch (error) {
    console.error('Error in verify email API:', error);
    return NextResponse.json({ 
      error: "خطأ في الخادم" 
    }, { status: 500 });
  }
} 