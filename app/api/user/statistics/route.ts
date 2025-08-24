import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  await dbConnect()
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await User.findOne({ email: session.user.email })

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // احسب الخوادم النشطة وغير النشطة من user.servers
  const activeServers = user.servers.filter(s => s.status === 'active').length
  const inactiveServers = user.servers.filter(s => s.status !== 'active').length
  const totalSpent = user.transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0)

  return NextResponse.json({
    activeServers,
    inactiveServers,
    totalSpent
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
