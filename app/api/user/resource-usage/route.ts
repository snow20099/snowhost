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
    const user = await User.findOne({ email: session.user.email })
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      resourceUsage: user.resourceUsage || {
        cpu: 0,
        memory: 0,
        storage: 0,
        network: 0,
        totalStorage: 500,
        totalMemory: 16,
        totalNetwork: 1000,
        lastUpdated: new Date()
      }
    })
  } catch (error) {
    console.error("Resource Usage API Error:", error)
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
          'resourceUsage.cpu': body.cpu || 0,
          'resourceUsage.memory': body.memory || 0,
          'resourceUsage.storage': body.storage || 0,
          'resourceUsage.network': body.network || 0,
          'resourceUsage.totalStorage': body.totalStorage || 500,
          'resourceUsage.totalMemory': body.totalMemory || 16,
          'resourceUsage.totalNetwork': body.totalNetwork || 1000,
          'resourceUsage.lastUpdated': new Date(),
          updatedAt: new Date()
        }
      },
      { new: true }
    )

    return NextResponse.json({
      resourceUsage: updatedUser.resourceUsage
    })
  } catch (error) {
    console.error("Update Resource Usage Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 