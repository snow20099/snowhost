export default function PaymentCancelPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-red-50">
      <div className="p-8 bg-white shadow-lg rounded-xl text-center">
        <h1 className="text-2xl font-bold text-red-700 mb-4">تم إلغاء العملية</h1>
        <p className="text-gray-700">
          لقد قمت بإلغاء الدفع. إذا كان هذا عن طريق الخطأ، يرجى المحاولة مرة أخرى.
        </p>
      </div>
    </div>
  )
}
