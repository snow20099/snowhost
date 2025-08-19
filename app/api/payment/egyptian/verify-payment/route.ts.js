// ==============================================================================
// File: app/api/payment/egyptian/verify-payment/route.ts
// ==============================================================================
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { paymentId, transactionReference, amount } = await request.json()

    if (!paymentId || !transactionReference || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // التحقق من صحة رقم العملية (تحقق أساسي)
    const isValid = transactionReference.length >= 8 && /^\d+$/.test(transactionReference)

    if (isValid) {
      await connectToDatabase()
      
      // التحقق من عدم استخدام رقم العملية من قبل
      const existingTx = await User.findOne({
        'transactions.transactionId': transactionReference
      })

      if (existingTx) {
        return NextResponse.json({
          success: false,
          message: 'رقم العملية مُستخدم من قبل'
        }, { status: 400 })
      }

      // إضافة الرصيد
      await User.findOneAndUpdate(
        { email: session.user.email },
        { 
          $inc: { balance: amount },
          $push: {
            transactions: {
              id: `TXN-${Date.now()}`,
              transactionId: transactionReference,
              amount: amount,
              type: "deposit",
              method: "Egyptian Wallet",
              status: "completed",
              reason: "Egyptian Wallet Payment",
              date: new Date()
            }
          }
        }
      )

      return NextResponse.json({
        success: true,
        status: 'verified',
        message: 'تم التحقق من الدفع بنجاح'
      })
    } else {
      return NextResponse.json({
        success: false,
        status: 'invalid',
        message: 'رقم العملية غير صحيح'
      }, { status: 400 })
    }

  } catch (error) {
    console.error('Egyptian payment verification error:', error)
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 })
  }
}