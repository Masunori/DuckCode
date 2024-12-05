import { useEffect, useState } from "react";

export default function CountdownTimer({ initialTime, asSpan = false }) {
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

    const formatTime = time => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;

        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    if (asSpan) {
        return <span>Time left: {formatTime(timeLeft)}</span>;
    } else {
        return (
            <div id="countdown-timer">
                Time left: {formatTime(timeLeft)}
            </div>
        );
    }
}