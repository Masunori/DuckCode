import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type TimerStore = {
    /** TIme elapsed in milliseconds */
    timeElapsed: number;
    /** Whether the timer is paused */
    isPaused: boolean;

    /** Sets the time elapsed */
    setTimeElapsed: (time: number) => void;

    /** Resets the timer */
    reset: () => void;
    /** Starts the timer */
    start: () => void;
    /** Pauses the timer */
    pause: () => void;
}

export const useTimerStore = create<TimerStore>()(
    persist(
        (set) => ({
            timeElapsed: 0,
            isPaused: false,

            setTimeElapsed: (ms) => set({ timeElapsed: ms }),
            reset: () => set({ timeElapsed: 0, isPaused: true }),
            start: () => set({ isPaused: false }),
            pause: () => set({ isPaused: true }),
        }),
        {
            name: "timer",
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({
                timeElapsed: state.timeElapsed,
                isPaused: state.isPaused
            })
        }
    )
)