import nodemailer from 'nodemailer';
import crypto from 'crypto';

// SMTP Configuration
const smtpConfig = {
  host: process.env.SMTP_HOST || 'smtp.zoho.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'info@snowhost.cloud',
    pass: process.env.SMTP_PASS || 'EkaBJ9LCCvZ2',
  },
};

// Create transporter
const transporter = nodemailer.createTransport(smtpConfig);

// Generate verification token
export const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Generate reset password token
export const generateResetPasswordToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Send verification email
export const sendVerificationEmail = async (
  email: string,
  name: string,
  token: string
): Promise<boolean> => {
  try {
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || ''}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'SnowHost'}" <${process.env.SMTP_FROM || 'info@snowhost.cloud'}>`,
      to: email,
      subject: 'تأكيد حسابك - SnowHost',
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>تأكيد حسابك - SnowHost</title>
          <style>
            body {
              font-family: 'Tajawal', Arial, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              margin: 0;
              padding: 20px;
              direction: rtl;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 15px;
              overflow: hidden;
              box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            }
            .header {
              background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: bold;
            }
            .content {
              padding: 40px 30px;
              text-align: center;
            }
            .welcome-text {
              font-size: 18px;
              color: #333;
              margin-bottom: 30px;
              line-height: 1.6;
            }
            .verification-button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              padding: 15px 40px;
              border-radius: 50px;
              font-size: 16px;
              font-weight: bold;
              margin: 20px 0;
              transition: all 0.3s ease;
            }
            .verification-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
            }
            .footer {
              background: #f8f9fa;
              padding: 20px;
              text-align: center;
              color: #666;
              font-size: 14px;
            }
            .note {
              background: #e3f2fd;
              border: 1px solid #2196f3;
              border-radius: 8px;
              padding: 15px;
              margin: 20px 0;
              color: #1976d2;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>❄️ SnowHost</h1>
              <p>مرحباً بك في عالم الاستضافة المتقدم</p>
            </div>
            
            <div class="content">
              <div class="welcome-text">
                مرحباً <strong>${name}</strong>! 
                <br><br>
                شكراً لك على التسجيل في SnowHost. لتأكيد حسابك والبدء في استخدام خدماتنا، يرجى النقر على الزر أدناه:
              </div>
              
              <a href="${verificationUrl}" class="verification-button">
                ✅ تأكيد حسابي
              </a>
              
              <div class="note">
                <strong>ملاحظة:</strong> إذا لم يعمل الزر، يمكنك نسخ الرابط التالي ولصقه في متصفحك:
                <br>
                <a href="${verificationUrl}" style="color: #1976d2; word-break: break-all;">${verificationUrl}</a>
              </div>
              
              <p style="color: #666; font-size: 14px;">
                هذا الرابط صالح لمدة 24 ساعة فقط. إذا انتهت صلاحيته، يمكنك طلب رابط جديد من صفحة تسجيل الدخول.
              </p>
            </div>
            
            <div class="footer">
              <p>© 2024 SnowHost. جميع الحقوق محفوظة.</p>
              <p>إذا لم تقم بالتسجيل، يمكنك تجاهل هذا البريد الإلكتروني.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

// Send reset password email
export const sendResetPasswordEmail = async (
  email: string,
  name: string,
  token: string
): Promise<boolean> => {
  try {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || ''}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'SnowHost'}" <${process.env.SMTP_FROM || 'info@snowhost.cloud'}>`,
      to: email,
      subject: 'إعادة تعيين كلمة المرور - SnowHost',
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>إعادة تعيين كلمة المرور - SnowHost</title>
          <style>
            body {
              font-family: 'Tajawal', Arial, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              margin: 0;
              padding: 20px;
              direction: rtl;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 15px;
              overflow: hidden;
              box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            }
            .header {
              background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: bold;
            }
            .content {
              padding: 40px 30px;
              text-align: center;
            }
            .welcome-text {
              font-size: 18px;
              color: #333;
              margin-bottom: 30px;
              line-height: 1.6;
            }
            .reset-button {
              display: inline-block;
              background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
              color: white;
              text-decoration: none;
              padding: 15px 40px;
              border-radius: 50px;
              font-size: 16px;
              font-weight: bold;
              margin: 20px 0;
              transition: all 0.3s ease;
            }
            .reset-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 5px 15px rgba(220, 53, 69, 0.4);
            }
            .footer {
              background: #f8f9fa;
              padding: 20px;
              text-align: center;
              color: #666;
              font-size: 14px;
            }
            .note {
              background: #fff3cd;
              border: 1px solid #ffc107;
              border-radius: 8px;
              padding: 15px;
              margin: 20px 0;
              color: #856404;
            }
            .warning {
              background: #f8d7da;
              border: 1px solid #f5c6cb;
              border-radius: 8px;
              padding: 15px;
              margin: 20px 0;
              color: #721c24;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 SnowHost</h1>
              <p>إعادة تعيين كلمة المرور</p>
            </div>
            
            <div class="content">
              <div class="welcome-text">
                مرحباً <strong>${name}</strong>! 🔐
                <br><br>
                لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك. إذا كنت أنت من طلب هذا، انقر على الزر أدناه:
              </div>
              
              <a href="${resetUrl}" class="reset-button">
                🔄 إعادة تعيين كلمة المرور
              </a>
              
              <div class="note">
                <strong>ملاحظة:</strong> إذا لم يعمل الزر، يمكنك نسخ الرابط التالي ولصقه في متصفحك:
                <br>
                <a href="${resetUrl}" style="color: #856404; word-break: break-all;">${resetUrl}</a>
              </div>
              
              <div class="warning">
                <strong>⚠️ تحذير:</strong> هذا الرابط صالح لمدة ساعة واحدة فقط. إذا انتهت صلاحيته، يمكنك طلب رابط جديد.
              </div>
              
              <p style="color: #666; font-size: 14px;">
                إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد الإلكتروني. كلمة المرور الحالية ستبقى كما هي.
              </p>
            </div>
            
            <div class="footer">
              <p>© 2024 SnowHost. جميع الحقوق محفوظة.</p>
              <p>إذا لم تقم بهذا الطلب، يرجى التواصل معنا فوراً.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending reset password email:', error);
    return false;
  }
};

