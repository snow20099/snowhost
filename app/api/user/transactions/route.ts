import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"

const secret = process.env.NEXTAUTH_SECRET || "fallback-secret-key-change-in-production"

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret })
    
    if (!token?.email) {
      return NextResponse.json({ error: "غير مصرح - يرجى تسجيل الدخول مرة أخرى" }, { status: 401 })
    }

    await connectToDatabase()

    const user = await User.findOne({ email: token.email }).select('transactions')
    
    if (!user) {
      return NextResponse.json({ error: "لم يتم العثور على المستخدم" }, { status: 404 })
    }

    // ترتيب المعاملات حسب التاريخ (الأحدث أولاً)
    const sortedTransactions = (user.transactions || []).sort((a: any, b: any) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

    return NextResponse.json({
      success: true,
      transactions: sortedTransactions,
      total: sortedTransactions.length
    })
  } catch (error) {
    console.error("Transactions API Error:", error)
    return NextResponse.json({ 
      error: "خطأ في الخادم", 
      details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'خطأ غير معروف' : undefined
    }, { status: 500 })
  }
} 