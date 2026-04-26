import { ReactNode, useEffect, useState } from "react";
import styles from "./gettingStarted.module.css";

export type InstructionOverlayProps = {
    message: ReactNode;
    target?: DOMRect;
    messagePosition: { top: number; left: number, width: number, height: number };
    onRegress: () => void;
    onAdvance: () => void;
    onSkip: () => void;
}

export default function InstructionOverlay({ message, target, messagePosition, onRegress, onAdvance, onSkip }: InstructionOverlayProps) {
    const [allowNextCountdown, setAllowNextCountdown] = useState<number>(1);
    const [nextBtnMessage, setNextBtnMessage] = useState<string>("Next (1s)");
    const [isNextDisabled, setIsNextDisabled] = useState(true);
    const [showSkip, setShowSkip] = useState(false);

    const SkipPopup = () => {
        return (
            <div className={styles.skipPopup}>
                <p>To clear this tutorial, solve the question.</p>
                <p>Are you sure you want to skip the instructions?</p>
                <div className={styles.skipPopupButtons}>
                    <button className={`${styles.skipPopupButton} ${styles.cancel}`} onClick={() => {
                        setShowSkip(false);
                    }}>
                        Cancel
                    </button>
                    <button className={`${styles.skipPopupButton} ${styles.skip}`} onClick={() => {
                        setShowSkip(false);
                        onSkip();
                    }}>
                        Skip
                    </button>
                </div>
            </div>
        )
    };

    useEffect(() => {
        setIsNextDisabled(true);
        setAllowNextCountdown(1);
        setNextBtnMessage("Next (1s)");
    }, [message, target, messagePosition]);

    useEffect(() => {
        if (!isNextDisabled) {
            return;
        }

        if (allowNextCountdown <= 0) {
            setNextBtnMessage("Next");
            setIsNextDisabled(false);

            return;
        }

        const interval = setInterval(() => {
            setNextBtnMessage(`Next (${allowNextCountdown - 1}s)`);
            setAllowNextCountdown(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [isNextDisabled, allowNextCountdown]);
    
    if (!target) {
        return <div 
            className={styles.instructionOverlay}
            style={{
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh"
            }}
        >
            <div className={styles.instruction}>
                <div className={styles.instructionButtons}>
                    <button className={styles.instructionButton} onClick={onRegress}>
                        Previous
                    </button>
                    <button className={styles.instructionButton} onClick={onAdvance} disabled={isNextDisabled}>
                        {nextBtnMessage}
                    </button>
                    <button className={styles.instructionButton} onClick={() => setShowSkip(true)}>
                        Skip
                    </button>
                </div>
                <div className={styles.instructionText}>
                    {message}
                </div>
            </div>
            {
                showSkip && <SkipPopup />
            }
        </div>
    }

    const top = Math.max(0, target.top - 3);
    const left = Math.max(0, target.left - 3);
    const bottom = Math.min(window.innerHeight, target.bottom + 3);
    const right = Math.min(window.innerWidth, target.right + 3);
    const width = right - left;
    const height = bottom - top;

    const msgTop = messagePosition.top * 100;
    const msgLeft = messagePosition.left * 100;
    const msgWidth = messagePosition.width * 100;
    const msgHeight = messagePosition.height * 100;

    return (
        <>
           {/* Top overlay */}
            <div 
                className={styles.instructionOverlay} 
                style={{ top: 0, left: 0, right: 0, height: top }}
                // onClick={onAdvance}
            />
            {/* Bottom overlay */}
            <div 
                className={styles.instructionOverlay} 
                style={{ top: bottom, left: 0, right: 0, bottom: 0 }}
                // onClick={onAdvance}
            />
            {/* Left overlay */}
            <div 
                className={styles.instructionOverlay} 
                style={{ top: top, left: 0, height: height, width: left }}
                // onClick={onAdvance}
            />
            {/* Right overlay */}
            <div 
                className={styles.instructionOverlay} 
                style={{ top: top, left: right, height: height, right: 0 }}
                // onClick={onAdvance}
            />
            {/* Highlighted element */}
            <div 
                className={styles.highlightedElement}
                style={{ top, left, height, width }}
                onClick={onAdvance}
            />
            <div 
                className={styles.instruction}
                style={{
                    top: `${msgTop}%`,
                    left: `${msgLeft}%`,
                    width: `${msgWidth}%`,
                    height: `${msgHeight}%`
                }}
            >
                <div className={styles.instructionButtons}>
                    <button className={styles.instructionButton} onClick={onRegress}>
                        Previous
                    </button>
                    <button className={styles.instructionButton} onClick={onAdvance} disabled={isNextDisabled}>
                        {nextBtnMessage}
                    </button>
                    <button className={styles.instructionButton} onClick={() => setShowSkip(true)}>
                        Skip
                    </button>
                </div>
                <div className={styles.instructionText}>
                    {message}
                </div>
                {
                    showSkip && <SkipPopup />
                }
            </div>
        </>
    )
}