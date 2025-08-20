// ==============================================================================
// File: app/api/payment/paypal/capture-order/route.ts
// ==============================================================================
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"

const paypal = require('@paypal/checkout-server-sdk')

function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID!
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!
  
  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials are missing')
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

    console.log('Capturing PayPal order:', orderID)

    const captureRequest = new paypal.orders.OrdersCaptureRequest(orderID)
    captureRequest.requestBody({})
    
    const capture = await client().execute(captureRequest)
    
    console.log('PayPal capture result:', capture.result.status)

    if (capture.result.status === 'COMPLETED') {
      const amount = parseFloat(capture.result.purchase_units[0].payments.captures[0].amount.value)
      
      console.log('Payment completed, updating user balance:', amount)

      // تحديث رصيد المستخدم
      try {
        await connectToDatabase()
        
        const updatedUser = await User.findOneAndUpdate(
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
                paymentDetails: {
                  paypalOrderId: orderID,
                  paypalCaptureId: capture.result.id,
                  netAmount: amount,
                  fees: 0 // يمكن حساب الرسوم إذا كانت موجودة
                },
                ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
                userAgent: request.headers.get('user-agent') || 'unknown',
                date: new Date(),
                updatedAt: new Date()
              }
            },
            $inc: { 
              'walletStats.totalDeposits': amount,
              'walletStats.paypalTotal': amount,
              'walletStats.totalTransactions': 1,
              'walletStats.currentMonthDeposits': amount
            },
            $set: {
              'walletStats.lastUpdated': new Date(),
              updatedAt: new Date()
            }
          },
          { new: true }
        )

        console.log('User balance updated successfully')

        return NextResponse.json({
          success: true,
          captureId: capture.result.id,
          amount: amount,
          status: 'completed',
          newBalance: updatedUser?.balance || 0
        })
      } catch (dbError) {
        console.error('Database update error:', dbError)
        return NextResponse.json({ 
          error: 'Payment captured but failed to update balance',
          captureId: capture.result.id
        }, { status: 500 })
      }
    } else {
      console.log('Payment not completed, status:', capture.result.status)
      return NextResponse.json({ 
        error: 'Payment not completed', 
        status: capture.result.status 
      }, { status: 400 })
    }

  } catch (error: any) {
    console.error('PayPal capture error:', error)
    
    // معالجة أخطاء محددة من PayPal
    if (error.statusCode) {
      return NextResponse.json({ 
        error: `PayPal API Error: ${error.message}`,
        statusCode: error.statusCode
      }, { status: error.statusCode })
    }
    
    return NextResponse.json({ 
      error: 'Failed to capture PayPal payment',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  }
}

