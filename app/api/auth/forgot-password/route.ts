import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { generateResetPasswordToken, sendResetPasswordEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json({ error: "البريد الإلكتروني مطلوب" }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({ 
        message: "إذا كان البريد الإلكتروني مسجل لدينا، سيتم إرسال رابط إعادة تعيين كلمة المرور" 
      });
    }
    
    // Generate reset token
    const resetToken = generateResetPasswordToken();
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    
    // Update user with reset token
    user.verification.resetPasswordToken = resetToken;
    user.verification.resetPasswordTokenExpiry = resetTokenExpiry;
    await user.save();
    
    // Send reset password email
    const emailSent = await sendResetPasswordEmail(email, user.name, resetToken);
    
    if (emailSent) {
      return NextResponse.json({ 
        message: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني" 
      });
    } else {
      return NextResponse.json({ 
        error: "فشل في إرسال البريد الإلكتروني. يرجى المحاولة مرة أخرى" 
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Error in forgot password API:', error);
    return NextResponse.json({ 
      error: "خطأ في الخادم" 
    }, { status: 500 });
  }
} 