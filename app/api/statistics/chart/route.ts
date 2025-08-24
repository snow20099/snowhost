// app/api/statistics/chart/route.ts
import { NextRequest, NextResponse } from 'next/server'
// import your database client here
// import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const months = parseInt(searchParams.get('months') || '6')
    
    // Generate array of last N months
    const getLastNMonths = (n: number) => {
      const months = []
      const now = new Date()
      
      for (let i = n - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthNames = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ]
        
        months.push({
          month: monthNames[date.getMonth()],
          year: date.getFullYear(),
          startDate: new Date(date.getFullYear(), date.getMonth(), 1),
          endDate: new Date(date.getFullYear(), date.getMonth() + 1, 0)
        })
      }
      
      return months
    }
    
    const monthsData = getLastNMonths(months)
    
    // Replace with actual database queries
    /*
    const chartData = await Promise.all(
      monthsData.map(async ({ month, startDate, endDate }) => {
        // Users count for this month
        const users = await prisma.user.count({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          }
        })
        
        // Orders count for this month
        const orders = await prisma.order.count({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate
            },
            status: 'completed'
          }
        })
        
        // Revenue for this month
        const revenueResult = await prisma.order.aggregate({
          _sum: {
            totalAmount: true
          },
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate
            },
            status: 'completed'
          }
        })
        
        const revenue = revenueResult._sum.totalAmount || 0
        
        return {
          month,
          users,
          orders,
          revenue
        }
      })
    )
    */
    
    // Mock data for demonstration - replace with actual database queries above
    const chartData = [
      { month: 'Feb', users: 2400, orders: 890, revenue: 18200 },
      { month: 'Mar', users: 2680, orders: 920, revenue: 19800 },
      { month: 'Apr', users: 2890, orders: 1100, revenue: 22400 },
      { month: 'May', users: 3100, orders: 980, revenue: 21200 },
      { month: 'Jun', users: 3250, orders: 1150, revenue: 25600 },
      { month: 'Jul', users: 3428, orders: 1247, revenue: 28450 }
    ]
    
    return NextResponse.json(chartData)
    
  } catch (error) {
    console.error('Chart Data API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chart data' },
      { status: 500 }
    )
  }
}

// Additional endpoint for different chart types
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { chartType, dateRange, metrics } = body
    
    switch (chartType) {
      case 'revenue_trend':
        // Handle revenue trend specific logic
        break
        
      case 'user_growth':
        // Handle user growth specific logic
        break
        
      case 'server_usage':
        // Handle server usage specific logic
        break
        
      default:
        return NextResponse.json(
          { error: 'Invalid chart type' },
          { status: 400 }
        )
    }
    
    // Return processed data based on chart type
    return NextResponse.json({ message: 'Chart type processing not implemented' })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}