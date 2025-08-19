// ==============================================================================
// File: app/api/payment/stripe/create-session/route.ts
// ==============================================================================
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount } = await request.json()
    
    if (!amount || amount < 0.5) {
      return NextResponse.json({ error: "Minimum amount is $0.50" }, { status: 400 })
    }

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Wallet Balance Top-up',
            description: `Add $${amount.toFixed(2)} to your wallet balance`
          },
          unit_amount: Math.round(amount * 100), // تحويل للـ cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
      metadata: {
        user_email: session.user.email,
        type: 'wallet_topup',
        amount: amount.toString()
      }
    })

    return NextResponse.json({
      sessionId: stripeSession.id,
      url: stripeSession.url
    })

  } catch (error) {
    console.error('Stripe session creation error:', error)
    return NextResponse.json({ error: 'Failed to create Stripe session' }, { status: 500 })
  }
}
