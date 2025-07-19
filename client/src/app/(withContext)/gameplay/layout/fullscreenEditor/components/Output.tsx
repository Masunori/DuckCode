"use client";

import { useEffect, useRef } from "react";
import styles from "../page.module.css";
import { motion, AnimatePresence } from "motion/react";
import { useGameplayStore } from "../../../hooks/useGameplayStore";
import { useGameplayController } from "../../../hooks/useGameplayController";
import { useShallow } from "zustand/shallow";

export default function Output() {
    const codeOutput = useGameplayStore(state => state.codeOutput);
    const [informationMode, setInformationMode] = useGameplayController(
        useShallow(state => [state.informationMode, state.setInformationMode])
    );
    
    const CODE_FAIL_BORDER_COLOR = 'var(--error-code-text-border-color)';
    const CODE_WARNING_COLOR = 'var(--warn-code-text-border-color)';

    const overlayRef = useRef<HTMLDivElement>(null);
    const outputRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (overlayRef.current && outputRef.current
                && overlayRef.current.contains(event.target as Node)
                && !outputRef.current.contains(event.target as Node)
            ) {
                setInformationMode("-");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    });

    return (
        <AnimatePresence>
            {informationMode === "output" && (
                <>
                    <motion.div
                        className={styles.testCasePanelOverlay}
                        ref={overlayRef}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    ></motion.div>
                    <motion.div 
                        className={styles.codeOutputContainer}
                        ref={outputRef}
                        initial={{ opacity: 0, y: "100%" }}
                        animate={{ opacity: 1, y: "0%" }}
                        exit={{ opacity: 0, y: "100%" }}
                        transition={{ duration: 0.25, ease: "linear" }}
                    >
                        <div className={styles.codeOutput}>
                            {codeOutput.map((line, index) => (
                                <code key={index} style={{
                                    color: line.type === "error"
                                        ? CODE_FAIL_BORDER_COLOR
                                        : line.type === "warn"
                                        ? CODE_WARNING_COLOR
                                        : "var(--font-colour)"
                                }}>
                                    {line.content}
                                </code>
                            ))}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}