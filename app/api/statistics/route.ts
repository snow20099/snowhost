// app/api/statistics/route.ts
import { NextRequest, NextResponse } from 'next/server'
// import your database client here
// import { prisma } from '@/lib/prisma' // or your preferred DB client

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'month'
    
    // Get current date ranges
    const now = new Date()
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    
    // Replace with your actual database queries
    // Example using Prisma (adapt to your database):
    
    /*
    // Current month orders
    const currentOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: currentMonth
        },
        status: 'completed'
      }
    })
    
    // Previous month orders
    const previousOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: previousMonth,
          lte: endOfPreviousMonth
        },
        status: 'completed'
      }
    })
    
    // Active users (logged in within last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const currentUsers = await prisma.user.count({
      where: {
        lastLoginAt: {
          gte: thirtyDaysAgo
        }
      }
    })
    
    const previousUsers = await prisma.user.count({
      where: {
        lastLoginAt: {
          gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          lt: thirtyDaysAgo
        }
      }
    })
    
    // Active servers (replace with your server monitoring logic)
    const activeServers = await prisma.server.count({
      where: {
        status: 'active'
      }
    })
    
    const previousActiveServers = await prisma.serverLog.groupBy({
      by: ['serverId'],
      where: {
        createdAt: {
          gte: previousMonth,
          lte: endOfPreviousMonth
        },
        status: 'active'
      }
    }).then(result => result.length)
    
    // Revenue calculation
    const currentRevenue = await prisma.order.aggregate({
      _sum: {
        totalAmount: true
      },
      where: {
        createdAt: {
          gte: currentMonth
        },
        status: 'completed'
      }
    })
    
    const previousRevenue = await prisma.order.aggregate({
      _sum: {
        totalAmount: true
      },
      where: {
        createdAt: {
          gte: previousMonth,
          lte: endOfPreviousMonth
        },
        status: 'completed'
      }
    })
    */
    
    // Mock data for demonstration - replace with actual database queries above
    const currentOrders = 1247
    const previousOrders = 1089
    const currentUsers = 3428
    const previousUsers = 3201
    const activeServers = 12
    const previousActiveServers = 15
    const currentRevenueAmount = 28450
    const previousRevenueAmount = 24200
    
    // Calculate percentages
    const calculatePercentage = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0
      return Math.round(((current - previous) / previous) * 100 * 10) / 10
    }
    
    const statistics = {
      orders: {
        current: currentOrders,
        previous: previousOrders,
        percentage: calculatePercentage(currentOrders, previousOrders)
      },
      users: {
        current: currentUsers,
        previous: previousUsers,
        percentage: calculatePercentage(currentUsers, previousUsers)
      },
      servers: {
        current: activeServers,
        previous: previousActiveServers,
        percentage: calculatePercentage(activeServers, previousActiveServers)
      },
      revenue: {
        current: currentRevenueAmount,
        previous: previousRevenueAmount,
        percentage: calculatePercentage(currentRevenueAmount, previousRevenueAmount)
      }
    }
    
    return NextResponse.json(statistics)
    
  } catch (error) {
    console.error('Statistics API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Handle custom date range requests
    const body = await request.json()
    const { startDate, endDate } = body
    
    // Add custom date range logic here
    // This is useful for filtering statistics by specific date ranges
    
    return NextResponse.json({ message: 'Custom date range not implemented yet' })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}