import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'

// GET: Get all invoices for the user
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
      invoices: user.invoices || [],
      total: user.invoices?.length || 0
    })
    
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json(
      { error: 'خطأ في جلب الفواتير' },
      { status: 500 }
    )
  }
}

// POST: Create a new invoice
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }
    
    const body = await request.json()
    const { amount, service, description, type, dueDate, autoRenewal } = body

    if (!amount || !service) {
      return NextResponse.json({ error: 'بيانات غير صحيحة' }, { status: 400 })
    }
    
    await connectToDatabase()
    
    const user = await User.findOne({ email: session.user.email })
    
    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    }
    
    // Create new invoice
    const invoice = {
      id: `INV-${Date.now()}`,
      invoiceNumber: `INV-${Date.now()}`,
      amount: amount,
      status: 'pending',
      service: service,
      date: new Date().toISOString(),
      dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      description: description || `فاتورة ${service}`,
      type: type || 'service',
      autoRenewal: autoRenewal || false,
      nextBillingDate: autoRenewal ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null
    }
    
    // Add invoice to user
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $push: { invoices: invoice } },
      { new: true }
    )
    
    return NextResponse.json({
      message: 'تم إنشاء الفاتورة بنجاح',
      invoice: invoice
    })
    
  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json(
      { error: 'خطأ في إنشاء الفاتورة' },
      { status: 500 }
    )
  }
}

// PUT: Update invoice status
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }
    
    const body = await request.json()
    const { invoiceId, status } = body

    if (!invoiceId || !status) {
      return NextResponse.json({ error: 'بيانات غير صحيحة' }, { status: 400 })
    }
    
    await connectToDatabase()
    
    // Update invoice status
    const updatedUser = await User.findOneAndUpdate(
      { 
        email: session.user.email,
        'invoices.id': invoiceId
      },
      { 
        $set: { 'invoices.$.status': status }
      },
      { new: true }
    )
    
    if (!updatedUser) {
      return NextResponse.json({ error: 'لم يتم العثور على الفاتورة' }, { status: 404 })
    }
    
    return NextResponse.json({
      message: 'تم تحديث حالة الفاتورة بنجاح',
      status: status
    })
    
  } catch (error) {
    console.error('Error updating invoice:', error)
    return NextResponse.json(
      { error: 'خطأ في تحديث الفاتورة' },
      { status: 500 }
    )
  }
} 