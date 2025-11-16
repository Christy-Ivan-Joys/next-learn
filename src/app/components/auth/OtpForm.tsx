"use client";

import BaseInput from "../reusable/input/BaseInput";

interface OtpFormProps {
    phoneNumber: string;
    otp: string;
    setOtp: (value: string) => void;
    onSubmit: () => void;
    loading: boolean;
}

export default function OtpForm({ phoneNumber, otp, setOtp, onSubmit, loading }: OtpFormProps) {
    const handleOtpChange = (value: string) => {
        const digits = value.replace(/\D/g, "").slice(0, 6);
        if (digits.length > 3) {
            setOtp(digits.slice(0, 3) + " " + digits.slice(3));
        } else {
            setOtp(digits);
        }
    };

    return (
        <div className="h-full flex flex-col justify-center px-4">
            <h1 className="text-2xl font-semibold text-gray-800 mb-3">
                Enter the code we texted you
            </h1>
            <p className="text-gray-900 text-sm mb-3">
                We’ve sent an SMS to {phoneNumber}
            </p>

            <div className="mb-24">

                <BaseInput
                    label="SMS Code"
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder="XXX XXX"
                    type="text"
                />
             
                <label className="block text-gray-800 font-semibold underline text-xs font-stretch-105% mb-2 mt-3">
                    Resend code
                </label>
            </div>

            <button
                onClick={onSubmit}
                disabled={loading}
                className="w-full bg-login-rectangle text-white font-medium py-3 mt-10 px-1 rounded-lg transition duration-200 hover:bg-login-rectangle-dark disabled:opacity-50"
            >
                {loading ? "Verifying..." : "Verify"}
            </button>
        </div>
    );
}
