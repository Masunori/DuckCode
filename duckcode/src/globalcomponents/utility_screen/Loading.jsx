import { useEffect, useState } from "react";

export default function Loading() {
    const [loadPercentage, setLoadPercentage] = useState(0);
    const time = 1;

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadPercentage((prev) => {
                if (prev === 100) {
                    clearInterval(interval);
                    return 100;
                }

                return prev + 1;
            });
        }, time * 10);

        return () => clearInterval(interval);
    })

    return (
        <div id="loading">
            <div id="loading-spinner-container" style={{
                backgroundImage: `conic-gradient(from 0deg at 50% 50%, 
                                    var(--significant-button-color), 
                                    var(--significant-button-color) ${loadPercentage}%, 
                                    transparent ${loadPercentage}%, 
                                    transparent)`
            }}>
                <div id="loading-spinner">
                    <p>{loadPercentage}</p>
                </div>
            </div>
        </div>
    )
}