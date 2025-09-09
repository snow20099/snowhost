import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }
    
    await connectToDatabase()
    
    const user = await User.findOne({ email: session.user.email })
    
    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    }
    
    return NextResponse.json({
      balance: user.balance || 0,
      currency: user.currency || 'USD',
      transactions: user.transactions || []
    })
    
  } catch (error) {
    console.error('Error fetching balance:', error)
    return NextResponse.json(
      { error: 'خطأ في جلب رصيد المحفظة' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }
    
    const body = await request.json()
    const { action, amount, description, type } = body

    if (!action || !amount || amount <= 0) {
      return NextResponse.json({ error: 'بيانات غير صحيحة' }, { status: 400 })
    }
    
    await connectToDatabase()
    
    const user = await User.findOne({ email: session.user.email })
    
    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    }
    
    if (action === 'deduct') {
      // Check if user has sufficient balance
      if (user.balance < amount) {
        return NextResponse.json({ 
          error: 'رصيد المحفظة غير كافي',
          currentBalance: user.balance,
          requiredAmount: amount
        }, { status: 400 })
    }
    
      // Add transaction record
      const transaction = {
        id: Date.now().toString(),
        transactionId: `TXN-${Date.now()}`,
      amount: amount,
        type: 'withdrawal',
        method: 'Manual',
      status: 'completed',
        reason: description || 'خصم من المحفظة',
      date: new Date()
    }
    
      // Update user with new balance and transaction
      await User.findOneAndUpdate(
      { email: session.user.email },
      { 
          $inc: { balance: -amount },
        $push: { transactions: transaction }
        }
      )
    
    return NextResponse.json({
        message: 'تم خصم المبلغ بنجاح',
        newBalance: user.balance - amount,
        transaction: transaction
      })

    } else if (action === 'add') {
      // Add amount to balance
      user.balance += amount

      // Add transaction record
      const transaction = {
        id: Date.now().toString(),
        transactionId: `TXN-${Date.now()}`,
        amount: amount,
        type: 'deposit',
        method: 'Manual',
        status: 'completed',
        reason: description || 'إضافة للمحفظة',
        date: new Date()
      }

      // Update user with new balance and transaction
      await User.findOneAndUpdate(
      { email: session.user.email },
        { 
          $inc: { balance: amount },
          $push: { transactions: transaction }
        }
      )
    
    return NextResponse.json({
        message: 'تم إضافة المبلغ بنجاح',
        newBalance: user.balance + amount,
        transaction: transaction
      })

    } else {
      return NextResponse.json({ error: 'إجراء غير صحيح' }, { status: 400 })
    }
    
  } catch (error) {
    console.error('Error updating balance:', error)
    return NextResponse.json(
      { error: 'خطأ في تحديث رصيد المحفظة' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }
    
    const body = await request.json()
    const { amount, type, description, serverId } = body

    if (!amount || amount === 0) {
      return NextResponse.json({ error: 'مبلغ غير صحيح' }, { status: 400 })
    }
    
    await connectToDatabase()
    
    const user = await User.findOne({ email: session.user.email })
    
    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    }

    // إذا كان المبلغ سالب (خصم)، تحقق من الرصيد
    if (amount < 0) {
      const deductAmount = Math.abs(amount)
      if (user.balance < deductAmount) {
        return NextResponse.json({ 
          error: 'رصيد المحفظة غير كافي',
          currentBalance: user.balance,
          requiredAmount: deductAmount
        }, { status: 400 })
      }
    }
    
    // إنشاء سجل المعاملة
    const transaction = {
      id: Date.now().toString(),
      transactionId: `TXN-${Date.now()}`,
      amount: Math.abs(amount),
      type: amount < 0 ? 'withdrawal' : 'deposit',
      method: type || 'Manual',
      status: 'completed',
      reason: description || (amount < 0 ? 'خصم من المحفظة' : 'إضافة للمحفظة'),
      date: new Date(),
      serverId: serverId || null
    }
    
    // إنشاء فاتورة إذا كان الخصم لإنشاء خادم
    let invoice = null
    if (type === 'server_creation' && amount < 0) {
      invoice = {
        id: `INV-${Date.now()}`,
        invoiceNumber: `INV-${Date.now()}`,
        amount: Math.abs(amount),
        status: 'paid',
        service: description || 'إنشاء خادم',
        date: new Date().toISOString(),
        dueDate: new Date().toISOString(),
        description: description || 'فاتورة إنشاء خادم',
        transactionId: transaction.transactionId,
        serverId: serverId || null
      }
    }
    
    // تحديث رصيد المستخدم والمعاملات والفواتير
    const updateData: any = { 
      $inc: { balance: amount },
      $push: { transactions: transaction }
    }
    
    if (invoice) {
      updateData.$push.invoices = invoice
    }
    
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      updateData,
      { new: true }
    )
    
    return NextResponse.json({
      message: amount < 0 ? 'تم خصم المبلغ بنجاح' : 'تم إضافة المبلغ بنجاح',
      newBalance: updatedUser.balance,
      transaction: transaction
    })
    
  } catch (error) {
    console.error('Error updating balance:', error)
    return NextResponse.json(
      { error: 'خطأ في تحديث رصيد المحفظة' },
      { status: 500 }
    )
  }
}