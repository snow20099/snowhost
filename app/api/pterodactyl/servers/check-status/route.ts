import { NextRequest, NextResponse } from "next/server"

const PTERODACTYL_URL = process.env.PTERODACTYL_URL || ""
const PTERODACTYL_API_KEY = process.env.PTERODACTYL_API_KEY || ""

// GET: Check server status in Pterodactyl
export async function GET(req: NextRequest) {
  try {
    const serverId = req.nextUrl.searchParams.get('serverId')
    
    if (!serverId) {
      return NextResponse.json({ 
        error: "معرف الخادم مطلوب" 
      }, { status: 400 })
    }

    console.log(`🔍 Checking status of server: ${serverId}`)

    // Check server status in Pterodactyl
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 seconds timeout

    const response = await fetch(`${PTERODACTYL_URL}/api/application/servers/${serverId}`, {
      headers: {
        'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
        'Accept': 'application/json'
      },
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ Failed to check server ${serverId} status:`, response.status, errorText)
      return NextResponse.json({ 
        error: `فشل في فحص حالة الخادم: ${response.status}`,
        details: errorText
      }, { status: response.status })
    }

    const serverData = await response.json()
    const status = serverData.attributes?.current_status || 'unknown'
    
    console.log(`✅ Server ${serverId} status: ${status}`)

    return NextResponse.json({
      success: true,
      serverId: serverId,
      status: status,
      suspended: status === 'suspended',
      running: status === 'running',
      stopped: status === 'stopped',
      installing: status === 'installing'
    })

  } catch (error: any) {
    console.error("❌ Error checking server status:", error)
    
    if (error.name === 'AbortError') {
      return NextResponse.json({ 
        error: "timeout - الخادم بطيء في الرد",
        details: "Pterodactyl Panel يستغرق وقت طويل للرد"
      }, { status: 408 })
    }
    
    return NextResponse.json({ 
      error: "خطأ في فحص حالة الخادم",
      details: process.env.NODE_ENV === 'development' ? error.message : 'خطأ غير معروف'
    }, { status: 500 })
  }
} 