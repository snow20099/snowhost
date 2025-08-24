// app/api/user/servers/route.ts
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
    
    // Get real data from database for each month
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
        
        const spending = Number(spendingResult._sum.amount || 0)
        
        return {
          month,
          activeServers,
          inactiveServers,
          spending
        }
      })
    )
    
    return NextResponse.json(userServerData)
    
  } catch (error) {
    console.error('User Servers API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user server data' },
      { status: 500 }
    )
  }
}

// Get user's server list with pagination
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = session.user.id

    const body = await request.json()
    const { 
      action, 
      serverId, 
      page = 1, 
      limit = 10,
      status = 'all',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = body
    
    // Handle server actions
    if (action && serverId) {
      switch (action) {
        case 'start':
          await prisma.server.update({
            where: {
              id: serverId,
              userId: userId // Ensure user owns this server
            },
            data: {
              status: 'active',
              updatedAt: new Date()
            }
          })
          
          // Log the action
          await prisma.serverLog.create({
            data: {
              serverId,
              userId,
              action: 'start',
              description: 'Server started by user'
            }
          })
          
          return NextResponse.json({ 
            message: 'Server started successfully', 
            serverId, 
            action 
          })
          
        case 'stop':
          await prisma.server.update({
            where: {
              id: serverId,
              userId: userId
            },
            data: {
              status: 'inactive',
              updatedAt: new Date()
            }
          })
          
          await prisma.serverLog.create({
            data: {
              serverId,
              userId,
              action: 'stop',
              description: 'Server stopped by user'
            }
          })
          
          return NextResponse.json({ 
            message: 'Server stopped successfully', 
            serverId, 
            action 
          })
          
        case 'restart':
          // First stop, then start
          await prisma.server.update({
            where: {
              id: serverId,
              userId: userId
            },
            data: {
              status: 'restarting',
              updatedAt: new Date()
            }
          })
          
          // Simulate restart delay, then set to active
          setTimeout(async () => {
            await prisma.server.update({
              where: { id: serverId },
              data: { status: 'active' }
            })
          }, 5000)
          
          await prisma.serverLog.create({
            data: {
              serverId,
              userId,
              action: 'restart',
              description: 'Server restarted by user'
            }
          })
          
          return NextResponse.json({ 
            message: 'Server restart initiated', 
            serverId, 
            action 
          })
          
        case 'delete':
          // Soft delete or hard delete based on your business logic
          await prisma.server.update({
            where: {
              id: serverId,
              userId: userId
            },
            data: {
              status: 'deleted',
              deletedAt: new Date(),
              updatedAt: new Date()
            }
          })
          
          await prisma.serverLog.create({
            data: {
              serverId,
              userId,
              action: 'delete',
              description: 'Server deleted by user'
            }
          })
          
          return NextResponse.json({ 
            message: 'Server deleted successfully', 
            serverId, 
            action 
          })
          
        default:
          return NextResponse.json(
            { error: 'Invalid action' },
            { status: 400 }
          )
      }
    }
    
    // Handle server list retrieval with pagination
    const skip = (page - 1) * limit
    
    // Build where clause based on status filter
    const whereClause: any = {
      userId: userId,
      deletedAt: null // Exclude soft-deleted servers
    }
    
    if (status !== 'all') {
      whereClause.status = status
    }
    
    // Get user's servers with pagination
    const servers = await prisma.server.findMany({
      where: whereClause,
      orderBy: {
        [sortBy]: sortOrder
      },
      skip,
      take: limit,
      include: {
        _count: {
          select: {
            serverLogs: true
          }
        }
      }
    })
    
    // Get total count for pagination
    const totalServers = await prisma.server.count({
      where: whereClause
    })
    
    const totalPages = Math.ceil(totalServers / limit)
    
    return NextResponse.json({
      servers,
      pagination: {
        currentPage: page,
        totalPages,
        totalServers,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })
    
  } catch (error) {
    console.error('Server action/list error:', error)
    return NextResponse.json(
      { error: 'Server operation failed' },
      { status: 500 }
    )
  }
}
