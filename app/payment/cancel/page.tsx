"use client"

import { XCircle, Snowflake } from "lucide-react"

export default function PaymentCancelPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-sky-600 via-sky-800 to-black">
      <div className="p-8 border-sky-400/30 bg-sky-800/50 backdrop-blur-sm shadow-2xl rounded-xl text-center text-white">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Snowflake className="h-8 w-8 text-sky-300" />
          <h1 className="text-2xl font-bold text-white">تم إلغاء العملية</h1>
        </div>
        <p className="text-sky-200">
          لقد قمت بإلغاء الدفع. إذا كان هذا عن طريق الخطأ، يرجى المحاولة مرة أخرى.
        </p>
      </div>
    </div>
  )
}
