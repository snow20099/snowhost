import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"

const secret = process.env.NEXTAUTH_SECRET || "fallback-secret-key-change-in-production"

// GET: Check server dates in MongoDB
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret })
    
    if (!token?.email) {
      return NextResponse.json({ error: "غير مصرح - يرجى تسجيل الدخول مرة أخرى" }, { status: 401 })
    }

    const serverId = req.nextUrl.searchParams.get('serverId')
    
    if (!serverId) {
      return NextResponse.json({ 
        error: "معرف الخادم مطلوب" 
      }, { status: 400 })
    }

    console.log(`🔍 Checking dates for server: ${serverId}`)

    // Connect to database
    await connectToDatabase()
    
    // Find user and server
    const user = await User.findOne({ 
      email: token.email,
      'servers.id': serverId
    })
    
    if (!user) {
      return NextResponse.json({ 
        error: "لم يتم العثور على المستخدم أو الخادم" 
      }, { status: 404 })
    }

    const server = user.servers.find((s: any) => s.id === serverId)
    if (!server) {
      return NextResponse.json({ 
        error: "لم يتم العثور على الخادم" 
      }, { status: 404 })
    }

    // Calculate dates
    const now = new Date()
    const createdAt = new Date(server.createdAt)
    const expiresAt = new Date(server.expiresAt)
    const lastBillingDate = new Date(server.lastBillingDate)
    const nextBillingDate = new Date(server.nextBillingDate)
    
    const timeRemaining = expiresAt.getTime() - now.getTime()
    const daysUntilExpiry = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24))
    const isExpired = daysUntilExpiry <= 0

    console.log(`📊 Server dates check for ${serverId}:`, {
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      lastBillingDate: lastBillingDate.toISOString(),
      nextBillingDate: nextBillingDate.toISOString(),
      daysUntilExpiry,
      isExpired
    })

    return NextResponse.json({
      success: true,
      server: {
        id: serverId,
        name: server.name,
        dates: {
          createdAt: createdAt.toISOString(),
          expiresAt: expiresAt.toISOString(),
          lastBillingDate: lastBillingDate.toISOString(),
          nextBillingDate: nextBillingDate.toISOString(),
          daysUntilExpiry,
          isExpired
        },
        status: server.status,
        autoRenewal: server.autoRenewal
      }
    })

  } catch (error) {
    console.error("❌ Error checking server dates:", error)
    return NextResponse.json({ 
      error: "خطأ في فحص تواريخ الخادم",
      details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'خطأ غير معروف' : undefined
    }, { status: 500 })
  }
} 