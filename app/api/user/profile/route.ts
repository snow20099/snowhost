import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()
    const user = await User.findOne({ email: session.user.email }).select('-password')
    
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

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    await connectToDatabase()
    
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        $set: {
          name: body.name,
          phone: body.phone,
          country: body.country,
          timezone: body.timezone,
          'preferences.theme': body.theme,
          'preferences.language': body.language,
          updatedAt: new Date()
        }
      },
      { new: true }
    ).select('-password')

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Update Profile Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 