"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

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

const paymentMethods = [
  { 
    name: "PayPal", 
    desc: "مدفوعات PayPal آمنة",
    label: "آمن",
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
    label: "الأكثر شعبية",
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
    label: "سريع",
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
    label: "محلي",
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
  const { data: session } = useSession();
  const [amount, setAmount] = useState(10)
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState(0)
  const [userBalance, setUserBalance] = useState<UserBalance | null>(null)
  const [loading, setLoading] = useState(true)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

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

  // دالة محسنة لمعالجة دفع PayPal
  const handlePayPalPayment = async (amount: number) => {
    if (amount < 1) {
      setError("المبلغ يجب أن يكون على الأقل 1 دولار");
      return { success: false };
    }

    setPaymentLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/payment/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل إنشاء طلب الدفع');
      }

      const data = await response.json();
      
      if (!data.approvalUrl) {
        throw new Error('لم يتم إنشاء رابط الدفع بشكل صحيح');
      }

      // تأكيد قبل التوجيه إلى PayPal
      const confirmRedirect = window.confirm("سيتم توجيهك إلى PayPal لإتمام عملية الدفع. هل تريد المتابعة؟");
      if (confirmRedirect) {
        window.location.href = data.approvalUrl;
        return { success: true, orderId: data.orderID };
      }
      
      return { success: false };
    } catch (error) {
      console.error('PayPal payment error:', error);
      setError(error instanceof Error ? error.message : 'فشل إنشاء رابط الدفع');
      return { success: false };
    } finally {
      setPaymentLoading(false);
    }
  }

  // دالة محسنة لإضافة الرصيد
  const handleAddBalance = async () => {
    const selectedMethod = paymentMethods[selected];
    
    // إذا كانت طريقة الدفع PayPal، استخدم الدالة المحسنة
    if (selectedMethod.type === 'paypal') {
      setPaymentLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      try {
        const result = await handlePayPalPayment(amount);

        if (result.success) {
          // إضافة معاملة جديدة في حالة الانتظار
          const newTransaction: Transaction = {
            id: `tx_${Date.now()}`,
            amount: amount,
            type: 'deposit',
            reason: `${selectedMethod.name} Payment`,
            date: new Date().toISOString().split('T')[0],
            status: 'pending'
          };
          
          setTransactions(prev => [newTransaction, ...prev]);
          setSuccessMessage("تم بدء عملية الدفع بنجاح! سيتم توجيهك إلى PayPal");
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'فشل عملية الدفع');
      } finally {
        setPaymentLoading(false);
      }
    } else {
      // معالجة طرق الدفع الأخرى
      setPaymentLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      try {
        // محاكاة عملية الدفع لطرق الدفع الأخرى
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // إضافة معاملة جديدة
        const newTransaction: Transaction = {
          id: `tx_${Date.now()}`,
          amount: amount,
          type: 'deposit',
          reason: `${selectedMethod.name} Payment`,
          date: new Date().toISOString().split('T')[0],
          status: 'completed'
        };
        
        setTransactions(prev => [newTransaction, ...prev]);
        
        // تحديث الرصيد
        setUserBalance(prev => prev ? { 
          ...prev, 
          balance: prev.balance + amount 
        } : null);
        
        setSuccessMessage(`تمت عملية الدفع باستخدام ${selectedMethod.name} بنجاح!`);
        setShowModal(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'فشل عملية الدفع');
      } finally {
        setPaymentLoading(false);
      }
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-8">
          <div className="text-xl">جاري تحميل المحفظة...</div>
        </div>
      </div>
    )
  }

  const updatedBalances = [
    { label: "الرصيد المضاف", value: `$${userBalance?.balance.toFixed(2) || '0.00'}`, color: "text-blue-400" },
    { label: "الرصيد الإجمالي", value: `$${userBalance?.balance.toFixed(2) || '0.00'}`, color: "text-blue-500" },
    { label: "رصيد الكاش باك", value: "$0.00", color: "text-blue-400" },
  ]

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
        {/* نموذج إضافة الرصيد */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">إضافة رصيد</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 font-medium">المبلغ (دولار)</label>
                <Input
                  type="number"
                  min={1}
                  max={10000}
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  className="w-full"
                  placeholder="أدخل المبلغ"
                />
              </div>
              <Button 
                onClick={() => setShowModal(true)} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2"
              >
                إضافة رصيد
              </Button>
            </div>
            {error && (
              <div className="mt-2 text-red-500 text-sm">{error}</div>
            )}
            {successMessage && (
              <div className="mt-2 text-green-500 text-sm">{successMessage}</div>
            )}
          </CardContent>
        </Card>

        {/* بطاقات الرصيد */}
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

      {/* جدول المعاملات */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>معاملات المحفظة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="py-2 px-4 text-right font-semibold">المبلغ</th>
                  <th className="py-2 px-4 text-right font-semibold">النوع</th>
                  <th className="py-2 px-4 text-right font-semibold">السبب</th>
                  <th className="py-2 px-4 text-right font-semibold">التاريخ</th>
                  <th className="py-2 px-4 text-right font-semibold">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-border/10 hover:bg-muted/50">
                      <td className="py-2 px-4 text-right">
                        <span className={tx.type === 'deposit' ? 'text-green-500' : 'text-red-500'}>
                          {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-right capitalize">{tx.type === 'deposit' ? 'إيداع' : 'سحب'}</td>
                      <td className="py-2 px-4 text-right">{tx.reason}</td>
                      <td className="py-2 px-4 text-right">{tx.date}</td>
                      <td className="py-2 px-4 text-right">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                          tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {tx.status === 'completed' ? 'مكتمل' : 
                           tx.status === 'pending' ? 'قيد الانتظار' : 'فاشل'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-muted-foreground">لا توجد معاملات</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* نافذة الدفع */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-background rounded-xl shadow-xl max-w-lg w-full p-6 relative animate-in fade-in zoom-in">
            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-3 left-3 text-xl text-muted-foreground hover:text-foreground"
              disabled={paymentLoading}
            >
              ×
            </button>
            
            <div className="mb-4 flex items-center justify-between">
              <span className="font-bold text-lg">اختر طريقة الدفع</span>
              <span className="text-blue-600 font-bold">${amount.toFixed(2)}</span>
            </div>
            
            <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded px-4 py-2 text-sm">
              <b>معلومة:</b> سيتم توجيهك إلى مزود الدفع لإتمام معاملتك بشكل آمن.
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
                  <div className={`absolute top-2 left-2 ${method.labelColor} text-white text-xs px-2 py-1 rounded-full flex items-center gap-1`}>
                    <span>{method.labelIcon}</span>
                    <span>{method.label}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* Icons */}
                    <div className="flex gap-2">
                      {method.icons}
                    </div>
                    
                    <div className="text-right">
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
            
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg" 
              onClick={handleAddBalance}
              disabled={paymentLoading}
            >
              {paymentLoading ? 'جاري المعالجة...' : `ادفع $${amount.toFixed(2)}`}
            </Button>
            
            {error && (
              <div className="mt-3 text-red-500 text-sm text-center">{error}</div>
            )}
            {successMessage && (
              <div className="mt-3 text-green-500 text-sm text-center">{successMessage}</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
