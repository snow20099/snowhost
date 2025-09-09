import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'

interface Invoice {
  id: string
  invoiceNumber: string
  amount: number
  status: string
  service: string
  date: string
  dueDate: string
  description: string
  type: string
  autoRenewal: boolean
  nextBillingDate: string | null
  serverId?: string
  planId?: string
}

// POST: Create monthly invoices for active services
export async function POST(request: NextRequest) {
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
    
    // Get user's active servers
    const activeServers = user.servers || []
    const newInvoices: Invoice[] = []
    
    // Create monthly invoices for each active server
    for (const server of activeServers) {
      if (server.status === 'active' && server.plan) {
        const invoice: Invoice = {
          id: `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          invoiceNumber: `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          amount: server.plan.price || 0,
          status: 'pending',
          service: `خادم ${server.plan.name} - ${server.name}`,
          date: new Date().toISOString(),
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          description: `فاتورة شهرية لخادم ${server.plan.name}`,
          type: 'monthly_service',
          autoRenewal: true,
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          serverId: server.id,
          planId: server.plan.id
        }
        
        newInvoices.push(invoice)
      }
    }
    
    if (newInvoices.length === 0) {
      return NextResponse.json({
        message: 'لا توجد خدمات نشطة تحتاج فواتير شهرية',
        invoices: []
      })
    }
    
    // Add all invoices to user
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $push: { invoices: { $each: newInvoices } } },
      { new: true }
    )
    
    return NextResponse.json({
      message: `تم إنشاء ${newInvoices.length} فاتورة شهرية بنجاح`,
      invoices: newInvoices,
      total: updatedUser.invoices.length
    })
    
  } catch (error) {
    console.error('Error creating monthly invoices:', error)
    return NextResponse.json(
      { error: 'خطأ في إنشاء الفواتير الشهرية' },
      { status: 500 }
    )
  }
}

// GET: Get monthly invoices
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
    
    // Filter monthly invoices
    const monthlyInvoices = (user.invoices || []).filter((invoice: Invoice) => 
      invoice.type === 'monthly_service' || invoice.type === 'server_creation'
    )
    
    return NextResponse.json({
      invoices: monthlyInvoices,
      total: monthlyInvoices.length
    })
    
  } catch (error) {
    console.error('Error fetching monthly invoices:', error)
    return NextResponse.json(
      { error: 'خطأ في جلب الفواتير الشهرية' },
      { status: 500 }
    )
  }
} 