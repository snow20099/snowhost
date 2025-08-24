// app/api/user/servers/route.ts
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
    
    // Replace with actual database queries for user-specific data
    /*
    const userServerData = await Promise.all(
      monthsData.map(async ({ month, startDate, endDate }) => {
        // Active servers count for this user in this month
        const activeServers = await prisma.server.count({
          where: {
            userId: userId,
            status: 'active',
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          }
        })
        
        // Inactive servers count for this user in this month
        const inactiveServers = await prisma.server.count({
          where: {
            userId: userId,
            status: 'inactive',
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          }
        })
        
        // Spending for this user in this month
        const spendingResult = await prisma.payment.aggregate({
          _sum: {
            amount: true
          },
          where: {
            userId: userId,
            status: 'completed',
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          }
        })
        
        const spending = spendingResult._sum.amount || 0
        
        return {
          month,
          activeServers,
          inactiveServers,
          spending
        }
      })
    )
    */
    
    // Mock data for demonstration - replace with actual database queries above
    const userServerData = [
      { month: 'Feb', activeServers: 3, inactiveServers: 1, spending: 650 },
      { month: 'Mar', activeServers: 4, inactiveServers: 1, spending: 720 },
      { month: 'Apr', activeServers: 4, inactiveServers: 2, spending: 680 },
      { month: 'May', activeServers: 5, inactiveServers: 1, spending: 780 },
      { month: 'Jun', activeServers: 5, inactiveServers: 2, spending: 850 },
      { month: 'Jul', activeServers: 5, inactiveServers: 2, spending: 850 }
    ]
    
    return NextResponse.json(userServerData)
    
  } catch (error) {
    console.error('User Servers API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user server data' },
      { status: 500 }
    )
  }
}

// Get specific server details for the user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { serverId, action } = body
    
    // Handle specific server actions like start, stop, restart, etc.
    switch (action) {
      case 'start':
        // Start server logic
        break
        
      case 'stop':
        // Stop server logic
        break
        
      case 'restart':
        // Restart server logic
        break
        
      case 'delete':
        // Delete server logic
        break
        
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
    
    // Return updated server status
    return NextResponse.json({ message: 'Server action completed', serverId, action })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Server action failed' },
      { status: 500 }
    )
  }
}
