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
    const user = await User.findOne({ email: session.user.email }).select('balance currency')
    
    return NextResponse.json({
      balance: user?.balance || 0,
      currency: user?.currency || "USD"
    })
  } catch (error) {
    console.error("Balance API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount, paymentMethod } = await request.json()
    
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    await connectToDatabase()
    
    // Add to user balance
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        $inc: { balance: amount },
        $push: {
          invoices: {
            id: `INV-${Date.now()}`,
            amount: amount,
            status: "paid",
            service: "Balance Top-up",
            date: new Date()
          }
        }
      },
      { new: true }
    )

    return NextResponse.json({
      success: true,
      newBalance: updatedUser.balance,
      message: `Successfully added $${amount} to your balance`
    })
  } catch (error) {
    console.error("Add Balance Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 