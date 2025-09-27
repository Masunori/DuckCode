"use client";

import { CSSProperties, useEffect, useRef } from "react";
import styles from "../page.module.css";
import { RUN_CODE_RESPONSES, RunCodeStatuses } from "@/lib/apiClient/runCodeStatuses";
import { motion, AnimatePresence } from "motion/react";
import { useGameplayController } from "../../../hooks/useGameplayController";
import { useShallow } from "zustand/shallow";
import { useGameplayStore } from "../../../hooks/useGameplayStore";
import { TestCase } from "../../../gameplayUtils";

export default function TestCases({ testCases }: { testCases: TestCase[] }) {
    const [
        activeIndex, 
        setActiveIndex, 
        informationMode, 
        setInformationMode
    ] = useGameplayController(
        useShallow(state => [
            state.activeIndex,
            state.setActiveIndex,
            state.informationMode,
            state.setInformationMode,
        ])
    );

    const testCaseResults = useGameplayStore(state => state.testCaseResults);

    const testCaseSelectorsRef = useRef<HTMLLIElement[] | null[]>([]);
    const overlayRef = useRef<HTMLDivElement>(null);
    const testCasesRef = useRef<HTMLDivElement>(null);

    const CODE_FAIL_BORDER_COLOR = 'var(--error-code-text-border-color)';
    const CODE_SUCCEED_BORDER_COLOR = 'var(--success-code-text-border-color)';

    const CODE_FAIL_BG_COLOR = 'var(--error-test-case-bg-color)';
    const CODE_FAIL_BG_COLOR_HOVER = 'var(--error-test-case-bg-color-hover)';

    const CODE_SUCCEED_BG_COLOR = 'var(--success-test-case-bg-color)';
    const CODE_SUCCEED_BG_COLOR_HOVER = 'var(--success-test-case-bg-color-hover)';

    const tdStyle: CSSProperties = {
        backgroundColor: !testCaseResults[activeIndex]
            ? "var(--terminal-like-background-color)"
            : RUN_CODE_RESPONSES[testCaseResults[activeIndex].statusId] === RunCodeStatuses.ACCEPTED
            ? CODE_SUCCEED_BG_COLOR
            : CODE_FAIL_BG_COLOR,
        borderColor: !testCaseResults[activeIndex]
            ? "var(--second-layer-background-color)"
            : RUN_CODE_RESPONSES[testCaseResults[activeIndex].statusId] === RunCodeStatuses.ACCEPTED
            ? CODE_SUCCEED_BORDER_COLOR
            : CODE_FAIL_BORDER_COLOR,
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (overlayRef.current && testCasesRef.current
                && overlayRef.current.contains(event.target as Node)
                && !testCasesRef.current.contains(event.target as Node)
            ) {
                setInformationMode("-");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    });

    // handle test case selector hovering
    function handleOnMouseEnter(index: number) {
        if (!testCaseSelectorsRef.current[index]) {
            return;
        }
        
        testCaseSelectorsRef.current[index].style.backgroundColor = !testCaseResults[index]
            ? "var(--first-layer-background-color)"
            : RUN_CODE_RESPONSES[testCaseResults[index].statusId] === RunCodeStatuses.ACCEPTED
            ? CODE_SUCCEED_BG_COLOR_HOVER
            : CODE_FAIL_BG_COLOR_HOVER
    }

    function handleOnMouseLeave(index: number) {
        if (!testCaseSelectorsRef.current[index] || index === activeIndex) {
            return;
        }
        
        testCaseSelectorsRef.current[index].style.backgroundColor = !testCaseResults[index]
            ? "var(--second-layer-background-color)"
            : RUN_CODE_RESPONSES[testCaseResults[index].statusId] === RunCodeStatuses.ACCEPTED
            ? CODE_SUCCEED_BG_COLOR
            : CODE_FAIL_BG_COLOR
    }

    return (
        <AnimatePresence>
            {informationMode === "testCases" && (
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
                        className={styles.testCasePanel}
                        ref={testCasesRef}
                        initial={{ opacity: 0, y: "100%" }}
                        animate={{ opacity: 1, y: "0%" }}
                        exit={{ opacity: 0, y: "100%" }}
                        transition={{ duration: 0.25, ease: "linear" }}
                    >
                        <motion.ul className={styles.testCaseSelector}>
                            {testCases.map((_, index) => (
                                <motion.li 
                                    key={index}
                                    ref={el => { testCaseSelectorsRef.current[index] = el; }}
                                    onClick={() => setActiveIndex(index)}
                                    style={{
                                        backgroundColor: !testCaseResults[index]
                                            ? (index === activeIndex ? "var(--first-layer-background-color" : "var(--second-layer-background-color)")
                                            : RUN_CODE_RESPONSES[testCaseResults[index].statusId] === RunCodeStatuses.ACCEPTED
                                            ? (index === activeIndex ? CODE_SUCCEED_BG_COLOR_HOVER : CODE_SUCCEED_BG_COLOR) 
                                            : (index === activeIndex ? CODE_FAIL_BG_COLOR_HOVER : CODE_FAIL_BG_COLOR),

                                        fontWeight: testCaseResults[index] && RUN_CODE_RESPONSES[testCaseResults[index].statusId] !== RunCodeStatuses.ACCEPTED
                                            ? 600
                                            : 400,
                                    }}
                                    onMouseEnter={() => handleOnMouseEnter(index)}
                                    onMouseLeave={() => handleOnMouseLeave(index)}
                                >
                                    Test Case {index + 1}
                                </motion.li>
                            ))}
                        </motion.ul>
                        <motion.div className={styles.testCaseResults}>
                            <motion.table>
                                <motion.tbody>
                                    <motion.tr>
                                        <motion.th scope="row">Input</motion.th>
                                        <motion.td style={tdStyle}>
                                            <motion.pre>
                                                {testCases[activeIndex].input.split('\n').map((input, idx) => (
                                                    <motion.code key={idx}>{input}</motion.code>
                                                ))}
                                            </motion.pre>
                                        </motion.td>
                                    </motion.tr>
                                    <motion.tr>
                                        <motion.th scope="row">Expected</motion.th>
                                        <motion.td style={tdStyle}>
                                            <motion.pre>
                                                {testCases[activeIndex].expectedOutput.split('\n').map((input, idx) => (
                                                    <motion.code key={idx}>{input}</motion.code>
                                                ))}
                                            </motion.pre>
                                        </motion.td>
                                    </motion.tr>
                                    <motion.tr>
                                        <motion.th scope="row">Actual</motion.th>
                                        <motion.td style={tdStyle}>
                                            <motion.pre>
                                                <motion.code>{testCaseResults[activeIndex]?.actualOutput ?? "Nothing yet"}</motion.code>
                                            </motion.pre>
                                        </motion.td>
                                    </motion.tr>
                                    <motion.tr>
                                        <motion.th scope="row">Message</motion.th>
                                        <motion.td style={tdStyle}>
                                            <motion.pre>
                                                <motion.code>{testCaseResults[activeIndex]?.message ?? "Loremipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}</motion.code>
                                            </motion.pre>
                                        </motion.td>
                                    </motion.tr>
                                </motion.tbody>
                            </motion.table>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}