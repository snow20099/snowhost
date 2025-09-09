import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"

const secret = process.env.NEXTAUTH_SECRET || "fallback-secret-key-change-in-production"
const PTERODACTYL_URL = process.env.PTERODACTYL_URL || ""
const PTERODACTYL_API_KEY = process.env.PTERODACTYL_API_KEY || ""

// GET: Get server details
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req, secret })
    
    if (!token?.email) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const serverId = params.id

    // Get server from Pterodactyl
    const response = await fetch(`${PTERODACTYL_URL}/api/application/servers/${serverId}`, {
      headers: {
        'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Server not found" }, { status: 404 })
    }

    const serverData = await response.json()

    return NextResponse.json({
      success: true,
      server: serverData.data
    })

  } catch (error) {
    console.error("Get Server Error:", error)
    return NextResponse.json({ 
      error: "Failed to get server details" 
    }, { status: 500 })
  }
}

// PUT: Update server status
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req, secret })
    
    if (!token?.email) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const serverId = params.id
    const { action } = await req.json()

    if (!action) {
      return NextResponse.json({ error: "Action required" }, { status: 400 })
    }

    // Update server status in Pterodactyl
    let pterodactylResponse
    switch (action) {
      case 'start':
        pterodactylResponse = await fetch(`${PTERODACTYL_URL}/api/application/servers/${serverId}/power`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ signal: 'start' })
        })
        break
      case 'stop':
        pterodactylResponse = await fetch(`${PTERODACTYL_URL}/api/application/servers/${serverId}/power`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ signal: 'stop' })
        })
        break
      case 'restart':
        pterodactylResponse = await fetch(`${PTERODACTYL_URL}/api/application/servers/${serverId}/power`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ signal: 'restart' })
        })
        break
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    if (!pterodactylResponse?.ok) {
      return NextResponse.json({ error: "Failed to update server status" }, { status: 500 })
    }

    // Update server status in MongoDB
    await connectToDatabase()
    
    const statusMap: { [key: string]: string } = {
      'start': 'active',
      'stop': 'stopped',
      'restart': 'active'
    }

    await User.findOneAndUpdate(
      { 
        email: token.email,
        'servers.id': serverId
      },
      { 
        $set: { 
          'servers.$.status': statusMap[action],
          'servers.$.lastUpdated': new Date()
        }
      }
    )

    return NextResponse.json({
      success: true,
      message: `Server ${action}ed successfully`,
      status: statusMap[action]
    })

  } catch (error) {
    console.error("Update Server Error:", error)
    return NextResponse.json({ 
      error: "Failed to update server" 
    }, { status: 500 })
  }
}

// DELETE: Delete server
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req, secret })
    
    if (!token?.email) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const serverId = params.id

    // Delete server from Pterodactyl
    const response = await fetch(`${PTERODACTYL_URL}/api/application/servers/${serverId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to delete server from Pterodactyl" }, { status: 500 })
    }

    // Remove server from MongoDB
    await connectToDatabase()
    
    await User.findOneAndUpdate(
      { email: token.email },
      { $pull: { servers: { id: serverId } } }
    )

    return NextResponse.json({
      success: true,
      message: "Server deleted successfully"
    })

  } catch (error) {
    console.error("Delete Server Error:", error)
    return NextResponse.json({ 
      error: "Failed to delete server" 
    }, { status: 500 })
  }
} 