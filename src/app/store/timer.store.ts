import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TimerState {
    totalTimerRef: NodeJS.Timeout | null
    examStartTime: number | null
    totalExamDuration: number
    isTimerRunning: boolean
    hasExamStarted: boolean
    setTotalTimerRef: (ref: NodeJS.Timeout | null) => void
    setExamStartTime: (timestamp: number | null) => void
    setTotalExamDuration: (duration: number) => void
    setIsTimerRunning: (running: boolean) => void
    setHasExamStarted: (started: boolean) => void
    clearAllTimers: () => void
    resetTimerState: () => void
}

export const useTimerStore = create<TimerState>()(
    persist(
        (set, get) => ({
            totalTimerRef: null,
            examStartTime: null,
            totalExamDuration: 0,
            isTimerRunning: false,
            hasExamStarted: false,
            
            setTotalTimerRef: (ref) => set({ totalTimerRef: ref }),
            
            setExamStartTime: (timestamp) => set({ examStartTime: timestamp }),
            
            setTotalExamDuration: (duration) => set({ totalExamDuration: duration }),
            
            setIsTimerRunning: (running) => set({ isTimerRunning: running }),
            
            setHasExamStarted: (started) => set({ hasExamStarted: started }),
            
            clearAllTimers: () => {
                const { totalTimerRef } = get()
                if (totalTimerRef) {
                    clearInterval(totalTimerRef)
                }
                set({ totalTimerRef: null, isTimerRunning: false })
            },
            
            resetTimerState: () => {
                const { totalTimerRef } = get()
                if (totalTimerRef) {
                    clearInterval(totalTimerRef)
                }
                set({
                    totalTimerRef: null,
                    examStartTime: null,
                    totalExamDuration: 0,
                    isTimerRunning: false,
                    hasExamStarted: false
                })
            }
        }),
        {
            name: 'timer-storage', 
        }
    )
)