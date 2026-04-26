import { useEffect, useRef, useState } from "react";
import styles from "./timer.module.css";

type CountdownTimerProps = {
    /** The initial time for the countdown timer in seconds */
    initialTime: number;
    /** The function to be called when the countdown timer reaches 0. This is optional. */
    onCountdownEnds?: () => void;
}

/**
 * A countdown timer that counts down from the initial time to 0. When the timer reaches 0, the onCountdownEnds function is called.
 * @param param0 The props for the CountdownTimer component.
 * - `initialTime`: The initial time for the countdown timer in seconds.
 * - `onCountdownEnds`: The function to be called when the countdown timer reaches 0. This is optional.
 * @returns 
 */
export default function CountdownTimer({ initialTime, onCountdownEnds }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const hasEndedRef = useRef(false);

    /*
        If the timer is ever reset, add

        useEffect(() => {
            hasEndedRef.current = false;
        }, [countdownId]);
    */

    useEffect(() => {
        if (timeLeft <= 0) {
            if (!hasEndedRef.current) {
                hasEndedRef.current = true;
                onCountdownEnds?.();
            }
            
            return;
        }

        const intervalId = setInterval(() => {
            setTimeLeft(time => time - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timeLeft, onCountdownEnds]);

    const getHour = (time: number) => time / 3600 >= 10
        ? Math.floor(time / 3600)
        : "0" + Math.floor(time / 3600);

    const getMinute = (time: number) => (time % 3600) / 60 >= 10 
        ? Math.floor((time % 3600) / 60)
        : "0" + Math.floor((time % 3600) / 60);

    const getSecond = (time: number) => time % 60 >= 10 
        ? time % 60
        : "0" + (time % 60);

    return (
        <div className={styles.countdownTimer}>
            <span>{getHour(timeLeft)}</span>:<span>{getMinute(timeLeft)}</span>:<span>{getSecond(timeLeft)}</span>
        </div>
    )
}