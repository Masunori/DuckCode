"use client";

import { useEffect } from "react";
import styles from  "../page.module.css";
import confetti from "canvas-confetti";

type WinPopupProps = {
    timeElapsed: number;
    exit: () => void;
}

export default function WinPopup({ timeElapsed, exit }: WinPopupProps) {
    const hours = Math.floor(timeElapsed / 3600);
    const minutes = Math.floor((timeElapsed % 3600) / 60);
    const seconds = timeElapsed % 60;

    const formattedTime = `${hours > 0 ? hours + "h " : ""}${minutes > 0 ? minutes + "m " : ""}${seconds}s`;

    useEffect(() => {        
        const interval = setInterval(() => {
            confetti({
                particleCount: 5,
                angle: 45,
                spread: 25,
                startVelocity: 55,
                origin: { x: 0, y: 1 },
                colors: ['#007fff', '#ffffff']
            });

            confetti({
                particleCount: 5,
                angle: 135,
                spread: 25,
                startVelocity: 55,
                origin: { x: 1, y: 1 },
                colors: ['#007fff', '#ffffff']
            });

            confetti({
                particleCount: 5,
                angle: 90,
                spread: 50,
                startVelocity: 55,
                origin: { x: 0.5, y: 1 },
                colors: ['#007fff', '#ffffff']
            })
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.winPopupOverlay}>
            <div className={styles.winPopup}>
                <h2>Congratulations! You solved the problem!</h2>
                <p>Your time: {formattedTime}</p>
                <button onClick={exit}>Exit</button>
            </div>
        </div>
    )
}