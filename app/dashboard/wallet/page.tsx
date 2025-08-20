"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"

// إضافة declaration للـ PayPal SDK
declare global {
  interface Window {
    paypal?: any;
  }
}

interface UserBalance {
  balance: number
  currency: string
}

interface Transaction {
  id: string
  amount: number
  type: string
  reason: string
  date: string
  status: 'pending' | 'completed' | 'failed'
}

const balances = [
  { label: "Added Balance", value: "$0.00", color: "text-blue-400" },
  { label: "Total Balance", value: "$0.00", color: "text-blue-500" },
  { label: "Cashback Balance", value: "$0.00", color: "text-blue-400" },
]

const paymentMethods = [
  { 
    name: "PayPal", 
    desc: "Secure PayPal payments",
    label: "Secure",
    labelColor: "bg-blue-500",
    labelIcon: "🛡️",
    type: "paypal",
    icons: [
      <div key="paypal" className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">P</div>
    ]
  },
  { 
    name: "Cryptocurrency", 
    desc: "Bitcoin, Ethereum, USDT",
    label: "Most Popular",
    labelColor: "bg-purple-500",
    labelIcon: "⭐",
    type: "crypto",
    icons: [
      <div key="btc" className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">₿</div>,
      <div key="eth" className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">Ξ</div>,
      <div key="usdt" className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">₮</div>
    ]
  },
  { 
    name: "Stripe Cards", 
    desc: "Visa, MasterCard, Amex",
    label: "Fast",
    labelColor: "bg-green-500",
    labelIcon: "⚡",
    type: "stripe",
    icons: [
      <div key="visa" className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">VISA</div>,
      <div key="mastercard" className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white font-bold text-xs">MC</div>,
      <div key="card" className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center text-white font-bold text-xs">💳</div>
    ]
  },
  { 
    name: "Egyptian Wallets", 
    desc: "Vodafone Cash, Orange, Etisalat",
    label: "Local",
    labelColor: "bg-red-500",
    labelIcon: "🏛️",
    type: "egyptian",
    icons: [
      <div key="vodafone" className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xs">V</div>,
      <div key="orange" className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs">O</div>,
      <div key="etisalat" className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold text-xs">E</div>
    ]
  }
]

