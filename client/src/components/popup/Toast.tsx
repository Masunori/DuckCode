"use client";

import { useToast } from "@/contexts/ToastContext";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import styles from "./popup.module.css";

const LEVEL_TO_COLOR: Record<string, string> = {
    "success": 'var(--correct-indicator-color)',
    "error": 'var(--wrong-indicator-color)',
    "info": 'var(--significant-button-color)',
    "warning": 'var(--warn-indicator-color)',
}

const LEVEL_TO_ICON: Record<string, string> = {
    "success": '✓',
    "error": '×',
    "info": 'i',
    "warning": '!',
}

/**
 * A non-blocking toast notification component.
 * @returns 
 */
export default function Toast() {
    const { isPopupOpen, level, message, isLoading, duration, closePopup } = useToast();

    useEffect(() => {
        if (isPopupOpen && duration > 0) {
            const timer = setTimeout(() => {
                closePopup();
            }, duration * 1000);

            return () => clearTimeout(timer);
        }
    }, [isPopupOpen, duration, closePopup]);

    const [trailingDots, setTrailingDots] = useState(".");

    useEffect(() => {
        if (!isLoading) return;

        const interval = setInterval(() => {
            setTrailingDots(prev => prev.length >= 3 ? "." : prev + ".");
        }, 500);

        return () => clearInterval(interval);
    }, [isLoading]);

    return (
        <AnimatePresence>
            {isPopupOpen && (
                <motion.div
                    className={styles.toast}
                    style={{
                        boxShadow: `${LEVEL_TO_COLOR[level]} 0 0 0.5rem`
                    }}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className={styles.toastContent}>
                        <div className={styles.toastIcon} style={{ 
                            borderColor: LEVEL_TO_COLOR[level],
                            color: LEVEL_TO_COLOR[level],
                        }}>
                            {LEVEL_TO_ICON[level]}
                        </div>
                        <div className={styles.toastMessage}>
                            {message}{isLoading && trailingDots}
                        </div>
                        <button className={styles.toastCloseButton} onClick={closePopup}>
                            ×
                        </button>
                    </div>
                    
                    {
                        duration > 0 && (
                            <div className={styles.toastProgress}>
                                <motion.div
                                    className={styles.toastProgressBar}
                                    style={{
                                        backgroundColor: LEVEL_TO_COLOR[level],
                                    }}
                                    initial={{ width: "100%" }}
                                    animate={{ width: "0%" }}
                                    transition={{ duration: duration, ease: "linear" }}
                                />
                            </div>
                        )
                    }
                </motion.div>
            )}
        </AnimatePresence>
    )
}