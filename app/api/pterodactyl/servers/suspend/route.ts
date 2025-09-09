import { NextRequest, NextResponse } from "next/server"

const PTERODACTYL_URL = process.env.PTERODACTYL_URL || ""
const PTERODACTYL_API_KEY = process.env.PTERODACTYL_API_KEY || ""

// POST: Suspend a server in Pterodactyl
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { serverId } = body
    
    if (!serverId) {
      return NextResponse.json({ 
        error: "معرف الخادم مطلوب" 
      }, { status: 400 })
    }

    console.log(`🔄 Attempting to suspend server: ${serverId}`)

    // Retry logic with exponential backoff
    let lastError: any = null
    const maxRetries = 3
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt}/${maxRetries} to suspend server ${serverId}`)
        
        // Suspend server in Pterodactyl
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 seconds timeout

        const response = await fetch(`${PTERODACTYL_URL}/api/application/servers/${serverId}/suspend`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (response.ok) {
          console.log(`✅ Server ${serverId} suspended successfully on attempt ${attempt}`)
          return NextResponse.json({
            success: true,
            message: `تم إيقاف الخادم ${serverId} بنجاح`,
            serverId: serverId,
            attempts: attempt
          })
        } else {
          const errorText = await response.text()
          lastError = { status: response.status, error: errorText }
          console.warn(`⚠️ Attempt ${attempt} failed: ${response.status} - ${errorText}`)
        }
      } catch (error: any) {
        lastError = error
        console.warn(`⚠️ Attempt ${attempt} failed with error:`, error.message)
        
        if (error.name === 'AbortError') {
          console.warn(`⏰ Attempt ${attempt} timed out`)
        }
      }
      
      // Wait before retry (exponential backoff)
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000 // 2s, 4s, 8s
        console.log(`⏳ Waiting ${delay}ms before retry...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    // All attempts failed
    console.error(`❌ All ${maxRetries} attempts failed for server ${serverId}`)
    return NextResponse.json({ 
      error: `فشل في إيقاف الخادم بعد ${maxRetries} محاولات`,
      details: lastError?.status ? `HTTP ${lastError.status}: ${lastError.error}` : lastError?.message || 'خطأ غير معروف',
      attempts: maxRetries
    }, { status: 500 })

  } catch (error) {
    console.error("❌ Error suspending server:", error)
    return NextResponse.json({ 
      error: "خطأ في إيقاف الخادم",
      details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'خطأ غير معروف' : undefined
    }, { status: 500 })
  }
} 