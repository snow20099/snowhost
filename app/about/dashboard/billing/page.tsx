"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, AlertCircle, CreditCard, DollarSign } from "lucide-react"

interface InvoiceData {
  id: string
  amount: number
  status: string
  service: string
  date: string
}

interface UserData {
  id: string
  name: string
  email: string
  balance: number
  currency: string
  invoices: InvoiceData[]
}

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

export default function BillingPage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedInvoice, setSelectedInvoice] = useState<string>("")
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/profile')
        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }
        const data = await response.json()
        setUserData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid": return "text-green-500"
      case "pending": return "text-yellow-500"
      case "overdue": return "text-red-500"
      default: return "text-gray-500"
    }
  }

  const getStatusBg = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid": return "bg-green-100"
      case "pending": return "bg-yellow-100"
      case "overdue": return "bg-red-100"
      default: return "bg-gray-100"
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid": return "Paid"
      case "pending": return "Pending"
      case "overdue": return "Overdue"
      default: return status
    }
  }

  // Calculate totals
  const totalInvoices = userData?.invoices?.length || 0
  const paidInvoices = userData?.invoices?.filter(inv => inv.status.toLowerCase() === 'paid').length || 0
  const pendingInvoices = userData?.invoices?.filter(inv => inv.status.toLowerCase() === 'pending').length || 0
  const overdueInvoices = userData?.invoices?.filter(inv => inv.status.toLowerCase() === 'overdue').length || 0
  const totalPendingAmount = userData?.invoices
    ?.filter(inv => inv.status.toLowerCase() === 'pending')
    ?.reduce((sum, inv) => sum + inv.amount, 0) || 0

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error || !userData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
          <p className="text-red-500">Failed to load billing data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Billing & Invoices</h1>
        <p className="text-muted-foreground">Manage your invoices and payment history.</p>
      </div>

      {/* Billing Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userData.currency} {userData.balance.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Available balance
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvoices}</div>
            <p className="text-xs text-muted-foreground">
              All time invoices
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userData.currency} {totalPendingAmount.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {pendingInvoices} pending invoices
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paidInvoices}</div>
            <p className="text-xs text-muted-foreground">
              Successfully paid
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>
            {totalInvoices > 0 
              ? `View and manage your billing history (${totalInvoices} invoices)`
              : "No invoices found"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {totalInvoices > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="py-2 px-4 text-left font-semibold">Invoice ID</th>
                    <th className="py-2 px-4 text-left font-semibold">Service</th>
                    <th className="py-2 px-4 text-left font-semibold">Amount</th>
                    <th className="py-2 px-4 text-left font-semibold">Status</th>
                    <th className="py-2 px-4 text-left font-semibold">Date</th>
                    <th className="py-2 px-4 text-left font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-border/30 hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{invoice.id}</td>
                      <td className="py-3 px-4">{invoice.service}</td>
                      <td className="py-3 px-4 font-bold">
                        {userData.currency} {invoice.amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBg(invoice.status)} ${getStatusColor(invoice.status)}`}>
                          {getStatusText(invoice.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(invoice.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        {invoice.status.toLowerCase() === 'pending' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedInvoice(invoice.id)
                              setShowModal(true)
                            }}
                          >
                            Pay Now
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No invoices found</h3>
              <p className="text-muted-foreground">
                You don't have any invoices yet. Invoices will appear here once you create services.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Modal */}
      {showModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-background rounded-xl shadow-xl max-w-lg w-full p-6 relative animate-in fade-in zoom-in">
            <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-xl text-muted-foreground">×</button>
            <div className="mb-4 flex items-center justify-between">
              <span className="font-bold text-lg">Pay Invoice</span>
              <span className="text-blue-600 font-bold">
                {userData.currency} {userData.invoices.find(inv => inv.id === selectedInvoice)?.amount.toFixed(2)}
              </span>
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
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg" onClick={() => setShowModal(false)}>
              Confirm Payment
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 