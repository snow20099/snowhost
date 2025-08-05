import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function VerifyEmail() {
  const router = useRouter();
  const { code, email } = router.query;
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
