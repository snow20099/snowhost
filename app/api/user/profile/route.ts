import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"

const secret = process.env.NEXTAUTH_SECRET!

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret })

    if (!token?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()
    const user = await User.findOne({ email: token.email }).select("-password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
      balance: user.balance,
      currency: user.currency,
      accountType: user.accountType,
      servers: user.servers || [],
      invoices: user.invoices || [],
      resourceUsage: user.resourceUsage || {
        cpu: 0,
        memory: 0,
        storage: 0,
        network: 0,
        totalStorage: 500,
        totalMemory: 16,
        totalNetwork: 1000,
        lastUpdated: new Date()
      },
      preferences: user.preferences,
      createdAt: user.createdAt
    })
  } catch (error) {
    console.error("Profile API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
