// pages/api/payment/paytabs/callback.js أو app/api/payment/paytabs/callback/route.js

import { NextRequest, NextResponse } from 'next/server'

const PAYTABS_CONFIG = {
  serverKey: process.env.PAYTABS_SERVER_KEY,
  profileId: process.env.PAYTABS_PROFILE_ID,
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://secure.paytabs.sa' 
    : 'https://secure-egypt.paytabs.com'
}

// دالة للتحقق من صحة الـ signature (اختيارية للأمان الإضافي)
function verifySignature(data, signature, serverKey) {
  // هذا مثال بسيط - في التطبيق الحقيقي قد تحتاج لخوارزمية أكثر تعقيداً
  // حسب وثائق PayTabs
  return true // مؤقتاً
}

// دالة لحفظ المعاملة في قاعدة البيانات
async function saveTransaction(transactionData) {
  try {
    // هنا يجب أن تحفظ البيانات في قاعدة البيانات الخاصة بك
    // مثال باستخدام Prisma أو أي ORM آخر
    /*
    const transaction = await prisma.transaction.create({
      data: {
        tran_ref: transactionData.tran_ref,
        cart_id: transactionData.cart_id,
        amount: parseFloat(transactionData.cart_amount),
        currency: transactionData.cart_currency,
        status: transactionData.payment_result.response_status === 'A' ? 'completed' : 'failed',
        payment_method: transactionData.payment_result.payment_info?.payment_method || 'unknown',
        customer_email: transactionData.customer_details?.email,
        created_at: new Date(),
        paytabs_response: transactionData
      }
    })
    */
    
    console.log('Transaction saved:', transactionData.tran_ref)
    return true
  } catch (error) {
    console.error('Error saving transaction:', error)
    return false
  }
}

// دالة لتحديث رصيد المستخدم
async function updateUserBalance(email, amount, transactionRef) {
  try {
    // هنا يجب أن تحدث رصيد المستخدم في قاعدة البيانات
    /*
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (user) {
      await prisma.user.update({
        where: { email },
        data: {
          balance: {
            increment: amount
          }
        }
      })
      
      // إنشاء سجل في محفظة المستخدم
      await prisma.walletTransaction.create({
        data: {
          user_id: user.id,
          amount: amount,
          type: 'deposit',
          status: 'completed',
          reference: transactionRef,
          description: 'PayTabs Balance Top-up'
        }
      })
    }
    */
    
    console.log(`Balance updated for ${email}: +${amount}`)
    return true
  } catch (error) {
    console.error('Error updating balance:', error)
    return false
  }
}

// دالة لإرسال إشعار للمستخدم (اختيارية)
async function sendNotification(email, amount, status) {
  try {
    // يمكنك إرسال إيميل أو push notification هنا
    console.log(`Notification sent to ${email}: Payment ${status} - Amount: ${amount}`)
  } catch (error) {
    console.error('Error sending notification:', error)
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    console.log('PayTabs Callback received:', body)
    
    // التحقق من وجود البيانات المطلوبة
    if (!body.tran_ref || !body.payment_result) {
      console.log('Invalid callback data received')
      return NextResponse.json({ status: 'error', message: 'Invalid data' })
    }
    
    const {
      tran_ref,
      cart_id,
      cart_amount,
      cart_currency,
      customer_details,
      payment_result
    } = body
    
    // التحقق من حالة الدفعة
    const paymentStatus = payment_result.response_status
    const isSuccess = paymentStatus === 'A' // A = Authorized/Success
    
    console.log(`Payment ${tran_ref} status: ${paymentStatus} (${isSuccess ? 'Success' : 'Failed'})`)
    
    // حفظ المعاملة في قاعدة البيانات
    const transactionSaved = await saveTransaction(body)
    
    if (!transactionSaved) {
      console.error('Failed to save transaction')
      return NextResponse.json({ 
        status: 'error', 
        message: 'Failed to save transaction' 
      })
    }
    
    // إذا كانت الدفعة ناجحة، قم بتحديث رصيد المستخدم
    if (isSuccess) {
      const amount = parseFloat(cart_amount)
      const customerEmail = customer_details?.email
      
      if (customerEmail && amount > 0) {
        const balanceUpdated = await updateUserBalance(customerEmail, amount, tran_ref)
        
        if (balanceUpdated) {
          // إرسال إشعار نجاح
          await sendNotification(customerEmail, amount, 'successful')
          
          console.log(`Successfully processed payment: ${tran_ref}`)
          return NextResponse.json({ 
            status: 'success', 
            message: 'Payment processed successfully' 
          })
        } else {
          console.error('Failed to update user balance')
          return NextResponse.json({ 
            status: 'error', 
            message: 'Failed to update balance' 
          })
        }
      }
    } else {
      // الدفعة فشلت
      const customerEmail = customer_details?.email
      if (customerEmail) {
        await sendNotification(customerEmail, cart_amount, 'failed')
      }
      
      console.log(`Payment failed: ${tran_ref} - Reason: ${payment_result.response_message}`)
      return NextResponse.json({ 
        status: 'failed', 
        message: 'Payment was not successful' 
      })
    }
    
  } catch (error) {
    console.error('PayTabs Callback Error:', error)
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET method للاختبار
export async function GET(request) {
  return NextResponse.json({ 
    message: 'PayTabs Callback endpoint is working',
    timestamp: new Date().toISOString()
  })
}
