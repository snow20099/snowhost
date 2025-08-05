import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const email = url.searchParams.get("email");

  if (!code || !email) {
    return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
  }

  await connectToDatabase();

  const user = await User.findOne({ email, verificationCode: code });
  if (!user) {
    return NextResponse.json({ success: false, message: "Invalid verification code or email" }, { status: 400 });
  }

  user.emailVerified = true;
  user.verificationCode = null;
  await user.save();

  return NextResponse.json({ success: true, message: "Email verified successfully" });
}
