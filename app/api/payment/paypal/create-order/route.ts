// ==============================================================================
// File: app/api/payment/paypal/create-order/route.ts
// ==============================================================================
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth" // تأكد من المسار الصحيح
import { connectToDatabase } from "@/lib/database"
import { Order } from "@/models/Order" // أو النموذج المناسب

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

    const { amount } = await request.json()
    
    if (!amount || amount < 1 || amount > 10000) { // حد أقصى للأمان
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    const orderRequest = new paypal.orders.OrdersCreateRequest()
    orderRequest.prefer("return=representation")
    orderRequest.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: `wallet_${session.user.email}_${Date.now()}`,
        amount: {
          currency_code: 'USD',
          value: amount.toFixed(2) // تأكد من التنسيق الصحيح
        },
        description: 'Wallet Balance Top-up'
      }],
      application_context: {
        brand_name: 'Your App Name',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`
      }
    })

    const order = await client().execute(orderRequest)
    
    // حفظ الطلب في قاعدة البيانات للتحقق لاحقاً
    await connectToDatabase()
    await Order.create({
      orderID: order.result.id,
      userEmail: session.user.email,
      amount: amount,
      status: 'created',
      createdAt: new Date()
    })
    
    return NextResponse.json({
      orderID: order.result.id,
      approvalUrl: order.result.links.find((link: any) => link.rel === 'approve')?.href
    })
  } catch (error) {
    console.error('PayPal order creation error:', error)
    return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 })
  }
}