// Verify email token
export const verifyEmailToken = async (token: string): Promise<{ success: boolean; userId?: string; error?: string }> => {
  try {
    const User = (await import('@/models/User')).default;
    const { connectToDatabase } = await import('@/lib/mongodb');
    
    await connectToDatabase();
    
    const user = await User.findOne({
      'verification.verificationToken': token,
      'verification.verificationTokenExpiry': { $gt: new Date() }
    });
    
    if (!user) {
      return { success: false, error: 'Token is invalid or expired' };
    }
    
    // Update user verification status
    user.verification.isEmailVerified = true;
    user.verification.verificationToken = undefined;
    user.verification.verificationTokenExpiry = undefined;
    
    await user.save();
    
    return { success: true, userId: user._id.toString() };
  } catch (error) {
    console.error('Error verifying email token:', error);
    return { success: false, error: 'Internal server error' };
  }
};

// Verify reset password token
export const verifyResetPasswordToken = async (token: string): Promise<{ success: boolean; userId?: string; error?: string }> => {
  try {
    const User = (await import('@/models/User')).default;
    const { connectToDatabase } = await import('@/lib/mongodb');
    
    await connectToDatabase();
    
    const user = await User.findOne({
      'verification.resetPasswordToken': token,
      'verification.resetPasswordTokenExpiry': { $gt: new Date() }
    });
    
    if (!user) {
      return { success: false, error: 'Token is invalid or expired' };
    }
    
    return { success: true, userId: user._id.toString() };
  } catch (error) {
    console.error('Error verifying reset password token:', error);
    return { success: false, error: 'Internal server error' };
  }
}; 