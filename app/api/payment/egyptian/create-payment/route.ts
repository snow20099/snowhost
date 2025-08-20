// ==============================================================================
// File: app/api/payment/egyptian/create-payment/route.ts
// ==============================================================================
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount, provider = 'vodafone' } = await request.json()
    
    if (!amount || amount < 1) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // تحويل الدولار للجنيه المصري
    const exchangeRate = 31 // يفضل جلب السعر من API حقيقي
    const amountEGP = Math.ceil(amount * exchangeRate)

    const paymentMethods: Record<string, any> = {
      vodafone: {
        phoneNumber: '01000000000',
        instructions: 'أرسل المبلغ لرقم فودافون كاش وأرسل لنا رقم العملية'
      },
      orange: {
        phoneNumber: '01100000000', 
        instructions: 'أرسل المبلغ لرقم أورانج موني وأرسل لنا رقم العملية'
      },
      etisalat: {
        phoneNumber: '01200000000',
        instructions: 'أرسل المبلغ لرقم اتصالات كاش وأرسل لنا رقم العملية'
      }
    }

    const paymentMethod = paymentMethods[provider]
    if (!paymentMethod) {
      return NextResponse.json({ error: 'Invalid payment provider' }, { status: 400 })
    }

    const paymentId = `egy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return NextResponse.json({
      id: paymentId,
      provider: provider,
      phoneNumber: paymentMethod.phoneNumber,
      amountEGP: amountEGP,
      amountUSD: amount,
      instructions: paymentMethod.instructions,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()
    })

  } catch (error) {
    console.error('Egyptian payment creation error:', error)
    return NextResponse.json({ error: 'Failed to create payment request' }, { status: 500 })
  }
}
