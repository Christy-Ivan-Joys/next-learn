"use client";

import { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
    return (
        <div
            className="min-h-screen flex items-center justify-center p-3 sm:p-4 md:p-6"
            style={{
                backgroundImage: `url('/images/mainBackground.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="rounded-lg bg-gradient-to-t from-login-rectangle to-login-rectangle-dark shadow-lg sm:shadow-2xl w-full max-w-sm sm:max-w-2xl md:max-w-4xl overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-1/2 bg-gradient-to-t from-login-rectangle via-login-rectangle to-login-rectangle-dark flex items-center justify-center py-4 sm:py-6 md:py-8">
                    <div className="flex flex-col h-full text-white w-full items-center">
                        <div className="flex flex-col items-center justify-between">
                            <img
                                src="/images/logo.png"
                                alt="Top Icon"
                                className="w-16 h-16 sm:w-20 sm:h-20 md:w-52 md:h-52 object-contain mt-[-10px] sm:mt-[-20px]"
                            />
                        </div>
                        <div className="flex-grow" />
                        <div className="flex justify-center h-[50%] mb-4 sm:mb-6 w-full px-4">
                            <img
                                src="/images/loginImage.png"
                                alt="Bottom Illustration"
                                className="object-contain w-full max-w-[200px] sm:max-w-xs md:max-w-md"
                            />
                        </div>
                    </div>
                </div>
                <div className="md:w-1/2 p-2 sm:p-6 md:p-2 flex items-center justify-center">
                    <div className="bg-white px-4 sm:px-6 md:px-8 py-2 sm:py-8 rounded-lg w-full h-full flex items-center justify-center border border-gray-200">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}