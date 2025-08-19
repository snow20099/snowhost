// ==============================================================================
// File: app/api/payment/crypto/create-invoice/route.ts
// ==============================================================================
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount, currency = 'USD' } = await request.json()
    
    if (!amount || amount < 1) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    const COINGATE_API_URL = process.env.NODE_ENV === 'production' 
      ? 'https://api.coingate.com/v2'
      : 'https://api-sandbox.coingate.com/v2'
    
    const invoiceData = {
      order_id: `wallet_${session.user.email}_${Date.now()}`,
      price_amount: amount,
      price_currency: currency,
      receive_currency: 'BTC',
      title: 'Wallet Balance Top-up',
      description: `Add $${amount} to wallet balance`,
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/crypto/callback`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
      token: process.env.COINGATE_API_TOKEN
    }

    const response = await fetch(`${COINGATE_API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.COINGATE_API_TOKEN}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(invoiceData).toString()
    })

    if (!response.ok) {
      throw new Error('Failed to create CoinGate invoice')
    }

    const invoice = await response.json()

    return NextResponse.json({
      id: invoice.id,
      orderId: invoice.order_id,
      paymentUrl: invoice.payment_url,
      address: invoice.payment_address,
      cryptoAmount: invoice.pay_amount,
      coin: invoice.pay_currency,
      qrCode: invoice.qr_code,
      expiresAt: invoice.expires_at
    })

  } catch (error) {
    console.error('Crypto invoice creation error:', error)
    return NextResponse.json({ error: 'Failed to create crypto invoice' }, { status: 500 })
  }
}
