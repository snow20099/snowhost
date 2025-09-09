"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"

interface UserBalance {
  balance: number
  currency: string
}

interface Transaction {
  id: string
  transactionId?: string
  amount: number
  type: string
  method?: string
  reason: string
  date: string
  status: 'pending' | 'completed' | 'failed'
}

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
    label: "Coming Soon",
    labelColor: "bg-gray-500",
    labelIcon: "⏳",
    type: "crypto",
    disabled: true,
    icons: [
      <div key="btc" className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">₿</div>,
      <div key="eth" className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">Ξ</div>,
      <div key="usdt" className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">₮</div>
    ]
  },
  { 
    name: "Stripe Cards", 
    desc: "Visa, MasterCard, Amex",
    label: "Coming Soon",
    labelColor: "bg-gray-500",
    labelIcon: "⏳",
    type: "stripe",
    disabled: true,
    icons: [
      <div key="visa" className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">VISA</div>,
      <div key="mastercard" className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white font-bold text-xs">MC</div>,
      <div key="card" className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center text-white font-bold text-xs">💳</div>
    ]
  },
  { 
    name: "Egyptian Wallets", 
    desc: "Vodafone Cash, Orange, Etisalat",
    label: "Coming Soon",
    labelColor: "bg-gray-500",
    labelIcon: "⏳",
    type: "egyptian",
    disabled: true,
    icons: [
      <div key="vodafone" className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xs">V</div>,
      <div key="orange" className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs">O</div>,
      <div key="etisalat" className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold text-xs">E</div>
    ]
  }
]

