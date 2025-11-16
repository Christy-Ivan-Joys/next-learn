"use client";

import { useExamStore } from "@/app/store/exam.store";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function ExamSuccessPage() {
    const { submitResult, questions, clearExamFullData } = useExamStore();
    const router = useRouter()
    if (!submitResult) {
        return (
            <div className="p-4 sm:p-6 md:p-10 text-center">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold">No result found</h1>
                <p className="text-sm sm:text-base">Please take the exam again.</p>
            </div>
        );
    }


    const handleReset = () => {
        clearExamFullData()
        router.push('/exam/instruction')
    }

    return (
        <>
            <Head>
                <title>Exam Result – Score Summary</title>
                <meta
                    name="description"
                    content="View your exam score, correct answers, wrong answers, and performance summary."
                />
                <meta property="og:title" content="Exam Result – Score Summary" />
                <meta
                    property="og:description"
                    content="See your total score, correct, incorrect, and not attempted questions."
                />
                {/* <meta property="og:type" content="website" />
        <meta property="og:url" content="next.learn.org " /> */}
            </Head>
            <div className="w-full min-h-screen flex flex-col items-center pt-4 sm:pt-6 justify-start bg-[#eef5ff] px-3 sm:px-4">

                <div className="w-full max-w-xs sm:max-w-sm md:max-w-md rounded-2xl 
    bg-gradient-to-r from-cyan-700 via-cyan-800 to-cyan-950 
    flex flex-col items-center justify-center text-white p-4 sm:p-5 md:p-6">

                    <div className="text-base sm:text-lg font-semibold opacity-90">
                        Marks Obtained
                    </div>

                    <div className="text-3xl sm:text-4xl md:text-5xl font-medium mt-1 sm:mt-2 tracking-wide">
                        {`${submitResult?.score || 0}/${questions?.length}`}
                    </div>
                </div>

                <div className="w-full max-w-xs sm:max-w-sm md:max-w-md mt-4 sm:mt-6 rounded-2xl space-y-3 sm:space-y-4 text-gray-800">

                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                            <img src="/images/totalIcon.png" className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" alt="" />
                            Total Questions:
                        </span>
                        <span className="font-semibold text-sm sm:text-base">{questions?.length || '-'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                            <img src="/images/answeredIcon.png" className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" alt="" />
                            Correct Answers:
                        </span>
                        <span className="font-semibold text-sm sm:text-base">{String(submitResult?.correct)?.padStart(3, "0") || '-'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                            <img src="/images/incorrectIcon.png" className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" alt="" />
                            Incorrect Answers:
                        </span>
                        <span className="font-semibold text-sm sm:text-base">{submitResult?.wrong || '-'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                            <img src="/images/notAnsweredIcon.png" className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" alt="" />
                            Not Attended Questions:
                        </span>
                        <span className="font-semibold text-sm sm:text-base">{String(submitResult?.not_attended).padStart(3, "0") || '-'}</span>
                    </div>

                </div>
                <div className="w-full max-w-xs sm:max-w-sm md:max-w-md mt-4 sm:mt-6">
                    <button onClick={handleReset} className="w-full bg-primary-background text-xs sm:text-sm text-white font-semibold py-2 sm:py-3 rounded-lg transition duration-200 hover:bg-primary-button">
                        Done
                    </button>
                </div>
            </div>
        </>

    );
}