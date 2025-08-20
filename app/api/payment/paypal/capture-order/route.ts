// ==============================================================================
// File: app/api/payment/paypal/create-order/route.ts
// ==============================================================================
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"

const paypal = require('@paypal/checkout-server-sdk')

function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID!
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!
  
  return process.env.NODE_ENV === 'production' 
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret)
}

function client() {
  return new paypal.core.PayPalHttpClient(environment())
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount } = await request.json()
    
    if (!amount || amount < 1) {
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
          value: amount.toString()
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
    
    return NextResponse.json({
      orderID: order.result.id,
      approvalUrl: order.result.links.find((link: any) => link.rel === 'approve').href
    })

  } catch (error) {
    console.error('PayPal order creation error:', error)
    return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 })
  }
}

// ==============================================================================
// File: app/api/payment/paypal/capture-order/route.ts
// ==============================================================================
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orderID } = await request.json()
    
    const captureRequest = new paypal.orders.OrdersCaptureRequest(orderID)
    captureRequest.requestBody({})
    
    const capture = await client().execute(captureRequest)
    
    if (capture.result.status === 'COMPLETED') {
      const amount = parseFloat(capture.result.purchase_units[0].payments.captures[0].amount.value)
      
      // تحديث رصيد المستخدم
      await connectToDatabase()
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
        }
      )
      
      return NextResponse.json({
        success: true,
        captureId: capture.result.id,
        amount: amount,
        status: 'completed'
      })
    }

    return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })

  } catch (error) {
    console.error('PayPal capture error:', error)
    return NextResponse.json({ error: 'Failed to capture PayPal payment' }, { status: 500 })
  }
}
