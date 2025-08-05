import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  await connectToDatabase();

  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  // توليد كود تحقق عشوائي (مثلاً)
  const verificationCode = Math.random().toString(36).substring(2, 15);

  const hashedPassword = await bcrypt.hash(password, 10);

  // إنشاء المستخدم مع إضافة حقل التحقق
  await User.create({
    name,
    email,
    password: hashedPassword,
    verificationCode,
    emailVerified: false,
  });

  // إعداد nodemailer مع بيانات SMTP من env
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // رابط التفعيل
  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?code=${verificationCode}&email=${email}`;

  // محتوى الإيميل
  const mailOptions = {
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
    to: email,
    subject: "تفعيل حسابك في SnowHost",
    html: `
      <p>مرحبًا ${name},</p>
      <p>شكراً لتسجيلك في SnowHost. يرجى الضغط على الرابط التالي لتفعيل حسابك:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>إذا لم تطلب هذا، تجاهل هذه الرسالة.</p>
    `,
  };

  // إرسال الإيميل (حاول وبعطيك رد حسب النتيجة)
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: "تم إنشاء حسابك بنجاح! تم إرسال رسالة التفعيل إلى بريدك الإلكتروني. يرجى التحقق منه قبل تسجيل الدخول." });
}
