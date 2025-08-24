// app/api/user/statistics/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
// import your database client and auth config here
// import { prisma } from '@/lib/prisma'
// import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get user session - replace with your auth method
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }
    // const userId = session.user.id

    // For now, we'll use a mock userId - replace this with actual session
    const userId = "user123" // Replace with actual user ID from session

    // Get current date ranges
    const now = new Date()
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    
    // Replace with your actual database queries
    // Example using Prisma (adapt to your database):
    
    /*
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
    */
    
    // Mock data for demonstration - replace with actual database queries above
    const currentActiveServers = 5
    const previousActiveServers = 4
    const currentInactiveServers = 2
    const previousInactiveServers = 3
    const currentMonthSpendingAmount = 850
    const previousMonthSpendingAmount = 720
    const totalSpendingAmount = 12500
    const previousTotalSpendingAmount = 11650
    
    // Calculate percentages
    const calculatePercentage = (current: number, previous: number) => {
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
        current: currentMonthSpendingAmount,
        previous: previousMonthSpendingAmount,
        percentage: calculatePercentage(currentMonthSpendingAmount, previousMonthSpendingAmount)
      },
      totalSpent: {
        current: totalSpendingAmount,
        previous: previousTotalSpendingAmount,
        percentage: calculatePercentage(totalSpendingAmount, previousTotalSpendingAmount)
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

export async function POST(request: NextRequest) {
  try {
    // Handle custom date range requests for user statistics
    const body = await request.json()
    const { startDate, endDate, userId } = body
    
    // Add custom date range logic here for user-specific data
    // This is useful for filtering user statistics by specific date ranges
    
    return NextResponse.json({ message: 'Custom user date range not implemented yet' })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}
