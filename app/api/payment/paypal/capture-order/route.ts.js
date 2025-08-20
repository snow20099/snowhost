import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { connectToDatabase } from "@/lib/db"
import { User } from "@/models/User"

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

    const { orderID } = await request.json()
    
    if (!orderID) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }
    
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