export default function WalletPage() {
  const [amount, setAmount] = useState(100)
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState(0)
  const [userBalance, setUserBalance] = useState<UserBalance | null>(null)
  const [loading, setLoading] = useState(true)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [error, setError] = useState<string | null>(null)
  const [paypalLoaded, setPaypalLoaded] = useState(false)

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        // محاكاة جلب الرصيد من الـ API
        setTimeout(() => {
          setUserBalance({ balance: 250.50, currency: 'USD' })
          setTransactions([
            {
              id: 'tx_001',
              amount: 100,
              type: 'deposit',
              reason: 'PayPal Payment',
              date: '2025-08-18',
              status: 'completed'
            },
            {
              id: 'tx_002',
              amount: 50,
              type: 'withdrawal',
              reason: 'Service Purchase',
              date: '2025-08-17',
              status: 'completed'
            }
          ])
          setLoading(false)
        }, 1500)
      } catch (error) {
        console.error("Error fetching balance:", error)
        setLoading(false)
      }
    }

    fetchBalance()
  }, [])

  // تحميل PayPal SDK عند فتح Modal
  useEffect(() => {
    if (showModal && selected === 0 && !paypalLoaded) { // 0 هو index الـ PayPal
      loadPayPalSDK()
    }
  }, [showModal, selected, paypalLoaded])

  const loadPayPalSDK = () => {
    // تحقق من وجود الـ script مسبقاً
    const existingScript = document.querySelector('script[src*="paypal.com/sdk/js"]')
    if (existingScript) {
      setPaypalLoaded(true)
      renderPayPalButton()
      return
    }

    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`
    script.async = true
    
    script.onload = () => {
      setPaypalLoaded(true)
      renderPayPalButton()
    }
    
    script.onerror = () => {
      setError('Failed to load PayPal SDK')
    }

    document.head.appendChild(script)
  }

  const renderPayPalButton = () => {
    if (!window.paypal) {
      setError('PayPal SDK not loaded')
      return
    }

    // مسح أي buttons موجودة
    const container = document.getElementById('paypal-button-container')
    if (container) {
      container.innerHTML = ''
      
      window.paypal.Buttons({
        createOrder: async (data: any, actions: any) => {
          try {
            const response = await fetch('/api/payment/paypal/create-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ amount })
            })

            if (!response.ok) {
              throw new Error('Failed to create order')
            }

            const { orderID } = await response.json()
            console.log('Order created:', orderID)
            return orderID
          } catch (error) {
            console.error('Error creating order:', error)
            setError('Failed to create PayPal order')
            throw error
          }
        },
        onApprove: async (data: any, actions: any) => {
          try {
            setPaymentLoading(true)
            
            // هنا يمكنك إضافة capture للدفع
            const response = await fetch('/api/payment/paypal/capture-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderID: data.orderID })
            })

            if (response.ok) {
              // إضافة معاملة جديدة
              const newTransaction: Transaction = {
                id: `tx_${Date.now()}`,
                amount: amount,
                type: 'deposit',
                reason: 'PayPal Payment',
                date: new Date().toISOString().split('T')[0],
                status: 'completed'
              }
              
              setTransactions(prev => [newTransaction, ...prev])
              
              // تحديث الرصيد
              if (userBalance) {
                setUserBalance(prev => prev ? { ...prev, balance: prev.balance + amount } : null)
              }
              
              setShowModal(false)
              setError(null)
              alert('Payment completed successfully!')
            } else {
              throw new Error('Payment capture failed')
            }
          } catch (error) {
            console.error('Payment approval error:', error)
            setError('Payment approval failed')
          } finally {
            setPaymentLoading(false)
          }
        },
        onError: (error: any) => {
          console.error('PayPal error:', error)
          setError('PayPal payment failed')
          setPaymentLoading(false)
        },
        onCancel: (data: any) => {
          console.log('Payment cancelled:', data)
          setError('Payment was cancelled')
          setPaymentLoading(false)
        }
      }).render('#paypal-button-container')
    }
  }

  // دالة إنشاء الطلب (للطرق الأخرى)
  const createOrder = async (amount: number) => {
    try {
      const response = await fetch('/api/payment/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order')
      }

      console.log('Order created:', data.orderID)
      return data.orderID
      
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  }

  // دالة لمعالجة دفع الكريبتو
  const handleCryptoPayment = async (amount: number) => {
    try {
      const response = await fetch('/api/payment/crypto/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount,
          currency: 'USD',
          acceptedCoins: ['BTC', 'ETH', 'USDT']
        })
      })
      
      const invoice = await response.json()
      
      // إظهار عنوان المحفظة ومبلغ الدفع
      alert(`Payment Address: ${invoice.address}\nAmount: ${invoice.cryptoAmount} ${invoice.coin}`)
      
      return { success: true, invoiceId: invoice.id }
    } catch (error) {
      throw new Error('Crypto payment failed')
    }
  }

  // دالة لمعالجة دفع Stripe
  const handleStripePayment = async (amount: number) => {
    try {
      const response = await fetch('/api/payment/stripe/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: amount * 100, // Stripe يستخدم cents
          currency: 'usd'
        })
      })
      
      const { sessionId } = await response.json()
      
      // توجيه المستخدم لصفحة Stripe للدفع
      window.location.href = `https://checkout.stripe.com/pay/${sessionId}`
      
      return { success: true, sessionId }
    } catch (error) {
      throw new Error('Stripe payment failed')
    }
  }

  // دالة لمعالجة المحافظ المصرية
  const handleEgyptianWalletPayment = async (amount: number) => {
    try {
      // هذا يحتاج تكامل مع مزودي خدمات الدفع المصريين
      const response = await fetch('/api/payment/egyptian/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, provider: 'vodafone' })
      })
      
      const payment = await response.json()
      alert(`Please send ${amount} EGP to: ${payment.phoneNumber}`)
      
      return { success: true, paymentId: payment.id }
    } catch (error) {
      throw new Error('Egyptian wallet payment failed')
    }
  }

  const handleAddBalance = async () => {
    // إذا كان PayPal مختار، لا نفعل شيء هنا لأن الـ SDK سيتولى الأمر
    if (selected === 0) {
      return
    }

    setPaymentLoading(true)
    setError(null)
    
    try {
      const selectedMethod = paymentMethods[selected]
      let result
      
      switch (selectedMethod.type) {
        case 'crypto':
          result = await handleCryptoPayment(amount)
          break
        case 'stripe':
          result = await handleStripePayment(amount)
          break
        case 'egyptian':
          result = await handleEgyptianWalletPayment(amount)
          break
        default:
          throw new Error('Unsupported payment method')
      }

      if (result.success) {
        // إضافة معاملة جديدة في حالة الانتظار
        const newTransaction: Transaction = {
          id: `tx_${Date.now()}`,
          amount: amount,
          type: 'deposit',
          reason: `${selectedMethod.name} Payment`,
          date: new Date().toISOString().split('T')[0],
          status: 'pending'
        }
        
        setTransactions(prev => [newTransaction, ...prev])
        setShowModal(false)
        
        alert(`Payment initiated successfully! Transaction ID: ${result.invoiceId || result.sessionId}`)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Payment failed')
    } finally {
      setPaymentLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-8">
          <div className="text-white text-xl">Loading wallet...</div>
        </div>
      </div>
    )
  }

  const updatedBalances = [
    { label: "Added Balance", value: `$${userBalance?.balance.toFixed(2) || '0.00'}`, color: "text-blue-400" },
    { label: "Total Balance", value: `$${userBalance?.balance.toFixed(2) || '0.00'}`, color: "text-blue-500" },
    { label: "Cashback Balance", value: "$0.00", color: "text-blue-400" },
  ]

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
        {/* Add Balance Form */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Add Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 font-medium">Amount (USD)</label>
                <Input
                  type="number"
                  min={1}
                  max={10000}
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  className="w-full"
                  placeholder="Enter amount"
                />
              </div>
              <Button 
                onClick={() => setShowModal(true)} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2"
              >
                Add Balance
              </Button>
            </div>
            {error && (
              <div className="mt-2 text-red-500 text-sm">{error}</div>
            )}
          </CardContent>
        </Card>

        {/* Balance Cards */}
        <div className="flex flex-col gap-4 col-span-2 md:flex-row md:col-span-2 lg:col-span-2">
          {updatedBalances.map((bal, idx) => (
            <Card key={idx} className="flex-1 hover:border-blue-600 hover:shadow-lg transition-all duration-200 cursor-pointer">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div className="p-2 rounded-md bg-background border border-blue-600 hover:border-blue-500 transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="6" width="20" height="12" rx="2" stroke="#3b82f6" strokeWidth="2" fill="none"/>
                    <rect x="4" y="8" width="16" height="2" fill="#3b82f6"/>
                    <circle cx="18" cy="12" r="2" fill="#3b82f6"/>
                    <rect x="6" y="10" width="8" height="1" fill="#3b82f6"/>
                  </svg>
                </div>
                <div>
                  <CardTitle className="text-md">{bal.label}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${bal.color}`}>{bal.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Wallet Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="py-2 px-4 text-left font-semibold">Amount</th>
                  <th className="py-2 px-4 text-left font-semibold">Type</th>
                  <th className="py-2 px-4 text-left font-semibold">Reason</th>
                  <th className="py-2 px-4 text-left font-semibold">Date</th>
                  <th className="py-2 px-4 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-border/10 hover:bg-muted/50">
                      <td className="py-2 px-4">
                        <span className={tx.type === 'deposit' ? 'text-green-500' : 'text-red-500'}>
                          {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-2 px-4 capitalize">{tx.type}</td>
                      <td className="py-2 px-4">{tx.reason}</td>
                      <td className="py-2 px-4">{tx.date}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                          tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-muted-foreground">No transactions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-background rounded-xl shadow-xl max-w-lg w-full p-6 relative animate-in fade-in zoom-in">
            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-3 right-3 text-xl text-muted-foreground hover:text-foreground"
              disabled={paymentLoading}
            >
              ×
            </button>
            
            <div className="mb-4 flex items-center justify-between">
              <span className="font-bold text-lg">Select Payment Method</span>
              <span className="text-blue-600 font-bold">${amount.toFixed(2)}</span>
            </div>
            
            <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded px-4 py-2 text-sm">
              <b>Info:</b> You will be redirected to the payment provider to complete your transaction securely.
            </div>
            
            <div className="grid grid-cols-1 gap-4 mb-6">
              {paymentMethods.map((method, idx) => (
                <button
                  key={method.name}
                  onClick={() => setSelected(idx)}
                  className={`relative flex items-center justify-between border rounded-lg p-4 transition-all duration-150 shadow-sm focus:outline-none ${
                    selected === idx ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20" : "border-border/30 bg-background hover:bg-muted/50"
                  }`}
                  disabled={paymentLoading}
                >
                  {/* Label */}
                  <div className={`absolute top-2 right-2 ${method.labelColor} text-white text-xs px-2 py-1 rounded-full flex items-center gap-1`}>
                    <span>{method.labelIcon}</span>
                    <span>{method.label}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* Icons */}
                    <div className="flex gap-2">
                      {method.icons}
                    </div>
                    
                    <div className="text-left">
                      <div className="font-semibold text-sm">{method.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{method.desc}</div>
                    </div>
                  </div>
                  
                  {/* Radio indicator */}
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selected === idx ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                  }`}>
                    {selected === idx && <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>}
                  </div>
                </button>
              ))}
            </div>
            
            {/* PayPal Button Container أو الزر العادي */}
            {selected === 0 ? (
              <div>
                {paypalLoaded ? (
                  <div id="paypal-button-container" className="w-full"></div>
                ) : (
                  <div className="w-full bg-gray-200 rounded p-4 text-center">
                    Loading PayPal...
                  </div>
                )}
              </div>
            ) : (
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg" 
                onClick={handleAddBalance}
                disabled={paymentLoading}
              >
                {paymentLoading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
              </Button>
            )}
            
            {error && (
              <div className="mt-3 text-red-500 text-sm text-center">{error}</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
