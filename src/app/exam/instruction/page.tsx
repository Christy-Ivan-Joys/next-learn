"use client";

import HomeLayout from "@/app/components/exam/HomeLayout";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";


const TestPage = () => {
    const [timeLeft, setTimeLeft] = useState(90 * 60);
    const router = useRouter();
    
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
    };




    return (
        <>
            <head>
                <title>Ancient Indian History MCQ Test | Practice Exam</title>
                <meta 
                    name="description" 
                    content="Take this comprehensive Ancient Indian History MCQ test with 100 questions. 90 minutes timed test with negative marking. Assess your knowledge of ancient Indian history." 
                />
                <meta name="keywords" content="ancient indian history, mcq test, history exam, practice test, competitive exams" />
                <meta property="og:title" content="Ancient Indian History MCQ Test" />
                <meta property="og:description" content="Comprehensive 100-question MCQ test on Ancient Indian History with timer and scoring" />
                <meta property="og:type" content="website" />
            </head>

            <HomeLayout>
                <div className="min-h-screen bg-[#F4FCFF] py-4 px-4 sm:px-6 lg:px-8">
                    <header className="text-center mb-8">
                        <h2 className="text-xl sm:text-3xl font-semibold text-gray-800 mb-2">
                            Ancient Indian History MCQ Test
                        </h2>
                  
                    </header>

                    <div className="max-w-6xl mx-auto">
                        <div className="mx-auto mt-5">
                            <div className="bg-primary-background rounded-lg shadow-md p-4 sm:p-6 mb-8">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
                                    <div className="sm:border-r border-gray-200 pb-4 sm:pb-0">
                                        <p className="text-sm sm:text-base text-white">Total MCQs</p>
                                        <p className="text-xl sm:text-2xl font-bold text-white">100</p>
                                    </div>

                                    <div className="sm:border-r border-gray-200 pb-4 sm:pb-0">
                                        <p className="text-sm sm:text-base text-white">Total Marks</p>
                                        <p className="text-xl sm:text-2xl font-bold text-white">100</p>
                                    </div>

                                    <div>
                                        <p className="text-sm sm:text-base text-white">Total Time</p>
                                        <p className="text-xl sm:text-2xl font-bold text-white">
                                            {formatTime(90 * 60)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mx-auto">
                            <div className=" rounded-l p-4 sm:p-6 mb-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                                    Test Instructions
                                </h2>
                                <ol className="list-decimal list-inside space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                                    <li className="pl-2">You have 100 minutes to complete the test.</li>
                                    <li className="pl-2">Test consists of 100 multiple-choice questions.</li>
                                    <li className="pl-2">You are allowed 2 retest attempts if you do not pass on the first try.</li>
                                    <li className="pl-2">Each incorrect answer will incur a negative mark of -1/4.</li>
                                    <li className="pl-2">Ensure you are in a quiet environment and have a stable internet connection.</li>
                                    <li className="pl-2">Keep an eye on the timer, and try to answer all questions within the given time.</li>
                                    <li className="pl-2">Do not use any external resources such as dictionaries, websites, or assistance.</li>
                                    <li className="pl-2">Complete the test honestly to accurately assess your proficiency level.</li>
                                    <li className="pl-2">Check answers before submitting.</li>
                                    <li className="pl-2">Your test results will be displayed immediately after submission, indicating whether you have passed or need to retake the test.</li>
                                </ol>
                                
                              
                            </div>

                            <div className="text-center mb-8 sm:mb-12">
                                <button 
                                    onClick={() => router.push("/exam/test")}
                                    className="bg-primary-background hover:bg-gray-800 cursor-pointer text-white font-semibold py-3 px-8 sm:px-24 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-background focus:ring-opacity-50 w-full sm:w-auto"
                                    aria-label="Start Ancient Indian History MCQ Test"
                                >
                                    Start Test Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </HomeLayout>
        </>
    );
};

export default TestPage;