export default function WalletPage() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [amount, setAmount] = useState(10)
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState(0)
  const [userBalance, setUserBalance] = useState<UserBalance | null>(null)
  const [loading, setLoading] = useState(true)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // التحقق من حالة الإرجاع من PayPal
  useEffect(() => {
    const success = searchParams.get("success")
    const cancelled = searchParams.get("cancelled")
    const token = searchParams.get("token") // PayPal Order ID
    const payerId = searchParams.get("PayerID")
    
    if (success === "true" && token && payerId) {
      setSuccessMessage("✅ جارٍ معالجة الدفعة...")
      capturePayment(token)
    } else if (success === "true") {
      setSuccessMessage("✅ تم الدفع بنجاح! جارٍ تحديث رصيدك...")
    } else if (cancelled === "true") {
      setError("❌ تم إلغاء عملية الدفع")
    }

    // تنظيف URL بعد المعالجة
    if (success || cancelled) {
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
    }
  }, [searchParams])

  // جلب رصيد المستخدم والمعاملات
  useEffect(() => {
    if (status === 'loading') return
    
    const fetchUserData = async () => {
      try {
        // جلب رصيد المستخدم
        const balanceResponse = await fetch('/api/user/balance')
        if (balanceResponse.ok) {
          const balanceData = await balanceResponse.json()
          setUserBalance(balanceData)
        }

        // جلب المعاملات
        const transactionsResponse = await fetch('/api/user/transactions')
        if (transactionsResponse.ok) {
          const transactionsData = await transactionsResponse.json()
          setTransactions(transactionsData.transactions || [])
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        // استخدام بيانات وهمية في حالة الخطأ
        setUserBalance({ balance: 0, currency: 'USD' })
        setTransactions([])
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [status, successMessage])

  // دالة لالتقاط الدفعة بعد الموافقة من PayPal
  const capturePayment = async (orderID: string) => {
    try {
      const response = await fetch("/api/payment/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderID }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccessMessage(`✅ تم إكمال الدفعة بنجاح! تمت إضافة $${data.amount} إلى رصيدك.`)
        setError(null)
        
        // تحديث الرصيد محلياً
        setUserBalance(prev => prev ? {
          ...prev,
          balance: prev.balance + data.amount
        } : { balance: data.amount, currency: 'USD' })

        // إضافة المعاملة الجديدة
        const newTransaction: Transaction = {
          id: `TXN-${Date.now()}`,
          transactionId: data.captureId,
          amount: data.amount,
          type: 'deposit',
          method: 'PayPal',
          reason: 'PayPal Payment',
          date: new Date().toISOString().split('T')[0],
          status: 'completed'
        }
        setTransactions(prev => [newTransaction, ...prev])

        // إخفاء الرسالة بعد 5 ثوان
        setTimeout(() => setSuccessMessage(null), 5000)
      } else {
        throw new Error(data.error || "فشل في إكمال الدفعة")
      }
    } catch (error) {
      console.error("خطأ في التقاط الدفعة:", error)
      setError(`خطأ في إكمال الدفعة: ${error instanceof Error ? error.message : "خطأ غير معروف"}`)
      setSuccessMessage(null)
    }
  }

  // دالة لمعالجة دفع PayPal
  const handlePayPalPayment = async (paymentAmount: number) => {
    if (!session?.user?.email) {
      throw new Error("يرجى تسجيل الدخول أولاً")
    }

    try {
      const response = await fetch("/api/payment/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: paymentAmount }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "فشل في إنشاء طلب الدفع")
      }

      if (data.success && data.approvalUrl) {
        // إضافة معاملة في حالة الانتظار
        const pendingTransaction: Transaction = {
          id: `TXN-${Date.now()}`,
          transactionId: data.orderID,
          amount: paymentAmount,
          type: 'deposit',
          method: 'PayPal',
          reason: 'PayPal Payment (Pending)',
          date: new Date().toISOString().split('T')[0],
          status: 'pending'
        }
        setTransactions(prev => [pendingTransaction, ...prev])

        // توجيه المستخدم إلى PayPal
        window.location.href = data.approvalUrl
        
        return { success: true, orderId: data.orderID }
      } else {
        throw new Error("لم يتم الحصول على رابط الدفع")
      }
    } catch (error) {
      console.error("خطأ في الدفع:", error)
      throw error
    }
  }

  const handleAddBalance = async () => {
    setPaymentLoading(true)
    setError(null)
    setSuccessMessage(null)
    
    try {
      const selectedMethod = paymentMethods[selected]
      
      if (selectedMethod.disabled) {
        throw new Error(`${selectedMethod.name} غير متاح حالياً`)
      }
      
      switch (selectedMethod.type) {
        case 'paypal':
          await handlePayPalPayment(amount)
          break
        default:
          throw new Error('طريقة دفع غير مدعومة')
      }

      setShowModal(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'فشل في الدفع')
    } finally {
      setPaymentLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mb-4"></div>
          <div className="text-lg">جارٍ تحميل المحفظة...</div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="space-y-8">
        <div className="text-center py-8">
          <div className="text-lg text-red-600">يرجى تسجيل الدخول للوصول إلى المحفظة</div>
        </div>
      </div>
    )
  }

  const balances = [
    { label: "Added Balance", value: `$${userBalance?.balance.toFixed(2) || '0.00'}`, color: "text-slate-400" },
    { label: "Total Balance", value: `$${userBalance?.balance.toFixed(2) || '0.00'}`, color: "text-slate-500" },
    { label: "Cashback Balance", value: "$0.00", color: "text-slate-400" },
  ]

  return (
    <div className="space-y-8">
      {/* رسائل النجاح والخطأ */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
          <button 
            onClick={() => setError(null)} 
            className="float-right text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
        {/* Add Balance Form */}
        <Card className="col-span-1 border-sky-400/30 bg-sky-800/50 backdrop-blur-sm shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg text-white">إضافة رصيد</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 font-medium text-white">المبلغ (USD)</label>
                <Input
                  type="number"
                  min={1}
                  max={10000}
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  className="w-full bg-sky-800/30 border-sky-400/50 text-white placeholder-sky-300 focus:border-sky-400 focus:ring-sky-400"
                  placeholder="أدخل المبلغ"
                />
              </div>
              <Button 
                onClick={() => setShowModal(true)} 
                className="w-full bg-sky-600 hover:bg-sky-700 text-white mt-2"
                disabled={paymentLoading || amount < 1}
              >
                إضافة رصيد
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Balance Cards */}
        <div className="flex flex-col gap-4 col-span-2 md:flex-row md:col-span-2 lg:col-span-2">
          {balances.map((bal, idx) => (
            <Card key={idx} className="flex-1 hover:border-sky-400/50 hover:shadow-lg transition-all duration-200 cursor-pointer border-sky-400/30 bg-sky-800/50 backdrop-blur-sm shadow-2xl">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div className="p-2 rounded-md bg-sky-800/30 border border-sky-400/50 hover:border-sky-400 transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="6" width="20" height="12" rx="2" stroke="#0ea5e9" strokeWidth="2" fill="none"/>
                    <rect x="4" y="8" width="16" height="2" fill="#0ea5e9"/>
                    <circle cx="18" cy="12" r="2" fill="#0ea5e9"/>
                    <rect x="6" y="10" width="8" height="1" fill="#0ea5e9"/>
                  </svg>
                </div>
                <div>
                  <CardTitle className="text-md text-white">{bal.label}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold text-sky-300`}>{bal.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <Card className="mt-8 border-sky-400/30 bg-sky-800/50 backdrop-blur-sm shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">معاملات المحفظة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-sky-400/30">
                  <th className="py-2 px-4 text-left font-semibold text-sky-200">المبلغ</th>
                  <th className="py-2 px-4 text-left font-semibold text-sky-200">النوع</th>
                  <th className="py-2 px-4 text-left font-semibold text-sky-200">الطريقة</th>
                  <th className="py-2 px-4 text-left font-semibold text-sky-200">السبب</th>
                  <th className="py-2 px-4 text-left font-semibold text-sky-200">التاريخ</th>
                  <th className="py-2 px-4 text-left font-semibold text-sky-200">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-sky-400/10 hover:bg-sky-800/30">
                      <td className="py-2 px-4">
                        <span className={tx.type === 'deposit' ? 'text-green-400' : 'text-red-400'}>
                          {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-2 px-4 capitalize text-white">{tx.type === 'deposit' ? 'إيداع' : 'سحب'}</td>
                      <td className="py-2 px-4 text-white">{tx.method || 'غير محدد'}</td>
                      <td className="py-2 px-4 text-white">{tx.reason}</td>
                      <td className="py-2 px-4 text-white">{tx.date}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          tx.status === 'completed' ? 'bg-green-900/50 text-green-300 border border-green-400/30' :
                          tx.status === 'pending' ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-400/30' :
                          'bg-red-900/50 text-red-300 border border-red-400/30'
                        }`}>
                          {tx.status === 'completed' ? 'مكتمل' : tx.status === 'pending' ? 'في الانتظار' : 'فاشل'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-sky-300">لا توجد معاملات</td>
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
          <div className="bg-sky-800/90 backdrop-blur-sm rounded-xl shadow-2xl max-w-lg w-full p-6 relative animate-in fade-in zoom-in border border-sky-400/30">
            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-3 right-3 text-xl text-sky-200 hover:text-white"
              disabled={paymentLoading}
            >
              ×
            </button>
            
            <div className="mb-4 flex items-center justify-between">
              <span className="font-bold text-lg text-white">اختر طريقة الدفع</span>
              <span className="text-sky-200 font-bold text-xl">${amount.toFixed(2)}</span>
            </div>
            
            <div className="mb-4 bg-sky-900/40 text-sky-100 rounded-lg px-4 py-3 text-sm border border-sky-400/50">
              <b className="text-sky-200">معلومة:</b> سيتم توجيهك إلى مزود الدفع لإتمام المعاملة بأمان.
            </div>
            
            <div className="grid grid-cols-1 gap-4 mb-6">
              {paymentMethods.map((method, idx) => (
                <button
                  key={method.name}
                  onClick={() => setSelected(idx)}
                  className={`relative flex items-center justify-between border rounded-lg p-4 transition-all duration-150 shadow-sm focus:outline-none ${
                    selected === idx ? "border-sky-400 bg-sky-900/20" : "border-sky-400/30 bg-sky-800/30 hover:bg-sky-800/50"
                  } ${method.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={paymentLoading || method.disabled}
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
                      <div className="font-semibold text-sm text-white">{method.name}</div>
                      <div className="text-xs text-sky-300 mt-1">{method.desc}</div>
                    </div>
                  </div>
                  
                  {/* Radio indicator */}
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selected === idx ? 'border-sky-400 bg-sky-400' : 'border-sky-400/50'
                  }`}>
                    {selected === idx && <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>}
                  </div>
                </button>
              ))}
            </div>
            
            <Button 
              className="w-full bg-sky-600 hover:bg-sky-700 text-white text-lg" 
              onClick={handleAddBalance}
              disabled={paymentLoading || paymentMethods[selected].disabled}
            >
              {paymentLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  جارٍ المعالجة...
                </span>
              ) : `دفع $${amount.toFixed(2)}`}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
