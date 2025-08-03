"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"

interface UserBalance {
  balance: number
  currency: string
}

const balances = [
  { label: "Added Balance", value: "$0.00", color: "text-blue-400" },
  { label: "Total Balance", value: "$0.00", color: "text-blue-500" },
  { label: "Cashback Balance", value: "$0.00", color: "text-blue-400" },
]

const paymentMethods = [
  { 
    name: "Cryptocurrency", 
    desc: "Bitcoin, Ethereum, USDT",
    label: "Most Popular",
    labelColor: "bg-purple-500",
    labelIcon: "⭐",
    icons: [
      <div key="btc" className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">₿</div>,
      <div key="eth" className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">Ξ</div>,
      <div key="usdt" className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">₮</div>
    ]
  },
  { 
    name: "Egyptian Wallets", 
    desc: "Vodafone Cash, Orange, Etisalat, WE",
    label: "Fast",
    labelColor: "bg-green-500",
    labelIcon: "⚡",
    icons: [
      <div key="vodafone" className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xs">V</div>,
      <div key="orange" className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs">O</div>,
      <div key="etisalat" className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold text-xs">E</div>,
      <div key="we" className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">W</div>
    ]
  },
  { 
    name: "Visa / MasterCard", 
    desc: "Credit cards",
    label: "Secure",
    labelColor: "bg-blue-400",
    labelIcon: "🛡️",
    icons: [
      <div key="visa" className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">VISA</div>,
      <div key="mastercard" className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white font-bold text-xs">MC</div>,
      <div key="card" className="w-8 h-8 bg-blue-300 rounded flex items-center justify-center text-white font-bold text-xs">💳</div>
    ]
  },
  { 
    name: "Apple Pay", 
    desc: "One-touch payment",
    label: "Exclusive",
    labelColor: "bg-orange-500",
    labelIcon: "",
    icons: [
      <div key="apple" className="w-8 h-8 bg-black rounded flex items-center justify-center text-white font-bold text-xs">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-2.01 2.5-3.12 2.5-1.26 0-1.8-.79-3.38-.79-1.59 0-2.12.79-3.38.79-1.11 0-2.29-1.26-3.12-2.5-1.66-2.48-2.94-7.02-2.94-7.02s1.18-1.5 2.94-1.5c1.26 0 2.12.79 3.38.79 1.26 0 2.12-.79 3.38-.79 1.76 0 2.94 1.5 2.94 1.5s-1.28 4.54-2.94 7.02z"/>
          <path d="M12 2c0 1.5-1.5 2.5-3 2.5s-3-1-3-2.5 1.5-2.5 3-2.5 3 1 3 2.5z"/>
        </svg>
      </div>
    ]
  }
]

export default function WalletPage() {
  const [amount, setAmount] = useState(100)
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState(0)
  const [userBalance, setUserBalance] = useState<UserBalance | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch('/api/user/balance')
        if (response.ok) {
          const data = await response.json()
          setUserBalance(data)
        }
      } catch (error) {
        console.error("Error fetching balance:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBalance()
  }, [])

  const handleAddBalance = async () => {
    try {
      const response = await fetch('/api/user/balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          paymentMethod: paymentMethods[selected].name
        })
      })

      if (response.ok) {
        const result = await response.json()
        setUserBalance(prev => prev ? { ...prev, balance: result.newBalance } : null)
        setShowModal(false)
        // Refresh balance
        const balanceResponse = await fetch('/api/user/balance')
        if (balanceResponse.ok) {
          const data = await balanceResponse.json()
          setUserBalance(data)
        }
      }
    } catch (error) {
      console.error("Error adding balance:", error)
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
    { label: "Added Balance", value: `$${userBalance?.balance || 0}`, color: "text-blue-400" },
    { label: "Total Balance", value: `$${userBalance?.balance || 0}`, color: "text-blue-500" },
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
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); setShowModal(true); }}>
              <div>
                <label className="block text-sm mb-1 font-medium">Amount (USD)</label>
                <Input
                  type="number"
                  min={1}
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  className="w-full"
                  placeholder="$"
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2">Confirm</Button>
            </form>
          </CardContent>
        </Card>
        {/* Balance Cards */}
        <div className="flex flex-col gap-4 col-span-2 md:flex-row md:col-span-2 lg:col-span-2">
          {updatedBalances.map((bal, idx) => (
            <Card key={idx} className="flex-1 hover:border-blue-600 hover:shadow-lg transition-all duration-200 cursor-pointer">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div className="p-2 rounded-md bg-background border border-blue-600 hover:border-blue-500 transition-colors">
                  {/* Real wallet icon */}
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
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} className="py-6 text-center text-muted-foreground">No transactions found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-background rounded-xl shadow-xl max-w-lg w-full p-6 relative animate-in fade-in zoom-in">
            <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-xl text-muted-foreground">×</button>
            <div className="mb-4 flex items-center justify-between">
              <span className="font-bold text-lg">Pay Invoice</span>
              <span className="text-blue-600 font-bold">${amount.toFixed(2)}</span>
            </div>
            <div className="mb-4 bg-yellow-100 text-yellow-800 rounded px-4 py-2 text-sm">
              <b>Note:</b> Some fees may be added to the total invoice as compensation for payment fees.
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {paymentMethods.map((method, idx) => (
                <button
                  key={method.name}
                  onClick={() => setSelected(idx)}
                  className={`relative flex flex-col items-center justify-center border rounded-lg p-4 transition-all duration-150 shadow-sm focus:outline-none ${selected === idx ? "border-blue-600 bg-gray-800" : "border-border/30 bg-background"}`}
                >
                  {/* Label */}
                  <div className={`absolute top-2 right-2 ${method.labelColor} text-white text-xs px-2 py-1 rounded-full flex items-center gap-1`}>
                    <span>{method.labelIcon}</span>
                    <span>{method.label}</span>
                  </div>
                  
                  {/* Icons */}
                  <div className="flex gap-2 mb-3">
                    {method.icons}
                  </div>
                  
                  <span className="font-semibold text-sm">{method.name}</span>
                  <span className="text-xs text-muted-foreground mt-1 text-center">{method.desc}</span>
                </button>
              ))}
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg" onClick={handleAddBalance}>
              Confirm
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 