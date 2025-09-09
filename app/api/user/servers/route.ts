import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"

const secret = process.env.NEXTAUTH_SECRET || "fallback-secret-key-change-in-production"

// GET: Get user's servers from MongoDB
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret })
    
    if (!token?.email) {
      return NextResponse.json({ error: "غير مصرح - يرجى تسجيل الدخول مرة أخرى" }, { status: 401 })
    }

    console.log('🔄 Fetching servers from MongoDB for user:', token.email)

    // Connect to database
    await connectToDatabase()
    console.log('✅ Database connected successfully')
    
    // Find user and get their servers
    const user = await User.findOne({ email: token.email })
    
    if (!user) {
      console.log('❌ User not found:', token.email)
      return NextResponse.json({ 
        error: "لم يتم العثور على المستخدم" 
      }, { status: 404 })
    }

    console.log('✅ User found:', user.email)
    console.log('📊 User servers count:', user.servers?.length || 0)

    // Get servers from MongoDB
    const servers = user.servers || []
    
    // Format servers data for display
    const formattedServers = servers.map((server: any) => {
      // حساب تاريخ الانتهاء الصحيح
      const createdAt = new Date(server.createdAt)
      let expiresAt = new Date(server.expiresAt)
      
      // إذا لم يكن هناك تاريخ انتهاء، احسبه (30 يوم من تاريخ الإنشاء)
      if (!server.expiresAt || expiresAt <= createdAt) {
        expiresAt = new Date(createdAt.getTime() + (30 * 24 * 60 * 60 * 1000)) // 30 days
      }
      
      // حساب الأيام المتبقية
      const now = new Date()
      const timeRemaining = expiresAt.getTime() - now.getTime()
      const daysUntilExpiry = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24))
      const isExpired = daysUntilExpiry <= 0
      
      // تحديث حالة الخادم
      let status = server.status || 'active'
      if (isExpired) {
        status = 'expired'
      } else if (daysUntilExpiry <= 7) {
        status = 'expiring_soon'
      }
      
      return {
        id: server.id,
        name: server.name,
        plan: server.plan,
        price: server.price,
        specs: server.specs || {},
        status: status,
        createdAt: server.createdAt,
        updatedAt: server.updatedAt,
        expiresAt: expiresAt.toISOString(), // استخدام التاريخ المحسوب
        autoRenewal: server.autoRenewal || false,
        lastBillingDate: server.lastBillingDate || server.createdAt,
        nextBillingDate: server.nextBillingDate || expiresAt.toISOString(),
        isExpired: isExpired,
        daysUntilExpiry: daysUntilExpiry > 0 ? daysUntilExpiry : 0,
        pterodactylId: server.pterodactylId,
        // إضافة معلومات إضافية إذا كانت موجودة
        ip: server.ip || 'pending',
        location: server.location || 'auto',
        port: server.port || 25565
      }
    })

    console.log('📋 Formatted servers:', formattedServers.length)

    return NextResponse.json({
      success: true,
      servers: formattedServers,
      total: formattedServers.length,
      user: {
        email: user.email,
        name: user.name,
        username: user.username
      }
    })

  } catch (error) {
    console.error("❌ Error fetching servers from MongoDB:", error)
    return NextResponse.json({ 
      error: "فشل في جلب الخوادم من قاعدة البيانات",
      details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'خطأ غير معروف' : undefined
    }, { status: 500 })
  }
} 