import { useEffect, useImperativeHandle, useRef, useState } from "react";
import styles from "./timer.module.css";
import { printd } from "@/lib/utils/debugUtils";

export type CountupTimerRef = {
    /** Resets the timer */
    reset: () => void;
    /** Returns the time elapsed in milliseconds */
    getCurrentTime: () => number;
}

type CountupTimerProps = {
    /** Time elapsed in seconds */
    initialTime: number;
    isPaused: boolean;
    onTimeElapsedChange?: (timeElapsed: number) => void;
}

export default function CountupTimer({ initialTime, isPaused, onTimeElapsedChange }: CountupTimerProps) {
    const [secondsElapsed, setSecondsElapsed] = useState(Math.floor(initialTime / 1000));

    const baseElapsedMsRef = useRef<number>(initialTime);
    const startTimeMsRef = useRef<number>(Date.now());
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        printd("@/components/timer/CountupTimer", "isPaused:", isPaused);

        if (isPaused) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        startTimeMsRef.current = Date.now();

        intervalRef.current = setInterval(() => {
            const elapsed = baseElapsedMsRef.current + (Date.now() - startTimeMsRef.current);
            
            if (onTimeElapsedChange) {
                onTimeElapsedChange(elapsed);
            }
            setSecondsElapsed(Math.floor(elapsed / 1000));
        }, 200);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isPaused, onTimeElapsedChange]);

    const hoursElapsed = secondsElapsed / 3600 >= 10
        ? Math.floor(secondsElapsed / 3600)
        : "0" + Math.floor(secondsElapsed / 3600);

    const minutesElapsed = (secondsElapsed % 3600) / 60 >= 10
        ? Math.floor((secondsElapsed % 3600) / 60)
        : "0" + Math.floor((secondsElapsed % 3600) / 60);
    
    const secondsOnlyElapsed = secondsElapsed % 60 >= 10
        ? secondsElapsed % 60
        : "0" + (secondsElapsed % 60);

    return (
        <div className={styles.countupTimer}>
            <span>{hoursElapsed}</span>:<span>{minutesElapsed}</span>:<span>{secondsOnlyElapsed}</span>
        </div>
    )
}