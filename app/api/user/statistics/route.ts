// app/api/user/statistics/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { prisma } from '@/lib/prisma' // Your database client
import { authOptions } from '@/lib/auth' // Your auth configuration

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user session
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = session.user.id

    // Get current date ranges
    const now = new Date()
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    
    // Current month active servers for this user
    const currentActiveServers = await prisma.server.count({
      where: {
        userId: userId,
        status: 'active',
        createdAt: {
          gte: currentMonth
        }
      }
    })
    
    // Previous month active servers for this user
    const previousActiveServers = await prisma.server.count({
      where: {
        userId: userId,
        status: 'active',
        createdAt: {
          gte: previousMonth,
          lt: currentMonth
        }
      }
    })
    
    // Current month inactive servers for this user
    const currentInactiveServers = await prisma.server.count({
      where: {
        userId: userId,
        status: 'inactive',
        createdAt: {
          gte: currentMonth
        }
      }
    })
    
    // Previous month inactive servers for this user
    const previousInactiveServers = await prisma.server.count({
      where: {
        userId: userId,
        status: 'inactive',
        createdAt: {
          gte: previousMonth,
          lt: currentMonth
        }
      }
    })
    
    // Current month spending for this user
    const currentMonthSpending = await prisma.payment.aggregate({
      _sum: {
        amount: true
      },
      where: {
        userId: userId,
        status: 'completed',
        createdAt: {
          gte: currentMonth
        }
      }
    })
    
    // Previous month spending for this user
    const previousMonthSpending = await prisma.payment.aggregate({
      _sum: {
        amount: true
      },
      where: {
        userId: userId,
        status: 'completed',
        createdAt: {
          gte: previousMonth,
          lt: currentMonth
        }
      }
    })
    
    // Total spending for this user
    const totalSpending = await prisma.payment.aggregate({
      _sum: {
        amount: true
      },
      where: {
        userId: userId,
        status: 'completed'
      }
    })
    
    // Previous total spending (up to previous month) for comparison
    const previousTotalSpending = await prisma.payment.aggregate({
      _sum: {
        amount: true
      },
      where: {
        userId: userId,
        status: 'completed',
        createdAt: {
          lt: currentMonth
        }
      }
    })
    
    // Extract values with null safety
    const currentMonthSpendingAmount = currentMonthSpending._sum.amount || 0
    const previousMonthSpendingAmount = previousMonthSpending._sum.amount || 0
    const totalSpendingAmount = totalSpending._sum.amount || 0
    const previousTotalSpendingAmount = previousTotalSpending._sum.amount || 0
    
    // Calculate percentages
    const calculatePercentage = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0
      return Math.round(((current - previous) / previous) * 100 * 10) / 10
    }
    
    const userStatistics = {
      activeServers: {
        current: currentActiveServers,
        previous: previousActiveServers,
        percentage: calculatePercentage(currentActiveServers, previousActiveServers)
      },
      inactiveServers: {
        current: currentInactiveServers,
        previous: previousInactiveServers,
        percentage: calculatePercentage(currentInactiveServers, previousInactiveServers)
      },
      monthlySpent: {
        current: Number(currentMonthSpendingAmount),
        previous: Number(previousMonthSpendingAmount),
        percentage: calculatePercentage(Number(currentMonthSpendingAmount), Number(previousMonthSpendingAmount))
      },
      totalSpent: {
        current: Number(totalSpendingAmount),
        previous: Number(previousTotalSpendingAmount),
        percentage: calculatePercentage(Number(totalSpendingAmount), Number(previousTotalSpendingAmount))
      }
    }
    
    return NextResponse.json(userStatistics)
    
  } catch (error) {
    console.error('User Statistics API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user statistics' },
      { status: 500 }
    )
  }
}

// Custom date range endpoint for user statistics
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = session.user.id

    const body = await request.json()
    const { startDate, endDate } = body
    
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      )
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    
    // Get data for custom date range
    const customActiveServers = await prisma.server.count({
      where: {
        userId: userId,
        status: 'active',
        createdAt: {
          gte: start,
          lte: end
        }
      }
    })
    
    const customInactiveServers = await prisma.server.count({
      where: {
        userId: userId,
        status: 'inactive',
        createdAt: {
          gte: start,
          lte: end
        }
      }
    })
    
    const customSpending = await prisma.payment.aggregate({
      _sum: {
        amount: true
      },
      where: {
        userId: userId,
        status: 'completed',
        createdAt: {
          gte: start,
          lte: end
        }
      }
    })
    
    const customRangeData = {
      activeServers: customActiveServers,
      inactiveServers: customInactiveServers,
      totalSpending: Number(customSpending._sum.amount || 0),
      dateRange: {
        start: start.toISOString(),
        end: end.toISOString()
      }
    }
    
    return NextResponse.json(customRangeData)
    
  } catch (error) {
    console.error('Custom date range error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch custom range data' },
      { status: 500 }
    )
  }
}
