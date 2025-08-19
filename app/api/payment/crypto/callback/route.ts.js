// ==============================================================================
// File: app/api/payment/crypto/callback/route.ts
// ==============================================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, order_id, status, price_amount, price_currency } = body

    console.log('Crypto payment callback:', body)

    if (status === 'paid') {
      // استخراج البريد الإلكتروني من order_id
      const orderParts = order_id.split('_')
      if (orderParts.length >= 2) {
        const userEmail = orderParts[1]
        const amount = parseFloat(price_amount)
        
        await connectToDatabase()
        await User.findOneAndUpdate(
          { email: userEmail },
          { 
            $inc: { balance: amount },
            $push: {
              transactions: {
                id: `TXN-${Date.now()}`,
                transactionId: id,
                amount: amount,
                type: "deposit",
                method: "Cryptocurrency",
                status: "completed",
                reason: "Crypto Payment",
                date: new Date()
              }
            }
          }
        )
        
        console.log(`Crypto payment completed for ${userEmail}: $${amount}`)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Crypto callback error:', error)
    return NextResponse.json({ error: 'Callback processing failed' }, { status: 500 })
  }
}
