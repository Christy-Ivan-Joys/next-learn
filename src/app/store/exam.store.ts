import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ExamResponseType, QuestionType } from '@/app/types/test.types'

interface ExamState {
    questions: QuestionType[]
    metadata: ExamResponseType | null
    isLoading: boolean
    hasData: boolean
    currentIndex: number
    answers: Record<number, number | null>
    marked: number[]
    unattended: number[]
    remainingTime: number
    submitResult: any | null
    setSubmitResult: (data: any | null) => void
    setQuestions: (data: ExamResponseType) => void
    setLoading: (loading: boolean) => void
    setCurrentIndex: (index: number) => void
    setAnswer: (questionId: number, optionId: number) => void
    markForReview: (questionId: number) => void
    markUnattended: (questionId: number) => void
    setRemainingTime: (time: number | ((prev: number) => number)) => void
    clearExam: () => void;
    clearExamFullData: () => void
}

export const useExamStore = create<ExamState>()(
    persist(
        (set, get) => ({
            questions: [],
            metadata: null,
            isLoading: false,
            hasData: false,
            currentIndex: 0,
            answers: {},
            marked: [],
            unattended: [],
            remainingTime: 0,
            submitResult: null,
            setQuestions: (data) => set({
                questions: data.questions,
                metadata: data,
                remainingTime: data.total_time * 60,
                hasData: true
            }),

            setLoading: (loading) => set({ isLoading: loading }),

            setCurrentIndex: (index) => set({ currentIndex: index }),

            setAnswer: (questionId, optionId) => set((state) => ({
                answers: { ...state.answers, [questionId]: optionId },
                unattended: state.unattended.filter(id => id !== questionId)
            })),

            markForReview: (questionId) => set((state) => ({
                marked: state.marked.includes(questionId)
                    ? state.marked
                    : [...state.marked, questionId]
            })),

            markUnattended: (questionId) => set((state) => ({
                unattended: state.unattended.includes(questionId)
                    ? state.unattended
                    : [...state.unattended, questionId]
            })),

            setRemainingTime: (time) => set((state) => ({
                remainingTime: typeof time === 'function' ? time(state.remainingTime) : time
            })),
            setSubmitResult: (data) => set({ submitResult: data }),

            clearExam: () => {
                set({
                    metadata: null,
                    isLoading: false,
                    hasData: false,
                    currentIndex: 0,
                    answers: {},
                    marked: [],
                    unattended: [],
                    remainingTime: 0,
                });
            },
            clearExamFullData: () => {
                set({
                    questions: [],
                    metadata: null,
                    isLoading: false,
                    hasData: false,
                    currentIndex: 0,
                    answers: {},
                    marked: [],
                    unattended: [],
                    remainingTime: 0,
                    submitResult:null
                });
                if (typeof window !== "undefined") {
                    localStorage.removeItem("exam-storage");
                }
            },

        }),
        {
            name: 'exam-storage',
            partialize: (state) => ({
                questions: state.questions,
                metadata: state.metadata,
                hasData: state.hasData,
                currentIndex: state.currentIndex,
                answers: state.answers,
                marked: state.marked,
                unattended: state.unattended,
                remainingTime: state.remainingTime
            })
        }
    )
)