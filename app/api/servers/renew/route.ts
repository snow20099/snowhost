import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"

const secret = process.env.NEXTAUTH_SECRET || "fallback-secret-key-change-in-production"

// POST: Renew a server (extend expiry and unsuspend if needed)
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret })
    
    if (!token?.email) {
      return NextResponse.json({ error: "غير مصرح - يرجى تسجيل الدخول مرة أخرى" }, { status: 401 })
    }

    const body = await req.json()
    const { serverId, months = 1 } = body
    
    if (!serverId) {
      return NextResponse.json({ 
        error: "معرف الخادم مطلوب" 
      }, { status: 400 })
    }

    if (months < 1 || months > 12) {
      return NextResponse.json({ 
        error: "عدد الأشهر يجب أن يكون بين 1 و 12" 
      }, { status: 400 })
    }

    console.log(`🔄 Renewing server ${serverId} for ${months} month(s)`)

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

    // Calculate new expiry date
    const now = new Date()
    const currentExpiry = new Date(server.expiresAt || server.createdAt)
    const newExpiry = new Date(Math.max(now.getTime(), currentExpiry.getTime()))
    newExpiry.setMonth(newExpiry.getMonth() + months)

    // Calculate cost (assuming monthly price)
    const monthlyPrice = server.price || 0
    const totalCost = monthlyPrice * months

    // Check user balance
    if (user.balance < totalCost) {
      return NextResponse.json({ 
        error: "رصيد غير كافي للتجديد",
        required: totalCost,
        current: user.balance
      }, { status: 400 })
    }

    console.log(`💰 Renewal cost: ${totalCost} (${months} month(s) at ${monthlyPrice} per month)`)

    // Update server expiry in MongoDB
    const updatedUser = await User.findOneAndUpdate(
      { 
        email: token.email,
        'servers.id': serverId
      },
      {
        $set: {
          'servers.$.expiresAt': newExpiry,
          'servers.$.isExpired': false,
          'servers.$.status': 'active',
          'servers.$.autoRenewal': true,
          'servers.$.lastBillingDate': now,
          'servers.$.nextBillingDate': newExpiry
        }
      },
      { new: true }
    )

    if (!updatedUser) {
      return NextResponse.json({ 
        error: "فشل في تحديث الخادم" 
      }, { status: 500 })
    }

    // Deduct balance
    const newBalance = user.balance - totalCost
    await User.updateOne(
      { email: token.email },
      { $set: { balance: newBalance } }
    )

    // If server was suspended, unsuspend it
    if (server.pterodactylId && server.status === 'suspended') {
      try {
        console.log(`🔄 Unsuspending server ${server.pterodactylId} in Pterodactyl`)
        
        const unsuspendResponse = await fetch(`/api/pterodactyl/servers/unsuspend`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ serverId: server.pterodactylId })
        })

        if (unsuspendResponse.ok) {
          console.log(`✅ Server ${server.pterodactylId} unsuspended successfully`)
        } else {
          console.warn(`⚠️ Failed to unsuspend server ${server.pterodactylId} in Pterodactyl`)
        }
      } catch (error) {
        console.warn(`⚠️ Error unsuspending server in Pterodactyl:`, error)
      }
    }

    console.log(`✅ Server ${serverId} renewed successfully until ${newExpiry.toISOString()}`)

    return NextResponse.json({
      success: true,
      message: `تم تجديد الخادم بنجاح لمدة ${months} شهر(أشهر)`,
      server: {
        id: serverId,
        name: server.name,
        newExpiry: newExpiry.toISOString(),
        months: months,
        cost: totalCost
      },
      user: {
        newBalance: newBalance,
        previousBalance: user.balance
      }
    })

  } catch (error) {
    console.error("❌ Error renewing server:", error)
    return NextResponse.json({ 
      error: "خطأ في تجديد الخادم",
      details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'خطأ غير معروف' : undefined
    }, { status: 500 })
  }
} 