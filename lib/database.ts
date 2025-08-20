// lib/database.ts - دوال التعامل مع قاعدة البيانات

import { PrismaClient } from '@prisma/client'

// إنشاء instance من Prisma
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Types
export interface CreatePaymentTransactionData {
  user_id: string
  tran_ref: string
  cart_id: string
  amount: number
  currency: string
  payment_provider: 'PAYTABS' | 'PAYPAL' | 'STRIPE' | 'CRYPTO' | 'EGYPTIAN_WALLET'
  callback_url?: string
  return_url?: string
}

export interface UpdatePaymentTransactionData {
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED'
  payment_method?: string
  paytabs_response?: any
  completed_at?: Date
}

// دالة للعثور على المستخدم بالإيميل
export async function findUserByEmail(email: string) {
  try {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        walletTransactions: {
          orderBy: { created_at: 'desc' },
          take: 10
        }
      }
    })
  } catch (error) {
    console.error('Error finding user:', error)
    return null
  }
}

// دالة لإنشاء أو تحديث المستخدم
export async function upsertUser(email: string, name?: string, phone?: string) {
  try {
    return await prisma.user.upsert({
      where: { email },
      update: {
        name: name || undefined,
        phone: phone || undefined,
        updated_at: new Date()
      },
      create: {
        email,
        name: name || null,
        phone: phone || null
      }
    })
  } catch (error) {
    console.error('Error upserting user:', error)
    return null
  }
}

// دالة لإنشاء معاملة دفع جديدة
export async function createPaymentTransaction(data: CreatePaymentTransactionData) {
  try {
    return await prisma.paymentTransaction.create({
      data: {
        ...data,
        status: 'PENDING'
      }
    })
  } catch (error) {
    console.error('Error creating payment transaction:', error)
    return null
  }
}

// دالة لتحديث معاملة الدفع
export async function updatePaymentTransaction(
  tran_ref: string, 
  updateData: UpdatePaymentTransactionData
) {
  try {
    return await prisma.paymentTransaction.update({
      where: { tran_ref },
      data: {
        ...updateData,
        updated_at: new Date()
      }
    })
  } catch (error) {
    console.error('Error updating payment transaction:', error)
    return null
  }
}

// دالة للعثور على معاملة الدفع
export async function findPaymentTransaction(tran_ref: string) {
  try {
    return await prisma.paymentTransaction.findUnique({
      where: { tran_ref },
      include: {
        user: true
      }
    })
  } catch (error) {
    console.error('Error finding payment transaction:', error)
    return null
  }
}

// دالة لتحديث رصيد المستخدم
export async function updateUserBalance(
  userId: string, 
  amount: number, 
  transactionRef: string,
  description?: string
) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // تحديث رصيد المستخدم
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          balance: {
            increment: amount
          }
        }
      })

      // إنشاء سجل في محفظة المستخدم
      const walletTransaction = await tx.walletTransaction.create({
        data: {
          user_id: userId,
          amount: amount,
          type: amount > 0 ? 'DEPOSIT' : 'WITHDRAWAL',
          status: 'COMPLETED',
          reference: transactionRef,
          description: description || `PayTabs Balance Top-up - ${transactionRef}`
        }
      })

      return { user: updatedUser, walletTransaction }
    })

    return result
  } catch (error) {
    console.error('Error updating user balance:', error)
    return null
  }
}

// دالة لجلب معاملات المحفظة
export async function getUserWalletTransactions(
  userId: string, 
  limit: number = 20,
  offset: number = 0
) {
  try {
    return await prisma.walletTransaction.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            email: true,
            name: true
          }
        }
      }
    })
  } catch (error) {
    console.error('Error getting wallet transactions:', error)
    return []
  }
}

// دالة لجلب معاملات الدفع للمستخدم
export async function getUserPaymentTransactions(
  userId: string,
  limit: number = 20,
  offset: number = 0
) {
  try {
    return await prisma.paymentTransaction.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: limit,
      skip: offset
    })
  } catch (error) {
    console.error('Error getting payment transactions:', error)
    return []
  }
}

// دالة للحصول على إحصائيات المستخدم
export async function getUserStats(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        balance: true,
        _count: {
          select: {
            walletTransactions: true,
            paymentTransactions: true
          }
        }
      }
    })

    if (!user) return null

    // حساب إجمالي المبالغ المودعة
    const totalDeposited = await prisma.walletTransaction.aggregate({
      where: {
        user_id: userId,
        type: 'DEPOSIT',
        status: 'COMPLETED'
      },
      _sum: {
        amount: true
      }
    })

    // حساب إجمالي المبالغ المسحوبة
    const totalWithdrawn = await prisma.walletTransaction.aggregate({
      where: {
        user_id: userId,
        type: 'WITHDRAWAL',
        status: 'COMPLETED'
      },
      _sum: {
        amount: true
      }
    })

    return {
      currentBalance: user.balance,
      totalTransactions: user._count.walletTransactions,
      totalPayments: user._count.paymentTransactions,
      totalDeposited: totalDeposited._sum.amount || 0,
      totalWithdrawn: Math.abs(totalWithdrawn._sum.amount || 0)
    }
  } catch (error) {
    console.error('Error getting user stats:', error)
    return null
  }
}

// دالة للتنظيف (حذف المعاملات القديمة الفاشلة)
export async function cleanupOldFailedTransactions(daysOld: number = 30) {
  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    const result = await prisma.paymentTransaction.deleteMany({
      where: {
        status: 'FAILED',
        created_at: {
          lt: cutoffDate
        }
      }
    })

    console.log(`Cleaned up ${result.count} old failed transactions`)
    return result.count
  } catch (error) {
    console.error('Error cleaning up transactions:', error)
    return 0
  }
}

// دالة للتحقق من صحة المعاملة
export async function validateTransaction(tran_ref: string) {
  try {
    const transaction = await prisma.paymentTransaction.findUnique({
      where: { tran_ref }
    })

    if (!transaction) {
      return { valid: false, reason: 'Transaction not found' }
    }

    if (transaction.status === 'COMPLETED') {
      return { valid: false, reason: 'Transaction already processed' }
    }

    // التحقق من عمر المعاملة (مثلاً لا تقبل معاملات أقدم من ساعة)
    const oneHourAgo = new Date()
    oneHourAgo.setHours(oneHourAgo.getHours() - 1)

    if (transaction.created_at < oneHourAgo) {
      return { valid: false, reason: 'Transaction expired' }
    }

    return { valid: true, transaction }
  } catch (error) {
    console.error('Error validating transaction:', error)
    return { valid: false, reason: 'Validation error' }
  }
}
