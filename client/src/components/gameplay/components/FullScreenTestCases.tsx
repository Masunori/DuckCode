"use client";

import { useBaseGameplayStore } from "@/hooks/useBaseGameplayStore";
import { RUN_CODE_STATUSES, RunCodeStatuses } from "@/services/types";
import { TestCase } from "@/utils/gameplay";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import styles from "./fullscreenEditor.module.css";

export default function FullScreenTestCases({ testCases }: { testCases: TestCase[] }) {
    const activeTestCaseIndex = useBaseGameplayStore(state => state.activeTestCaseIndex);
    const setActiveTestCaseIndex = useBaseGameplayStore(state => state.setActiveTestCaseIndex);
    const informationMode = useBaseGameplayStore(state => state.informationMode);
    const setInformationMode = useBaseGameplayStore(state => state.setInformationMode);

    const testCaseResults = useBaseGameplayStore(state => state.testCaseResults);
    const activeQuestionIndex = useBaseGameplayStore(state => state.activeQuestionIndex);
    const testCaseResultsForActiveQuestion = testCaseResults[activeQuestionIndex] || [];

    const overlayRef = useRef<HTMLDivElement>(null);
    const testCasesRef = useRef<HTMLDivElement>(null);

    const tdClassName = !testCaseResultsForActiveQuestion[activeTestCaseIndex]
        ? ""
        : RUN_CODE_STATUSES[testCaseResultsForActiveQuestion[activeTestCaseIndex].statusId] === RunCodeStatuses.ACCEPTED
            ? styles.pass
            : styles.fail;

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
        };
    }, [setInformationMode]);

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
                                    onClick={() => setActiveTestCaseIndex(index)}
                                    className={`
                                        ${index === activeTestCaseIndex ? styles.active : ""}
                                        ${testCaseResultsForActiveQuestion[index]
                                            ? (RUN_CODE_STATUSES[testCaseResultsForActiveQuestion[index].statusId] === RunCodeStatuses.ACCEPTED
                                                ? styles.pass
                                                : styles.fail)
                                            : ""}
                                    `}
                                >
                                    Test Case {index + 1} {(!testCaseResultsForActiveQuestion[index]) ? "" : RUN_CODE_STATUSES[testCaseResultsForActiveQuestion[index].statusId] === RunCodeStatuses.ACCEPTED ? "[✔]" : "[✖]"}
                                </motion.li>
                            ))}
                        </motion.ul>
                        <motion.div className={styles.testCaseResults}>
                            <motion.table>
                                <motion.tbody>
                                    <motion.tr>
                                        <motion.th scope="row">Input</motion.th>
                                        <motion.td className={tdClassName}>
                                            <motion.pre>
                                                {testCases[activeTestCaseIndex] ? testCases[activeTestCaseIndex].input.split('\n').map((input, idx) => (
                                                    <motion.code key={idx}>{input}</motion.code>
                                                )) : null}
                                            </motion.pre>
                                        </motion.td>
                                    </motion.tr>
                                    <motion.tr>
                                        <motion.th scope="row">Expected</motion.th>
                                        <motion.td className={tdClassName}>
                                            <motion.pre>
                                                {testCases[activeTestCaseIndex] ? testCases[activeTestCaseIndex].expectedOutput.split('\n').map((input, idx) => (
                                                    <motion.code key={idx}>{input}</motion.code>
                                                )) : null}
                                            </motion.pre>
                                        </motion.td>
                                    </motion.tr>
                                    <motion.tr>
                                        <motion.th scope="row">Actual</motion.th>
                                        <motion.td className={tdClassName}>
                                            <motion.pre>
                                                <motion.code>{testCaseResultsForActiveQuestion[activeTestCaseIndex]?.actualOutput ?? "Nothing yet"}</motion.code>
                                            </motion.pre>
                                        </motion.td>
                                    </motion.tr>
                                    <motion.tr>
                                        <motion.th scope="row">Message</motion.th>
                                        <motion.td className={tdClassName}>
                                            <motion.pre>
                                                <motion.code>{testCaseResultsForActiveQuestion[activeTestCaseIndex]?.message ?? "Nothing yet"}</motion.code>
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