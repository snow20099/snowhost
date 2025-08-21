"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

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
    <div className="flex items-center justify-center h-screen bg-green-50">
      <div className="p-8 bg-white shadow-lg rounded-xl text-center">
        <h1 className="text-2xl font-bold text-green-700 mb-4">نجاح العملية</h1>
        <p className="text-gray-700">{status}</p>
      </div>
    </div>
  )
}
