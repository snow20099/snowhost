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
      currency: user?.currency || "USD",
      lastUpdated: new Date().toISOString()
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

    const { amount, paymentMethod, transactionId } = await request.json()
    
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // التحقق من صحة المعاملة بناءً على طريقة الدفع
    if (!transactionId) {
      return NextResponse.json({ error: "Transaction ID required" }, { status: 400 })
    }

    await connectToDatabase()
    
    // التحقق من عدم استخدام نفس معرف المعاملة مسبقاً
    const existingTransaction = await User.findOne({
      'transactions.transactionId': transactionId
    })

    if (existingTransaction) {
      return NextResponse.json({ error: "Transaction already processed" }, { status: 400 })
    }

    // إضافة الرصيد والمعاملة
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        $inc: { balance: amount },
        $push: {
          transactions: {
            id: `TXN-${Date.now()}`,
            transactionId: transactionId,
            amount: amount,
            type: "deposit",
            method: paymentMethod,
            status: "completed",
            reason: "Balance Top-up",
            date: new Date()
          }
        }
      },
      { new: true }
    )

    return NextResponse.json({
      success: true,
      newBalance: updatedUser.balance,
      message: `Successfully added $${amount} to your balance via ${paymentMethod}`
    })
  } catch (error) {
    console.error("Add Balance Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
