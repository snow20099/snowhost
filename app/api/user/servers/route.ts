import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongoose'
import { Server } from '@/models/Server'
import { Payment } from '@/models/Payment'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = session.user.id

    const { searchParams } = new URL(req.url)
    const months = parseInt(searchParams.get('months') || '6')
    const now = new Date()

    const monthsData = Array.from({ length: months }).map((_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1)
      return { startDate: new Date(date.getFullYear(), date.getMonth(), 1), endDate: new Date(date.getFullYear(), date.getMonth() + 1, 0), month: date.toLocaleString('en', { month: 'short' }) }
    })

    const data = await Promise.all(monthsData.map(async ({ month, startDate, endDate }) => {
      const activeServers = await Server.countDocuments({ userId, status: 'active', createdAt: { $gte: startDate, $lte: endDate } })
      const inactiveServers = await Server.countDocuments({ userId, status: 'inactive', createdAt: { $gte: startDate, $lte: endDate } })
      const spendingResult = await Payment.aggregate([
        { $match: { userId, status: 'completed', createdAt: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
      const spending = spendingResult[0]?.total || 0
      return { month, activeServers, inactiveServers, spending }
    }))

    return NextResponse.json(data)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch server data' }, { status: 500 })
  }
}
