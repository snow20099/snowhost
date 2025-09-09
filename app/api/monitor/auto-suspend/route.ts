import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"

const PTERODACTYL_URL = process.env.PTERODACTYL_URL || ""
const PTERODACTYL_API_KEY = process.env.PTERODACTYL_API_KEY || ""

// GET: Auto-monitor and suspend expired servers
export async function GET(req: NextRequest) {
  try {
    console.log('🕐 Auto-monitor started: Checking for expired servers...')
    const startTime = Date.now()

    // Connect to database
    await connectToDatabase()
    
    // Find all users with expired servers
    const users = await User.find({
      'servers.expiresAt': { $lte: new Date() },
      'servers.isExpired': false
    })

    console.log(`📊 Found ${users.length} users with expired servers`)

    let totalSuspended = 0
    let totalErrors = 0
    let totalProcessed = 0

    for (const user of users) {
      const expiredServers = user.servers.filter((server: any) => {
        const expiresAt = new Date(server.expiresAt)
        const now = new Date()
        return expiresAt <= now && !server.isExpired
      })

      if (expiredServers.length === 0) continue

      console.log(`👤 User ${user.email} has ${expiredServers.length} expired servers`)

      for (const server of expiredServers) {
        totalProcessed++
        
        try {
          if (server.pterodactylId) {
            console.log(`🔄 Suspending expired server ${server.pterodactylId} (${server.name}) for user ${user.email}`)
            
            // Suspend server in Pterodactyl
            const response = await fetch(`${PTERODACTYL_URL}/api/application/servers/${server.pterodactylId}/suspend`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
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
                  email: user.email,
                  'servers.id': server.id
                },
                {
                  $set: {
                    'servers.$.isExpired': true,
                    'servers.$.status': 'suspended',
                    'servers.$.suspendedAt': new Date(),
                    'servers.$.autoSuspended': true,
                    'servers.$.updatedAt': new Date()
                  }
                }
              )
            } else {
              const errorText = await response.text()
              console.error(`❌ Failed to suspend server ${server.pterodactylId}:`, response.status, errorText)
              totalErrors++
            }
          } else {
            console.log(`⚠️ Server ${server.id} has no Pterodactyl ID, marking as expired`)
            
            // Update server status in MongoDB (no Pterodactyl ID)
            await User.updateOne(
              { 
                email: user.email,
                'servers.id': server.id
              },
              {
                $set: {
                  'servers.$.isExpired': true,
                  'servers.$.status': 'expired',
                  'servers.$.autoSuspended': true,
                  'servers.$.updatedAt': new Date()
                }
              }
            )
          }
        } catch (error) {
          console.error(`❌ Error processing server ${server.id}:`, error)
          totalErrors++
        }
      }
    }

    const endTime = Date.now()
    const duration = endTime - startTime

    console.log(`✅ Auto-monitor completed in ${duration}ms`)
    console.log(`📊 Summary: Processed: ${totalProcessed}, Suspended: ${totalSuspended}, Errors: ${totalErrors}`)

    return NextResponse.json({
      success: true,
      message: 'تم فحص وإيقاف الخوادم المنتهية تلقائياً',
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      summary: {
        totalUsers: users.length,
        totalProcessed,
        totalSuspended,
        totalErrors
      }
    })

  } catch (error) {
    console.error("❌ Error in auto-monitor:", error)
    return NextResponse.json({ 
      error: "خطأ في المراقبة التلقائية",
      details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'خطأ غير معروف' : undefined
    }, { status: 500 })
  }
} 