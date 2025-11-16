"use client";

import { useState } from "react";
import PhoneInput from "../reusable/input/PhoneInput";


export default function LoginForm({ onSubmit,loading }: { onSubmit: (phone: string) => void,loading:boolean }) {

    const [phoneNumber, setPhoneNumber] = useState("");

    return (
        <div className="h-full flex flex-col justify-center">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                Enter your phone number
            </h1>

            <p className="text-gray-900 mb-3">
                We use your mobile number to identify your account
            </p>

            <div className="mb-10">
              
                <PhoneInput
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                />
                <p className="text-gray-500 text-[13px] mb-20 mt-2">
                    By tapping Get Started, you agree to the{" "}
                    <span className="text-gray-500 font-semibold cursor-pointer">
                        Terms & Conditions
                    </span>
                </p>
            </div>

            <button onClick={() => onSubmit(phoneNumber)} className="w-full bg-login-rectangle text-white font-medium py-3 mt-10 px-1 rounded-lg transition duration-200 hover:bg-login-rectangle-dark">
               {loading ? "Loading..." : "Get Started"}
            </button>
        </div>
    );
}
