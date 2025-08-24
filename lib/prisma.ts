// lib/prisma.ts
// Prisma client setup with connection pooling and error handling

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn'],
    errorFormat: 'pretty',
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Connection health check
export async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return { connected: true, message: 'Database connected successfully' }
  } catch (error) {
    console.error('Database connection error:', error)
    return { 
      connected: false, 
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Graceful shutdown
export async function disconnectDatabase() {
  try {
    await prisma.$disconnect()
    console.log('Database disconnected successfully')
  } catch (error) {
    console.error('Error disconnecting from database:', error)
  }
}

// User statistics helper functions
export class UserStatsService {
  static async getUserServerStats(userId: string, startDate: Date, endDate: Date) {
    return await prisma.server.groupBy({
      by: ['status'],
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate
        },
        deletedAt: null
      },
      _count: {
        id: true
      }
    })
  }

  static async getUserSpending(userId: string, startDate: Date, endDate: Date) {
    return await prisma.payment.aggregate({
      _sum: {
        amount: true
      },
      _count: {
        id: true
      },
      where: {
        userId,
        status: 'COMPLETED',
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      }
    })
  }

  static async getUserMonthlyData(userId: string, months: number = 6) {
    const monthsData = []
    const now = new Date()
    
    for (let i = months - 1; i >= 0; i--) {
      const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      
      const [serverStats, spending] = await Promise.all([
        this.getUserServerStats(userId, startDate, endDate),
        this.getUserSpending(userId, startDate, endDate)
      ])

      const activeServers = serverStats.find(s => s.status === 'ACTIVE')?._count.id || 0
      const inactiveServers = serverStats.find(s => s.status === 'INACTIVE')?._count.id || 0
      
      monthsData.push({
        month: startDate.toLocaleDateString('en', { month: 'short' }),
        year: startDate.getFullYear(),
        activeServers,
        inactiveServers,
        spending: Number(spending._sum.amount || 0)
      })
    }
    
    return monthsData
  }
}

export default prisma
