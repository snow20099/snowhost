import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const PTERODACTYL_URL = process.env.PTERODACTYL_URL
const PTERODACTYL_API_KEY = process.env.PTERODACTYL_API_KEY

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    if (!PTERODACTYL_URL || !PTERODACTYL_API_KEY) {
      return NextResponse.json({ error: 'إعدادات Pterodactyl غير مكتملة' }, { status: 500 })
    }

    const serverId = params.id

    const response = await fetch(`${PTERODACTYL_URL}/api/application/servers/${serverId}/power`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        signal: 'stop'
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Pterodactyl stop server error:', errorData)
      return NextResponse.json({ 
        error: errorData.errors?.[0]?.detail || 'فشل في إيقاف الخادم'
      }, { status: response.status })
    }

    return NextResponse.json({ 
      message: 'تم إيقاف الخادم بنجاح',
      serverId 
    })

  } catch (error) {
    console.error('Error stopping server:', error)
    return NextResponse.json(
      { error: 'خطأ في إيقاف الخادم' },
      { status: 500 }
    )
  }
} 