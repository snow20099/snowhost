import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

export default async function signupHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { name, email, password } = req.body;
  if (!email || !password || !name)
    return res.status(400).json({ message: "Missing required fields" });

  await connectToDatabase();

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "Email already registered" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationCode = crypto.randomBytes(3).toString("hex"); // 6 chars code

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    emailVerified: false,
    verificationCode,
  });

  await newUser.save();

  // إعداد nodemailer مع متغيرات البيئة
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const verifyLink = `${process.env.NEXTAUTH_URL}/verify-email?code=${verificationCode}&email=${email}`;

  try {
    await transporter.sendMail({
      from: `"SnowHost Panel" <${process.env.MAIL_FROM}>`,
      to: email,
      subject: "تأكيد البريد الإلكتروني",
      html: `
        <p>مرحباً ${name},</p>
        <p>اضغط على الرابط التالي لتأكيد بريدك الإلكتروني:</p>
        <a href="${verifyLink}">${verifyLink}</a>
        <p>شكراً لاستخدامك SnowHost Panel.</p>
      `,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to send verification email", error });
  }

  res.status(201).json({ message: "User created, verification email sent" });
}
