// app/api/payment/paytabs/create-payment/route.ts

import { NextRequest, NextResponse } from 'next/server'

interface CustomerDetails {
  name?: string
  email: string
  phone: string
  address?: string
  city?: string
  state?: string
  country?: string
  zip?: string
  user_id?: string
}

interface PaymentRequest {
  amount: number
  currency?: string
  customer: CustomerDetails
  callback_url: string
  return_url: string
}

const PAYTABS_CONFIG = {
  serverKey: process.env.PAYTABS_SERVER_KEY!, // ضعه في .env.local
  profileId: process.env.PAYTABS_PROFILE_ID!, // ضعه في .env.local
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://secure.paytabs.sa' 
    : 'https://secure-egypt.paytabs.com' // أو sandbox URL
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentRequest = await request.json()
    const { amount, currency = 'SAR', customer, callback_url, return_url } = body

    // التحقق من البيانات المطلوبة
    if (!amount || !customer?.email || !customer?.phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // إعداد بيانات الدفع لـ PayTabs
    const paymentData = {
      profile_id: PAYTABS_CONFIG.profileId,
      tran_type: 'sale',
      tran_class: 'ecom',
      cart_id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      cart_description: `Add Balance - ${amount}`,
      cart_currency: currency,
      cart_amount: parseFloat(amount.toString()),
      
      // بيانات العميل
      customer_details: {
        name: customer.name || 'Customer',
        email: customer.email,
        phone: customer.phone,
        street1: customer.address || 'N/A',
        city: customer.city || 'Riyadh',
        state: customer.state || 'Riyadh',
        country: customer.country || 'SA',
        zip: customer.zip || '12345'
      },

      // URLs للعودة والتأكيد
      callback: callback_url,
      return: return_url,

      // إعدادات إضافية
      hide_shipping: true,
      framed: true,
      user_defined: {
        user_id: customer.user_id || null,
        order_type: 'wallet_topup'
      }
    }

    // إرسال الطلب لـ PayTabs
    const response = await fetch(`${PAYTABS_CONFIG.baseUrl}/payment/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': PAYTABS_CONFIG.serverKey
      },
      body: JSON.stringify(paymentData)
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('PayTabs API Error:', errorData)
      return NextResponse.json(
        { error: 'Payment creation failed', details: errorData },
        { status: 400 }
      )
    }

    const result = await response.json()

    // التحقق من نجاح إنشاء الدفعة
    if (result.response_code === 4012) {
      return NextResponse.json({
        success: true,
        payment_url: result.redirect_url,
        tran_ref: result.tran_ref,
        cart_id: paymentData.cart_id
      })
    } else {
      return NextResponse.json(
        { 
          error: 'Payment creation failed', 
          message: result.result,
          code: result.response_code 
        },
        { status: 400 }
      )
    }

  } catch (error: any) {
    console.error('PayTabs Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

// GET method للتحقق من حالة الدفعة
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tranRef = searchParams.get('tran_ref')

    if (!tranRef) {
      return NextResponse.json(
        { error: 'Transaction reference is required' },
        { status: 400 }
      )
    }

    // التحقق من حالة الدفعة
    const verifyData = {
      profile_id: PAYTABS_CONFIG.profileId,
      tran_ref: tranRef
    }

    const response = await fetch(`${PAYTABS_CONFIG.baseUrl}/payment/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': PAYTABS_CONFIG.serverKey
      },
      body: JSON.stringify(verifyData)
    })

    const result = await response.json()
    
    return NextResponse.json(result)

  } catch (error: any) {
    console.error('PayTabs Verification Error:', error)
    return NextResponse.json(
      { error: 'Verification failed', message: error.message },
      { status: 500 }
    )
  }
}
