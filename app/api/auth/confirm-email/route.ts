import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export default async function confirmEmailHandler(req: NextApiRequest, res: NextApiResponse) {
  const { code, email } = req.query;
  if (!code || !email) return res.status(400).json({ success: false, message: "Invalid request" });

  await connectToDatabase();

  const user = await User.findOne({ email, verificationCode: code });
  if (!user) return res.status(400).json({ success: false, message: "Invalid code or email" });

  user.emailVerified = true;
  user.verificationCode = null;
  await user.save();

  res.json({ success: true });
}
