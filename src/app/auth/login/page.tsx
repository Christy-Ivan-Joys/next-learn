"use client"

import { useRouter } from "next/navigation";
import AuthLayout from "../../components/auth/LoginLayout";
import LoginForm from "../../components/auth/LoginForm";
import { sendOtp } from "@/app/service/auth.service";
import { useEffect, useState } from "react";
import { TokenService } from "@/app/service/token.service";

export default function LoginPage() {

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
  
      const token = TokenService.getAccessToken();
      if (token) {
        router.replace("/exam/instruction");
      } else {
        router.replace("/auth/login");
      }
  
    }, [router]);
    async function handleSendOtp(phoneNumber: string) {
        if (!phoneNumber) return;
        setLoading(true);

        try {
            const res = await sendOtp(phoneNumber);
            console.log(res,'send otp response')
            if (res.success) {
                localStorage.setItem("phoneNumber", phoneNumber);
                router.push(`/auth/verify-otp`);
            } else {
                alert(res.message);
            }
        } catch (err) {
            alert("Something went wrong!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout>
            <LoginForm onSubmit={handleSendOtp} loading={loading} />
        </AuthLayout>
    );
}
