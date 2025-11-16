"use client";

import ExamSubmitConfirm from "@/app/components/exam/ExamSubmitConfirm";
import HomeLayout from "@/app/components/exam/HomeLayout";
import QuestionDetailsModal from "@/app/components/exam/QuestionDetailsModal";
import LoadingScreen from "@/app/components/reusable/Loader";
import { getExamData, submitExamAnswers } from "@/app/service/exam.service";
import { useExamStore } from "@/app/store/exam.store";
import { useTimerStore } from "@/app/store/timer.store";
import { QuestionType } from "@/app/types/test.types";
import { useRouter } from "next/navigation";
import { useEffect, useCallback, useState, useRef } from "react";
import Head from "next/head";

export default function TestPage() {
    const {
        questions,
        metadata,
        isLoading,
        hasData,
        currentIndex,
        answers,
        marked,
        unattended,
        remainingTime,
        setQuestions,
        setLoading,
        setCurrentIndex,
        setAnswer,
        markForReview,
        markUnattended,
        setRemainingTime,
        clearExam,
        setSubmitResult
    } = useExamStore();

    const {
        setTotalTimerRef,
        setExamStartTime,
        examStartTime,
        setTotalExamDuration,
        totalExamDuration,
        hasExamStarted, 
        setHasExamStarted, 
        clearAllTimers,
        resetTimerState
    } = useTimerStore();

    const [open, setOpen] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState<QuestionType | null>(null);
    const router = useRouter();
    const [submitLoading, setSubmitLoading] = useState(false);

    const remainingTimeRef = useRef(remainingTime);
    const questionsRef = useRef(questions);
    const answersRef = useRef(answers);
    const currentIndexRef = useRef(currentIndex);
    const metadataRef = useRef(metadata);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const hasSubmittedRef = useRef(false);
    const hasInitializedRef = useRef(false);

    const calculateActualRemainingTime = useCallback((duration: number): number => {
        if (!examStartTime) {
            return duration;
        }
        
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - examStartTime) / 1000);
        const actualRemaining = Math.max(0, duration - elapsedSeconds);
                return actualRemaining;
    }, [examStartTime]);

    const submitExam = useCallback(async (): Promise<void> => {
        if (hasSubmittedRef.current || questionsRef.current.length === 0) return;
        hasSubmittedRef.current = true;

        clearAllTimers();
        resetTimerState();
        
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        const answersPayload = questionsRef.current.map((q) => ({
            question_id: q.question_id,
            selected_option_id: answersRef.current[q.question_id] || null,
        }));

        try {
            setSubmitLoading(true);
            const formData = new FormData();
            formData.append("answers", JSON.stringify(answersPayload));
            const res = await submitExamAnswers(formData);
            setSubmitLoading(false);
            setOpenConfirm(false);

            if (res.success) {
                setSubmitResult(res);
                clearExam();
                resetTimerState();
                router.push("/exam/test-result");
            }
        } catch (e: any) {
            console.error("Submission error:", e);
            setSubmitLoading(false);
            hasSubmittedRef.current = false;
        }
    }, [clearAllTimers, clearExam, resetTimerState, router, setSubmitResult]);
    const startTotalTimer = useCallback((duration: number): void => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    
        hasSubmittedRef.current = false;
    
        let initialTime: number;

            if (remainingTime > 0 && remainingTime <= duration) {
            initialTime = remainingTime;
        } else {
            initialTime = duration;
            setRemainingTime(duration);
        }
    
        const safeInitialTime = Math.max(0, initialTime);
        remainingTimeRef.current = safeInitialTime;
        setTotalExamDuration(duration);
    
    
        const timer = setInterval(() => {
            setRemainingTime((prevTime) => {
                const newTime = prevTime - 1;
                remainingTimeRef.current = newTime;
                
                if (newTime <= 0) {
                    clearInterval(timer);
                    timerRef.current = null;
                    
                    setTimeout(() => {
                        if (questionsRef.current.length > 0 && !hasSubmittedRef.current) {
                            submitExam();
                        }
                    }, 100);
                    return 0;
                }
                
                return newTime;
            });
        }, 1000);
    
        timerRef.current = timer;
        setTotalTimerRef(timer);
    }, [
        setTotalTimerRef, 
        setRemainingTime, 
        submitExam,
        setTotalExamDuration,
        remainingTime 
    ]);
    useEffect(() => {
        const initializeExam = async () => {
            if (hasInitializedRef.current) {
                return;
            }
            
            try {
                setLoading(true);
                const res = await getExamData();
                
                if (res.success) {
                    
                    const examDuration = res.total_time ? res.total_time * 60 : 1800;
                    
                    if (examDuration <= 0) {
                        return;
                    }
                    
                    setQuestions(res);
                    hasInitializedRef.current = true;
                    
                    startTotalTimer(examDuration);
                } else {
                    console.error("Failed to get exam data");
                }
            } catch (err) {
                console.error("Error fetching questions:", err);
            } finally {
                setLoading(false);
            }
        };
    
        if (!hasInitializedRef.current) {
            if (hasData && questions.length > 0 && remainingTime > 0) {        
                hasInitializedRef.current = true;
                const duration = metadata?.total_time ? metadata.total_time * 60 : 1800;
                startTotalTimer(duration);
            } else {
                initializeExam();
            }
        }
    }, [hasData, remainingTime, metadata, setLoading, setQuestions, startTotalTimer, questions.length]);
    useEffect(() => {
        if (remainingTime === 0 && questions.length > 0 && !hasSubmittedRef.current && hasInitializedRef.current) {
            const timeoutId = setTimeout(() => {
                if (!hasSubmittedRef.current) {
                    submitExam();
                }
            }, 1000);

            return () => clearTimeout(timeoutId);
        }
    }, [remainingTime, questions.length, submitExam]);

    useEffect(() => {
        questionsRef.current = questions;
        answersRef.current = answers;
        currentIndexRef.current = currentIndex;
        metadataRef.current = metadata;
        remainingTimeRef.current = remainingTime;
    }, [questions, answers, currentIndex, metadata, remainingTime]);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, []);

    const goNext = useCallback((): void => {
        if (questions.length === 0) return;

        const currentQid = questions[currentIndex]?.question_id;
        if (currentQid && !answers[currentQid]) {
            markUnattended(currentQid);
        }

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setOpenConfirm(true);
        }
    }, [currentIndex, questions, answers, markUnattended, setCurrentIndex]);

    const goPrevious = useCallback((): void => {
        if (questions.length === 0) return;

        const currentQid = questions[currentIndex]?.question_id;
        if (currentQid && !answers[currentQid]) {
            markUnattended(currentQid);
        }

        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    }, [currentIndex, questions, answers, markUnattended, setCurrentIndex]);

    const selectOption = useCallback((qid: number, oid: number): void => {
        setAnswer(qid, oid);
    }, [setAnswer]);

    const markForReviewHandler = useCallback((): void => {
        if (questions.length === 0) return;
        const qid = questions[currentIndex]?.question_id;
        if (qid) {
            markForReview(qid);
        }
    }, [currentIndex, questions, markForReview]);

    const getButtonColor = useCallback((q: QuestionType): string => {
        const qid = q.question_id;
        const isMarked = marked.includes(qid);
        const isAnswered = answers[qid] !== undefined && answers[qid] !== null;
        const isUnattended = unattended.includes(qid);
        const isCurrent = qid === questions[currentIndex]?.question_id;

        if (isMarked && isAnswered) return "bg-purple-700 text-white border-purple-700";
        if (isMarked && !isAnswered) return "bg-purple-400 text-white border-purple-400";
        if (isAnswered) return "bg-green-600 text-white border-green-600";
        if (isUnattended && !isCurrent) {
            return "bg-red-500 text-white border-red-500";
        }
        return "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200";
    }, [marked, answers, unattended, questions, currentIndex]);

    const handleQuestionClick = useCallback((index: number): void => {
        if (questions.length === 0) return;

        const currentQid = questions[currentIndex]?.question_id;
        if (currentQid && !answers[currentQid]) {
            markUnattended(currentQid);
        }

        setCurrentIndex(index);
    }, [currentIndex, questions, answers, markUnattended, setCurrentIndex]);

    if (isLoading) {
        return (
            <HomeLayout>
                <LoadingScreen />
            </HomeLayout>
        );
    }

    const q = questions[currentIndex];

    const pad = (v: number): string => {
        if (isNaN(v)) return "00";
        return String(Math.max(0, v)).padStart(2, "0");
    };

    const timerMinutes = Math.floor(remainingTime / 60);
    const timerSeconds = remainingTime % 60;

    return (
        <>
            <Head>
                <title>Ancient Indian History MCQ Test | Online Examination</title>
                <meta name="description" content="Take this comprehensive Ancient Indian History MCQ test. Practice with timed questions and improve your knowledge." />
                <meta name="keywords" content="ancient indian history, mcq test, online exam, history quiz, competitive exams" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta property="og:title" content="Ancient Indian History MCQ Test" />
                <meta property="og:description" content="Take this comprehensive Ancient Indian History MCQ test" />
                <meta property="og:type" content="website" />
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <HomeLayout>
                <div className="w-full min-h-screen bg-[#eef5ff] p-3 sm:p-4 md:p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 md:gap-6">
                        <div className="lg:col-span-8">
                            <div className="flex flex-col">
                                <div className="flex flex-col gap-2 sm:gap-3">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                        <div className="text-sm sm:text-base font-medium text-gray-800 text-center sm:text-left">
                                            Ancient Indian History MCQ
                                        </div>
                                        <div className="flex items-center justify-center sm:justify-end gap-3 sm:gap-4">
                                            <div className="text-sm leading-relaxed text-gray-800">
                                                <div className="bg-gray-100 border text-sm px-3 py-1.5 sm:py-1 rounded">
                                                    {pad(currentIndex + 1)}/{pad(metadata?.questions_count ?? 0)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 bg-white rounded-lg shadow p-4 sm:p-5 min-h-[400px] sm:min-h-[420px] mt-3">
                                    {q ? (
                                        <>
                                            {q.comprehension && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedQuestion(q);
                                                        setOpen(true);
                                                    }}
                                                    className="self-start bg-primary-button text-white px-3 py-2 rounded border border-[#9fd4f0] text-sm inline-flex items-center gap-2 hover:bg-blue-700 transition-colors duration-200"
                                                >
                                                    Read Comprehensive Paragraph
                                                </button>
                                            )}

                                            <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
                                                {q.question}
                                            </p>

                                            {q.image && (
                                                <div className="mb-4 w-full max-w-[280px] sm:max-w-[220px] h-[120px] sm:h-[150px] border rounded flex items-center justify-center bg-gray-50 overflow-hidden mx-auto sm:mx-0">
                                                    <img
                                                        src={q.image}
                                                        alt={`Visual question ${currentIndex + 1}`}
                                                        className="w-full h-full object-contain"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            )}

                                            <div className="text-sm text-gray-800 mb-2 font-medium">
                                                Choose the answer:
                                            </div>

                                            <div className="space-y-2 sm:space-y-3">
                                                {q.options.map((op) => (
                                                    <label
                                                        key={op.id}
                                                        className="flex items-center text-gray-800 justify-between border border-[#e6eef6] rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 bg-white hover:bg-[#f8fbff] cursor-pointer transition-all duration-200 hover:shadow-sm"
                                                    >
                                                        <div className="text-[13px] sm:text-[14px] pr-2">{op.option}</div>
                                                        <input
                                                            type="radio"
                                                            name={`q-${q.question_id}`}
                                                            className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                            checked={answers[q.question_id] === op.id}
                                                            onChange={() => selectOption(q.question_id, op.id)}
                                                        />
                                                    </label>
                                                ))}
                                            </div>

                                            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-4">
                                                <button
                                                    onClick={markForReviewHandler}
                                                    className="flex-1 bg-[#6f0b74] text-white py-2.5 sm:py-3 rounded text-sm hover:bg-purple-800 transition-colors duration-200"
                                                >
                                                    Mark for review
                                                </button>
                                                <button
                                                    onClick={goPrevious}
                                                    disabled={currentIndex === 0}
                                                    className={`flex-1 py-2.5 sm:py-3 rounded text-sm transition-colors duration-200 ${currentIndex === 0
                                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                            : 'bg-[#d7d7d7] text-black hover:bg-gray-300'
                                                        }`}
                                                >
                                                    Previous
                                                </button>
                                                <button
                                                    onClick={goNext}
                                                    className="flex-1 bg-[#172b37] text-white py-2.5 sm:py-3 rounded text-sm hover:bg-gray-800 transition-colors duration-200"
                                                >
                                                    {currentIndex === questions.length - 1 ? 'Submit' : 'Next'}
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center text-gray-500 py-8">
                                            No questions available
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4 mt-4 lg:mt-0">
                            <div className="bg-white rounded-lg p-3 sm:p-4 h-full flex flex-col shadow">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                    <div className="text-sm font-semibold text-gray-800 text-center sm:text-left">
                                        Question No. Sheet:
                                    </div>
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="text-xs text-gray-600">Remaining Time:</div>
                                        <div className="bg-[#0f2630] text-white text-xs sm:text-sm px-2 sm:px-3 py-1.5 rounded flex items-center gap-1 sm:gap-2">
                                            <span className="font-mono">
                                                {pad(timerMinutes)}:{pad(timerSeconds)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-8 gap-1.5 sm:gap-2 mb-4 max-h-[200px] sm:max-h-none overflow-y-auto">
                                    {questions.map((pq, i) => (
                                        <button
                                            key={pq.question_id}
                                            onClick={() => handleQuestionClick(i)}
                                            className={`h-8 sm:h-10 w-8 sm:w-10 border rounded text-xs sm:text-sm flex items-center justify-center transition-all duration-200 ${getButtonColor(pq)} ${currentIndex === i ? 'border-2 border-blue-400 ring-offset-1 scale-105' : ''
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-auto pt-3 border-t border-gray-200">
                                    <div className="text-xs text-gray-700">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-600 inline-block rounded-sm flex-shrink-0"></span>
                                                <span className="text-xs">Attended</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 inline-block rounded-sm flex-shrink-0"></span>
                                                <span className="text-xs">Not Attended</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-purple-400 inline-block rounded-sm flex-shrink-0"></span>
                                                <span className="text-xs">Marked For Review</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-purple-700 inline-block rounded-sm flex-shrink-0"></span>
                                                <span className="text-xs">Answered + Marked</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <QuestionDetailsModal
                        open={open}
                        selectedQuestion={selectedQuestion}
                        setOpen={setOpen}
                    />
                    <ExamSubmitConfirm
                        isOpen={openConfirm}
                        loading={submitLoading}
                        onClose={() => setOpenConfirm(false)}
                        onConfirm={submitExam}
                        stats={{
                            remainingTime: `${pad(timerMinutes)}:${pad(timerSeconds)}`,
                            totalQuestions: questions.length,
                            answered: Object.keys(answers).length,
                            marked: marked.length
                        }}
                    />
                </div>
            </HomeLayout>
        </>
    );
}