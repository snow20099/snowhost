import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"

const secret = process.env.NEXTAUTH_SECRET || "fallback-secret-key-change-in-production"

// POST: Check and suspend expired servers immediately
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret })
    
    if (!token?.email) {
      return NextResponse.json({ error: "غير مصرح - يرجى تسجيل الدخول مرة أخرى" }, { status: 401 })
    }

    console.log(`🔄 Starting immediate expiry check for user: ${token.email}`)

    // Connect to database
    await connectToDatabase()
    
    // Find user and expired servers
    const user = await User.findOne({ 
      email: token.email,
      'servers.expiresAt': { $lte: new Date() },
      'servers.isExpired': false
    })
    
    if (!user) {
      return NextResponse.json({ 
        message: "لا توجد خوادم منتهية" 
      })
    }

    const expiredServers = user.servers.filter((server: any) => {
      const expiresAt = new Date(server.expiresAt)
      const now = new Date()
      return expiresAt <= now && !server.isExpired
    })

    console.log(`📊 Found ${expiredServers.length} expired servers for user ${token.email}`)

    if (expiredServers.length === 0) {
      return NextResponse.json({ 
        message: "لا توجد خوادم منتهية" 
      })
    }

    let totalSuspended = 0
    let totalErrors = 0

    for (const server of expiredServers) {
      try {
        if (server.pterodactylId) {
          console.log(`🔄 Suspending expired server ${server.pterodactylId} (${server.name})`)
          
          // Suspend server in Pterodactyl
          const response = await fetch(`${process.env.PTERODACTYL_URL}/api/application/servers/${server.pterodactylId}/suspend`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.PTERODACTYL_API_KEY}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          })

          if (response.ok) {
            console.log(`✅ Server ${server.pterodactylId} suspended successfully`)
            totalSuspended++
            
            // Update server status in MongoDB
            await User.updateOne(
              { 
                email: token.email,
                'servers.id': server.id
              },
              {
                $set: {
                  'servers.$.isExpired': true,
                  'servers.$.status': 'suspended',
                  'servers.$.suspendedAt': new Date(),
                  'servers.$.autoSuspended': true
                }
              }
            )
          } else {
            console.error(`❌ Failed to suspend server ${server.pterodactylId}:`, response.status)
            totalErrors++
          }
        } else {
          console.log(`⚠️ Server ${server.id} has no Pterodactyl ID, marking as expired`)
          
          // Update server status in MongoDB (no Pterodactyl ID)
          await User.updateOne(
            { 
              email: token.email,
              'servers.id': server.id
            },
            {
              $set: {
                'servers.$.isExpired': true,
                'servers.$.status': 'expired'
              }
            }
          )
        }
      } catch (error) {
        console.error(`❌ Error processing server ${server.id}:`, error)
        totalErrors++
      }
    }

    console.log(`✅ Immediate expiry check completed. Suspended: ${totalSuspended}, Errors: ${totalErrors}`)

    return NextResponse.json({
      success: true,
      message: 'تم فحص وإيقاف الخوادم المنتهية',
      summary: {
        totalExpired: expiredServers.length,
        totalSuspended,
        totalErrors
      }
    })

  } catch (error) {
    console.error("❌ Error in immediate expiry check:", error)
    return NextResponse.json({ 
      error: "خطأ في فحص الخوادم المنتهية",
      details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'خطأ غير معروف' : undefined
    }, { status: 500 })
  }
} 