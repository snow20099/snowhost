"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Loader2, AlertCircle, CreditCard, DollarSign, FileText, Clock, CheckCircle, XCircle, Download, Eye, Search, Filter } from "lucide-react"

interface InvoiceData {
  id: string
  amount: number
  status: string
  service: string
  date: string
  dueDate?: string
  description?: string
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
    label: "الأكثر شعبية",
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
    label: "سريع",
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
    label: "آمن",
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
    label: "حصري",
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
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/dashboard')
        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }
        const data = await response.json()
        console.log('Billing page - User data received:', data);
        console.log('Billing page - Invoices count:', data.invoices?.length || 0);
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
      case "paid": return "text-green-600"
      case "pending": return "text-yellow-600"
      case "overdue": return "text-red-600"
      default: return "text-gray-600"
    }
  }

  const getStatusBg = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid": return "bg-green-50 dark:bg-green-950/30"
      case "pending": return "bg-yellow-50 dark:bg-yellow-950/30"
      case "overdue": return "bg-red-50 dark:bg-red-950/30"
      default: return "bg-gray-50 dark:bg-gray-950/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid": return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending": return <Clock className="h-4 w-4 text-yellow-600" />
      case "overdue": return <XCircle className="h-4 w-4 text-red-600" />
      default: return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid": return "مدفوع"
      case "pending": return "في الانتظار"
      case "overdue": return "متأخر"
      default: return status
    }
  }

  // Filter invoices based on search and status
  const filteredInvoices = userData?.invoices?.filter(invoice => {
    const matchesSearch = invoice.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || invoice.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  }) || []

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
          <p className="text-red-500">فشل في تحميل بيانات الفواتير</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-display font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          الفواتير والمدفوعات
        </h1>
        <p className="text-xl text-muted-foreground">
          إدارة فواتيرك وسجل المدفوعات
        </p>
      </div>

      {/* Billing Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-sky-400/30 bg-sky-800/50 backdrop-blur-sm shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-white">رصيد الحساب</CardTitle>
            <div className="w-10 h-10 bg-sky-600 rounded-full flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-sky-300 mb-1">
              {userData.currency} {userData.balance.toFixed(2)}
            </div>
            <p className="text-sm text-sky-200">
              الرصيد المتاح
            </p>
          </CardContent>
        </Card>

        <Card className="border-sky-400/30 bg-sky-800/50 backdrop-blur-sm shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-white">إجمالي الفواتير</CardTitle>
            <div className="w-10 h-10 bg-sky-600 rounded-full flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-sky-300 mb-1">{totalInvoices}</div>
            <p className="text-sm text-sky-200">
              جميع الفواتير
            </p>
          </CardContent>
        </Card>

        <Card className="border-sky-400/30 bg-sky-800/50 backdrop-blur-sm shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-white">المبلغ المعلق</CardTitle>
            <div className="w-10 h-10 bg-sky-600 rounded-full flex items-center justify-center">
              <Clock className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-sky-300 mb-1">
              {userData.currency} {totalPendingAmount.toFixed(2)}
            </div>
            <p className="text-sm text-sky-200">
              {pendingInvoices} فاتورة معلقة
            </p>
          </CardContent>
        </Card>

        <Card className="border-sky-400/30 bg-sky-800/50 backdrop-blur-sm shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-white">الفواتير المدفوعة</CardTitle>
            <div className="w-10 h-10 bg-sky-600 rounded-full flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-sky-300 mb-1">{paidInvoices}</div>
            <p className="text-sm text-sky-200">
              تم الدفع بنجاح
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Section */}
      <Card className="border-sky-400/30 bg-sky-800/50 backdrop-blur-sm shadow-2xl">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sky-300" />
              <Input
                placeholder="البحث في الفواتير..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-sky-800/30 border-sky-400/50 text-white placeholder-sky-300 focus:border-sky-400 focus:ring-sky-400"
              />
            </div>
            
            {/* Status Filter */}
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
                className={statusFilter === "all" ? "bg-sky-600 hover:bg-sky-700 text-white" : "border-sky-400/50 text-sky-200 hover:bg-sky-800/30"}
              >
                الكل
              </Button>
              <Button
                variant={statusFilter === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("pending")}
                className={statusFilter === "pending" ? "bg-sky-600 hover:bg-sky-700 text-white" : "border-sky-400/50 text-sky-200 hover:bg-sky-800/30"}
              >
                في الانتظار
              </Button>
              <Button
                variant={statusFilter === "paid" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("paid")}
                className={statusFilter === "paid" ? "bg-sky-600 hover:bg-sky-700 text-white" : "border-sky-400/50 text-sky-200 hover:bg-sky-800/30"}
              >
                مدفوع
              </Button>
              <Button
                variant={statusFilter === "overdue" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("overdue")}
                className={statusFilter === "overdue" ? "bg-sky-600 hover:bg-sky-700 text-white" : "border-sky-400/50 text-sky-200 hover:bg-sky-800/30"}
              >
                متأخر
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card className="border-sky-400/30 bg-sky-800/50 backdrop-blur-sm shadow-2xl">
        <CardHeader className="bg-sky-900/30 border-b border-sky-400/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-white">الفواتير الحديثة</CardTitle>
              <CardDescription className="text-sky-200">
                {filteredInvoices.length > 0 
                  ? `عرض وإدارة سجل الفواتير (${filteredInvoices.length} فاتورة)`
                  : "لا توجد فواتير"
                }
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-sky-300 border-sky-400/50 bg-sky-800/30">
              {filteredInvoices.length} فاتورة
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredInvoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-sky-900/20">
                  <tr>
                    <th className="py-4 px-6 text-right font-semibold text-sky-200">رقم الفاتورة</th>
                    <th className="py-4 px-6 text-right font-semibold text-sky-200">الخدمة</th>
                    <th className="py-4 px-6 text-right font-semibold text-sky-200">المبلغ</th>
                    <th className="py-4 px-6 text-right font-semibold text-sky-200">الحالة</th>
                    <th className="py-4 px-6 text-right font-semibold text-sky-200">التاريخ</th>
                    <th className="py-4 px-6 text-right font-semibold text-sky-200">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice, index) => (
                    <tr key={invoice.id} className={`border-b border-sky-400/20 hover:bg-sky-800/30 transition-colors ${
                      index % 2 === 0 ? 'bg-sky-800/20' : 'bg-sky-800/10'
                    }`}>
                      <td className="py-4 px-6 font-mono font-medium text-sm text-white">
                        #{invoice.id}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                          <span className="font-medium text-white">{invoice.service}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-lg text-sky-200">
                          {userData.currency} {invoice.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${getStatusBg(invoice.status)} ${getStatusColor(invoice.status)}`}>
                          {getStatusIcon(invoice.status)}
                          {getStatusText(invoice.status)}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sky-200">
                        <div className="text-sm">
                          {new Date(invoice.date).toLocaleDateString('ar-SA')}
                        </div>
                        {invoice.dueDate && (
                          <div className="text-xs text-sky-300">
                            الاستحقاق: {new Date(invoice.dueDate).toLocaleDateString('ar-SA')}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-8 w-8 p-0 border-sky-400/50 text-sky-200 hover:bg-sky-800/30 hover:text-white"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-8 w-8 p-0 border-sky-400/50 text-sky-200 hover:bg-sky-800/30 hover:text-white"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          
                          {invoice.status.toLowerCase() === 'pending' && (
                            <Button 
                              size="sm" 
                              className="bg-sky-600 hover:bg-sky-700 text-white"
                              onClick={() => {
                                setSelectedInvoice(invoice.id)
                                setShowModal(true)
                              }}
                            >
                              دفع الآن
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto mb-4 text-sky-300" />
              <h3 className="text-xl font-semibold mb-2 text-white">لا توجد فواتير</h3>
              <p className="text-sky-200 max-w-md mx-auto">
                لا توجد فواتير حالياً. ستظهر الفواتير هنا بمجرد إنشاء الخدمات.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Modal */}
      {showModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-sky-800/90 backdrop-blur-sm rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative animate-in fade-in zoom-in border border-sky-400/30">
            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-4 right-4 text-2xl text-sky-200 hover:text-white transition-colors"
            >
              ×
            </button>
            
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold mb-2 text-white">دفع الفاتورة</h2>
              <div className="text-3xl font-bold text-sky-200">
                {userData.currency} {userData.invoices.find(inv => inv.id === selectedInvoice)?.amount.toFixed(2)}
              </div>
              <p className="text-sky-200">اختر طريقة الدفع المفضلة لديك</p>
            </div>

            <div className="mb-6 bg-sky-900/40 border border-sky-400/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-sky-200">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">ملاحظة:</span>
              </div>
              <p className="text-sm text-sky-100 mt-1">
                قد تضاف بعض الرسوم إلى إجمالي الفاتورة كتعويض عن رسوم الدفع.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {paymentMethods.map((method, idx) => (
                <button
                  key={method.name}
                  onClick={() => setSelected(idx)}
                  className={`relative flex flex-col items-center justify-center border-2 rounded-xl p-6 transition-all duration-200 shadow-sm focus:outline-none ${
                    selected === idx 
                      ? "border-sky-400 bg-sky-900/30 shadow-lg" 
                      : "border-sky-400/30 bg-sky-800/30 hover:border-sky-400/50 hover:shadow-md"
                  }`}
                >
                  {/* Label */}
                  <div className={`absolute top-3 right-3 ${method.labelColor} text-white text-xs px-3 py-1 rounded-full flex items-center gap-1`}>
                    <span>{method.labelIcon}</span>
                    <span>{method.label}</span>
                  </div>
                  
                  {/* Icons */}
                  <div className="flex gap-3 mb-4">
                    {method.icons}
                  </div>
                  
                  <span className="font-semibold text-base mb-2 text-white">{method.name}</span>
                  <span className="text-sm text-sky-200 text-center leading-relaxed">{method.desc}</span>
                </button>
              ))}
            </div>

            <Button 
              className="w-full bg-sky-600 hover:bg-sky-700 text-white text-lg py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" 
              onClick={() => setShowModal(false)}
            >
              تأكيد الدفع
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 