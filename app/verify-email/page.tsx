"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const email = searchParams.get("email");
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    if (!code || !email) return;

    fetch(`/api/auth/confirm-email?code=${code}&email=${email}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setMessage("Your email has been verified! You can now log in.");
        else setMessage("Invalid or expired verification link.");
      });
  }, [code, email]);

  return <div className="p-8 text-center text-lg">{message}</div>;
}
