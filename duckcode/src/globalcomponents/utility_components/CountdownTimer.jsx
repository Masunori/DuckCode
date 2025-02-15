import { useEffect, useState } from "react";

/**
 * Return a countdown timer UI component.
 * @param {object} param0 Contains the following fields:
 * - initialTime (int): The starting time of the timer
 * - id (string, default=null): The ID of the countdown timer to apply more styling if necessary.
 * @returns The countdown timer UI component
 */
export default function CountdownTimer({ initialTime, id="" }) {
    const [timeLeft, setTimeLeft] = useState(initialTime);

    useEffect(() => {
        if (timeLeft <= 0) {
            return;
        }

        const intervalId = setInterval(() => {
            setTimeLeft(time => time - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timeLeft]);

    return (
        <div id={id}>
            <div className="countdown-timer-display">{Math.floor(timeLeft / 36000)}</div>
            <div className="countdown-timer-display">{Math.floor(timeLeft / 3600) % 10}</div>
            <div className="countdown-timer-display">:</div>
            <div className="countdown-timer-display">{Math.floor((timeLeft % 3600) / 600)}</div>
            <div className="countdown-timer-display">{Math.floor(((timeLeft % 3600) / 60)) % 10}</div>
            <div className="countdown-timer-display">:</div>
            <div className="countdown-timer-display">{Math.floor((timeLeft % 60) / 10)}</div>
            <div className="countdown-timer-display">{timeLeft % 10}</div>
        </div>
    )
}