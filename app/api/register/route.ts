import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

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
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // توليد كود تحقق عشوائي (20 بايت hex)
  const verificationCode = randomBytes(20).toString("hex");

  // إنشاء المستخدم مع الكود الجديد وحفظه
  await User.create({ name, email, password: hashedPassword, verificationCode });

  // ترجع في الرد الكود عشان يستخدمه الفرانت اند
  return NextResponse.json({ ok: true, verificationCode, email });
}
