// ==============================================================================
// File: app/api/payment/paypal/capture-order/route.ts
// ==============================================================================
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/database"
import { User } from "@/models/User"
import { Order } from "@/models/Order"

const paypal = require('@paypal/checkout-server-sdk')

function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET
  
  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials are not configured')
  }
  
  return process.env.NODE_ENV === 'production' 
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret)
}

function client() {
  return new paypal.core.PayPalHttpClient(environment())
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orderID } = await request.json()
    
    if (!orderID) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    await connectToDatabase()
    
    // التحقق من أن الطلب ينتمي للمستخدم الحالي
    const existingOrder = await Order.findOne({
      orderID: orderID,
      userEmail: session.user.email
    })
    
    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found or unauthorized" }, { status: 404 })
    }
    
    // التحقق من أن الطلب لم يتم معالجته مسبقاً
    if (existingOrder.status === 'completed') {
      return NextResponse.json({ error: "Order already processed" }, { status: 400 })
    }
    
    const captureRequest = new paypal.orders.OrdersCaptureRequest(orderID)
    captureRequest.requestBody({})
    
    const capture = await client().execute(captureRequest)
    
    if (capture.result.status === 'COMPLETED') {
      const amount = parseFloat(capture.result.purchase_units[0].payments.captures[0].amount.value)
      
      // التحقق من تطابق المبلغ
      if (Math.abs(amount - existingOrder.amount) > 0.01) {
        return NextResponse.json({ error: "Amount mismatch" }, { status: 400 })
      }
      
      // تحديث رصيد المستخدم والطلب في معاملة واحدة
      const session_db = await mongoose.startSession()
      
      try {
        await session_db.withTransaction(async () => {
          // تحديث رصيد المستخدم
          await User.findOneAndUpdate(
            { email: session.user.email },
            { 
              $inc: { balance: amount },
              $push: {
                transactions: {
                  id: `TXN-${Date.now()}`,
                  transactionId: capture.result.id,
                  amount: amount,
                  type: "deposit",
                  method: "PayPal",
                  status: "completed",
                  reason: "PayPal Payment",
                  date: new Date()
                }
              }
            },
            { session: session_db }
          )
          
          // تحديث حالة الطلب
          await Order.findOneAndUpdate(
            { orderID: orderID },
            { 
              status: 'completed',
              captureId: capture.result.id,
              completedAt: new Date()
            },
            { session: session_db }
          )
        })
      } finally {
        await session_db.endSession()
      }
      
      return NextResponse.json({
        success: true,
        captureId: capture.result.id,
        amount: amount,
        status: 'completed'
      })
    } else {
      // تحديث حالة الطلب إلى فاشل
      await Order.findOneAndUpdate(
        { orderID: orderID },
        { status: 'failed', failedAt: new Date() }
      )
      
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
    }
  } catch (error) {
    console.error('PayPal capture error:', error)
    
    // تحديث حالة الطلب إلى فاشل في حالة الخطأ
    try {
      const { orderID } = await request.json()
      await Order.findOneAndUpdate(
        { orderID: orderID },
        { status: 'failed', failedAt: new Date() }
      )
    } catch (e) {
      console.error('Failed to update order status:', e)
    }
    
    return NextResponse.json({ error: 'Failed to capture PayPal payment' }, { status: 500 })
  }
}
