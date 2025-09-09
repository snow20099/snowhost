import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"

const PTERODACTYL_URL = process.env.PTERODACTYL_URL || ""
const PTERODACTYL_API_KEY = process.env.PTERODACTYL_API_KEY || ""

// POST: Auto-suspend expired servers
export async function POST(req: NextRequest) {
  try {
    console.log('🔄 Starting auto-suspend process for expired servers...')

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

    for (const user of users) {
      const expiredServers = user.servers.filter((server: any) => {
        const expiresAt = new Date(server.expiresAt)
        const now = new Date()
        return expiresAt <= now && !server.isExpired
      })

      console.log(`👤 User ${user.email} has ${expiredServers.length} expired servers`)

      for (const server of expiredServers) {
        try {
          if (server.pterodactylId) {
            console.log(`🔄 Suspending server ${server.pterodactylId} for user ${user.email}`)
            
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
                    'servers.$.suspendedAt': new Date()
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
                email: user.email,
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
    }

    console.log(`✅ Auto-suspend process completed. Suspended: ${totalSuspended}, Errors: ${totalErrors}`)

    return NextResponse.json({
      success: true,
      message: 'تم إيقاف الخوادم المنتهية تلقائياً',
      summary: {
        totalUsers: users.length,
        totalSuspended,
        totalErrors
      }
    })

  } catch (error) {
    console.error("❌ Error in auto-suspend process:", error)
    return NextResponse.json({ 
      error: "خطأ في عملية الإيقاف التلقائي",
      details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'خطأ غير معروف' : undefined
    }, { status: 500 })
  }
} 