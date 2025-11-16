"use client";

import {  useRouter } from "next/navigation";
import { TokenService } from "./service/token.service";
import { useEffect } from "react";


export default function Home() {

  const router = useRouter();
  useEffect(() => {

    const token = TokenService.getAccessToken();
    if (token) {
      router.replace("/exam/instruction");
    } else {
      router.replace("/auth/login");
    }

  }, [router]);

  return null;

}