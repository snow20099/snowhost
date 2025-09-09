import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { verifyResetPasswordToken } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();
    
    if (!token || !newPassword) {
      return NextResponse.json({ 
        error: "التوكن وكلمة المرور الجديدة مطلوبان" 
      }, { status: 400 });
    }
    
    if (newPassword.length < 6) {
      return NextResponse.json({ 
        error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" 
      }, { status: 400 });
    }
    
    // Verify token
    const tokenVerification = await verifyResetPasswordToken(token);
    
    if (!tokenVerification.success) {
      return NextResponse.json({ 
        error: "التوكن غير صالح أو منتهي الصلاحية" 
      }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Find user and update password
    const user = await User.findById(tokenVerification.userId);
    if (!user) {
      return NextResponse.json({ 
        error: "المستخدم غير موجود" 
      }, { status: 404 });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password and clear reset token
    user.password = hashedPassword;
    user.originalPassword = newPassword; // Save original password for Pterodactyl
    user.verification.resetPasswordToken = undefined;
    user.verification.resetPasswordTokenExpiry = undefined;
    
    await user.save();
    
    // Update Pterodactyl password if user has account
    if (user.pterodactylAccount?.userId) {
      try {
        console.log('🔄 Updating Pterodactyl password for user:', {
          email: user.email,
          pterodactylUserId: user.pterodactylAccount.userId,
          pterodactylUsername: user.pterodactylAccount.username
        });
        
        const pterodactylResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/pterodactyl/users/${user.pterodactylAccount.userId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password: newPassword
          }),
        });
        
        console.log('🔄 Pterodactyl API response status:', pterodactylResponse.status);
        
        if (pterodactylResponse.ok) {
          console.log('✅ Pterodactyl password updated successfully');
          
          // Update local Pterodactyl account info
          user.pterodactylAccount.password = newPassword;
          await user.save();
          console.log('✅ Local Pterodactyl password updated in MongoDB');
        } else {
          const errorText = await pterodactylResponse.text();
          console.error('❌ Failed to update Pterodactyl password:', {
            status: pterodactylResponse.status,
            statusText: pterodactylResponse.statusText,
            errorText: errorText
          });
          
          // Try to parse error as JSON for better debugging
          try {
            const errorJson = JSON.parse(errorText);
            console.error('❌ Pterodactyl API error details:', errorJson);
          } catch (e) {
            console.error('❌ Could not parse error response as JSON');
          }
        }
      } catch (error) {
        console.error('❌ Error updating Pterodactyl password:', error);
      }
    } else {
      console.log('ℹ️ User does not have Pterodactyl account, skipping password update');
    }
    
    return NextResponse.json({ 
      message: "تم إعادة تعيين كلمة المرور بنجاح" 
    });
    
  } catch (error) {
    console.error('Error in reset password API:', error);
    return NextResponse.json({ 
      error: "خطأ في الخادم" 
    }, { status: 500 });
  }
} 