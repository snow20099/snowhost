// ==============================================================================
// File: app/api/payment/stripe/webhook/route.ts
// ==============================================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const sig = request.headers.get('stripe-signature')!
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!
    
    let event
    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        
        const amount = parseFloat(session.metadata.amount)
        const userEmail = session.metadata.user_email
        
        if (userEmail && amount > 0) {
          await connectToDatabase()
          await User.findOneAndUpdate(
            { email: userEmail },
            { 
              $inc: { balance: amount },
              $push: {
                transactions: {
                  id: `TXN-${Date.now()}`,
                  transactionId: session.id,
                  amount: amount,
                  type: "deposit",
                  method: "Stripe",
                  status: "completed",
                  reason: "Card Payment",
                  date: new Date()
                }
              }
            }
          )
          console.log(`Stripe payment completed for ${userEmail}: $${amount}`)
        }
        break
        
      case 'payment_intent.payment_failed':
        console.log('Stripe payment failed:', event.data.object.id)
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
