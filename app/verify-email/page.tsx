"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const email = searchParams.get("email");
  const [message, setMessage] = useState("جاري التحقق...");

  useEffect(() => {
    if (!code || !email) return;

    fetch(`/api/auth/confirm-email?code=${code}&email=${email}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setMessage("تم التحقق من بريدك! يمكنك تسجيل الدخول الآن.");
        else setMessage("رابط التحقق غير صالح أو منتهي الصلاحية.");
      });
  }, [code, email]);

  return <div className="p-8 text-center text-lg">{message}</div>;
}
