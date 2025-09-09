import { NextRequest, NextResponse } from "next/server"

const PTERODACTYL_URL = process.env.PTERODACTYL_URL || ""
const PTERODACTYL_API_KEY = process.env.PTERODACTYL_API_KEY || ""

// POST: Unsuspend a server in Pterodactyl
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { serverId } = body
    
    if (!serverId) {
      return NextResponse.json({ 
        error: "معرف الخادم مطلوب" 
      }, { status: 400 })
    }

    console.log(`🔄 Attempting to unsuspend server: ${serverId}`)

    // Unsuspend server in Pterodactyl
    const response = await fetch(`${PTERODACTYL_URL}/api/application/servers/${serverId}/unsuspend`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ Failed to unsuspend server ${serverId}:`, response.status, errorText)
      return NextResponse.json({ 
        error: `فشل في إعادة تشغيل الخادم: ${response.status}`,
        details: errorText
      }, { status: response.status })
    }

    console.log(`✅ Server ${serverId} unsuspended successfully`)

    return NextResponse.json({
      success: true,
      message: `تم إعادة تشغيل الخادم ${serverId} بنجاح`,
      serverId: serverId
    })

  } catch (error) {
    console.error("❌ Error unsuspending server:", error)
    return NextResponse.json({ 
      error: "خطأ في إعادة تشغيل الخادم",
      details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'خطأ غير معروف' : undefined
    }, { status: 500 })
  }
} 