// ==============================================================================
// File: /api/payment/crypto/check-status/[invoiceId].js
// ==============================================================================

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { invoiceId } = req.query;

    const response = await axios.get(`${COINGATE_API_URL}/orders/${invoiceId}`, {
      headers: {
        'Authorization': `Token ${COINGATE_API_TOKEN}`
      }
    });

    const order = response.data;

    // Update database status
    // await updateCryptoInvoiceStatus(invoiceId, order.status);

    if (order.status === 'paid') {
      // Update user balance
      // await updateUserBalance(order.user_id, parseFloat(order.price_amount));
    }

    res.status(200).json({
      status: order.status,
      amount: order.price_amount,
      currency: order.price_currency,
      paidAmount: order.paid_amount,
      paidCurrency: order.pay_currency
    });

  } catch (error) {
    console.error('Crypto status check error:', error);
    res.status(500).json({ error: 'Failed to check payment status' });
  }
}
