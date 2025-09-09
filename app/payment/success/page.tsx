"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { CheckCircle, Snowflake } from "lucide-react"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") // PayPal يرجع orderID باسم token
  const [status, setStatus] = useState("جاري تأكيد الدفع...")

  useEffect(() => {
    if (token) {
      fetch("/api/payment/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderID: token }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setStatus(`✅ تم الدفع بنجاح! المبلغ: $${data.amount}`)
          } else {
            setStatus("❌ فشل في إتمام الدفع")
          }
        })
        .catch(() => setStatus("❌ حدث خطأ أثناء تأكيد الدفع"))
    }
  }, [token])

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-sky-600 via-sky-800 to-black">
      <div className="p-8 border-sky-400/30 bg-sky-800/50 backdrop-blur-sm shadow-2xl rounded-xl text-center text-white">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Snowflake className="h-8 w-8 text-sky-300" />
          <h1 className="text-2xl font-bold text-white">نجاح العملية</h1>
        </div>
        <p className="text-sky-200">{status}</p>
      </div>
    </div>
  )
}
