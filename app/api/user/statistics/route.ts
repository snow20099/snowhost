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
    const now = new Date()
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    const count = async (status: string, start: Date, end?: Date) => {
      return await Server.countDocuments({
        userId,
        status,
        createdAt: { $gte: start, ...(end ? { $lt: end } : {}) }
      })
    }

    const sumPayments = async (start?: Date, end?: Date) => {
      const payments = await Payment.aggregate([
        { $match: { userId, status: 'completed', ...(start ? { createdAt: { $gte: start, ...(end ? { $lt: end } : {}) } } : {}) } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
      return payments[0]?.total || 0
    }

    const currentActiveServers = await count('active', currentMonth)
    const previousActiveServers = await count('active', previousMonth, currentMonth)
    const currentInactiveServers = await count('inactive', currentMonth)
    const previousInactiveServers = await count('inactive', previousMonth, currentMonth)
    const currentMonthSpending = await sumPayments(currentMonth)
    const previousMonthSpending = await sumPayments(previousMonth, currentMonth)
    const totalSpending = await sumPayments()
    const previousTotalSpending = await sumPayments(undefined, currentMonth)

    const calcPercentage = (current: number, previous: number) => previous === 0 ? (current > 0 ? 100 : 0) : Math.round(((current - previous) / previous) * 100 * 10) / 10

    return NextResponse.json({
      activeServers: { current: currentActiveServers, previous: previousActiveServers, percentage: calcPercentage(currentActiveServers, previousActiveServers) },
      inactiveServers: { current: currentInactiveServers, previous: previousInactiveServers, percentage: calcPercentage(currentInactiveServers, previousInactiveServers) },
      monthlySpent: { current: currentMonthSpending, previous: previousMonthSpending, percentage: calcPercentage(currentMonthSpending, previousMonthSpending) },
      totalSpent: { current: totalSpending, previous: previousTotalSpending, percentage: calcPercentage(totalSpending, previousTotalSpending) }
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 })
  }
}
