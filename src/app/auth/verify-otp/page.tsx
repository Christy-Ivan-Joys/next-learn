"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "../../components/auth/LoginLayout";
import OtpForm from "../../components/auth/OtpForm";
import { verifyOtp } from "@/app/service/auth.service";
import { TokenService } from "@/app/service/token.service";

export default function VerifyOtpPage() {

  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const phoneNumber = localStorage.getItem("phoneNumber");

  const handleVerifyOtp = async () => {
    const cleanOtp = otp.replace(/\s/g, "");
    if (cleanOtp.length !== 6) return alert("Please enter a 6-digit OTP");
    setLoading(true);
    try {
      const phoneNumber = localStorage.getItem("phoneNumber");
      const res = await verifyOtp(phoneNumber as string, cleanOtp);
      if (res.success && res.login === false) {
        router.push("/user/register-user");
        return;
      }
      if (res.success && res.login === true) {
        localStorage.removeItem("phoneNumber");
        TokenService.setAccessToken(res.access_token);
        TokenService.setRefreshToken(res.refresh_token);
        router.push("/exam/instruction");
        return;
      }
      alert(res.message || "Invalid OTP");
    } catch (err) {
      console.log('error',err)
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <OtpForm
        phoneNumber={phoneNumber as string}
        otp={otp}
        setOtp={setOtp}
        onSubmit={handleVerifyOtp}
        loading={loading}
      />
    </AuthLayout>
  );
}
