import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"

const secret = process.env.NEXTAUTH_SECRET || "fallback-secret-key-change-in-production"

// POST: Update server status in MongoDB
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret })
    
    if (!token?.email) {
      return NextResponse.json({ error: "غير مصرح - يرجى تسجيل الدخول مرة أخرى" }, { status: 401 })
    }

    const body = await req.json()
    const { serverId, status, isExpired, suspendedAt } = body
    
    if (!serverId || !status) {
      return NextResponse.json({ 
        error: "معرف الخادم والحالة مطلوبان" 
      }, { status: 400 })
    }

    console.log(`🔄 Updating server ${serverId} status to: ${status}`)

    // Connect to database
    await connectToDatabase()
    
    // Update server status
    const updateData: any = {
      'servers.$.status': status,
      'servers.$.updatedAt': new Date()
    }

    if (isExpired !== undefined) {
      updateData['servers.$.isExpired'] = isExpired
    }

    if (suspendedAt) {
      updateData['servers.$.suspendedAt'] = suspendedAt
    }

    const updatedUser = await User.findOneAndUpdate(
      { 
        email: token.email,
        'servers.id': serverId
      },
      { $set: updateData },
      { new: true }
    )

    if (!updatedUser) {
      return NextResponse.json({ 
        error: "لم يتم العثور على الخادم" 
      }, { status: 404 })
    }

    console.log(`✅ Server ${serverId} status updated successfully to: ${status}`)

    return NextResponse.json({
      success: true,
      message: `تم تحديث حالة الخادم إلى: ${status}`,
      serverId: serverId,
      newStatus: status
    })

  } catch (error) {
    console.error("❌ Error updating server status:", error)
    return NextResponse.json({ 
      error: "خطأ في تحديث حالة الخادم",
      details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'خطأ غير معروف' : undefined
    }, { status: 500 })
  }
} 