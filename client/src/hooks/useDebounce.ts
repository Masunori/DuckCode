import { useCallback, useEffect, useRef } from "react";

/**
 * A custom hook that provides a debounced version of a save function.
 * 
 * @param saveFn The function to be debounced 
 * @param delay The debounce delay in milliseconds
 * @returns An object containing the debounced version of the save function
 */
export function useDebouncedSave<T>(
    saveFn: (value: T) => void,
    delay: number
) {
    const fnRef = useRef(saveFn);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        fnRef.current = saveFn;
    }, [saveFn]);

    const debouncedSave = useCallback((value: T) => {
        const timer = timerRef.current;
        if (timer != null) {
            clearTimeout(timer);
        }

        timerRef.current = setTimeout(() => {
            fnRef.current(value);
            timerRef.current = null;
        }, delay);
    }, [delay]);

    return { debouncedSave };
}