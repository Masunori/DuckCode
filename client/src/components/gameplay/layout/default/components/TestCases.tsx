"use client";

import { RUN_CODE_RESPONSES, RunCodeStatuses } from "@/lib/apiClient/runCodeStatuses";
import { TestCase } from "@/lib/gameplay/utils";
import { CSSProperties, useCallback, useRef } from "react";
import styles from "../page.module.css";
import { useBaseGameplayStore } from "@/lib/gameplay/hooks/useBaseGameplayStore";
import { printd } from "@/lib/utils/debugUtils";

type TestCaseProps = {
    testCases: TestCase[];
    runCode: () => void;
    runTestCases: () => void;
    submitCode: () => void;
}

const CODE_FAIL_BORDER_COLOR = 'var(--error-code-text-border-color)';
const CODE_SUCCEED_BORDER_COLOR = 'var(--success-code-text-border-color)';
const CODE_WARNING_COLOR = 'var(--warn-code-text-border-color)';

const CODE_FAIL_BG_COLOR = 'var(--error-test-case-bg-color)';
const CODE_FAIL_BG_COLOR_HOVER = 'var(--error-test-case-bg-color-hover)';

const CODE_SUCCEED_BG_COLOR = 'var(--success-test-case-bg-color)';
const CODE_SUCCEED_BG_COLOR_HOVER = 'var(--success-test-case-bg-color-hover)';

export default function TestCases({
    testCases,
    runCode,
    runTestCases,
    submitCode,
}: TestCaseProps) {
    const codeOutput = useBaseGameplayStore(s => s.codeOutput);
    const testCaseResults = useBaseGameplayStore(s => s.testCaseResults);

    const informationMode = useBaseGameplayStore(s => s.informationMode);
    const setInformationMode = useBaseGameplayStore(s => s.setInformationMode);

    const activeTestCaseIndex = useBaseGameplayStore(s => s.activeTestCaseIndex);
    const setActiveTestCaseIndex = useBaseGameplayStore(s => s.setActiveTestCaseIndex);

    const activeQuestionIndex = useBaseGameplayStore(s => s.activeQuestionIndex);
    const isLocked = useBaseGameplayStore(s => s.isLocked);


    const testCaseResultsForActiveQuestion = testCaseResults[activeQuestionIndex] || [];

    // printd("@/components/gameplay/layout/default/components/TestCases", "Rendering TestCases with testCases:", testCases, "and testCaseResults:", testCaseResults);

    const testCaseSelectorsRef = useRef<HTMLLIElement[] | null[]>([]);

    const tdStyle: CSSProperties = {
        backgroundColor: !testCaseResultsForActiveQuestion[activeTestCaseIndex]
            ? "var(--terminal-like-background-color)"
            : RUN_CODE_RESPONSES[testCaseResultsForActiveQuestion[activeTestCaseIndex].statusId] === RunCodeStatuses.ACCEPTED
                ? CODE_SUCCEED_BG_COLOR
                : CODE_FAIL_BG_COLOR,
        borderColor: !testCaseResultsForActiveQuestion[activeTestCaseIndex]
            ? "var(--second-layer-background-color)"
            : RUN_CODE_RESPONSES[testCaseResultsForActiveQuestion[activeTestCaseIndex].statusId] === RunCodeStatuses.ACCEPTED
                ? CODE_SUCCEED_BORDER_COLOR
                : CODE_FAIL_BORDER_COLOR,
    }

    // handle test case selector hovering
    function handleOnMouseEnter(index: number) {
        if (!testCaseSelectorsRef.current[index]) {
            return;
        }

        testCaseSelectorsRef.current[index].style.backgroundColor = !testCaseResultsForActiveQuestion[index]
            ? "var(--first-layer-background-color)"
            : RUN_CODE_RESPONSES[testCaseResultsForActiveQuestion[index].statusId] === RunCodeStatuses.ACCEPTED
                ? CODE_SUCCEED_BG_COLOR_HOVER
                : CODE_FAIL_BG_COLOR_HOVER
    }

    function handleOnMouseLeave(index: number) {
        if (!testCaseSelectorsRef.current[index] || index === activeTestCaseIndex) {
            return;
        }

        testCaseSelectorsRef.current[index].style.backgroundColor = !testCaseResultsForActiveQuestion[index]
            ? "var(--second-layer-background-color)"
            : RUN_CODE_RESPONSES[testCaseResultsForActiveQuestion[index].statusId] === RunCodeStatuses.ACCEPTED
                ? CODE_SUCCEED_BG_COLOR
                : CODE_FAIL_BG_COLOR
    }

    return (
        <div className={styles.testCases}>
            <div className={styles.codeHandlerButtons}>
                <button
                    className={styles.togglePanelButton}
                    onClick={() => setInformationMode(informationMode === "output" ? "testCases" : "output")}
                >{informationMode === "output" ? "Switch to Test Cases Mode" : "Switch to Output Mode"}</button>
                <button
                    className={styles.runAllTestCasesButton}
                    onClick={informationMode === "output" ? runCode : runTestCases}
                    disabled={isLocked} style={{
                        pointerEvents: isLocked ? "none" : "auto",
                    }}
                >{informationMode === "output" ? "Run Code" : "Run all Test Cases"}</button>
                <button
                    className={styles.submitCodeButton}
                    onClick={submitCode}
                    disabled={isLocked} style={{
                        pointerEvents: isLocked ? "none" : "auto",
                    }}
                >Submit</button>
            </div>
            <div className={styles.codeResults}>
                <div
                    className={styles.testCasePanel}
                    style={{
                        height: informationMode === "output" ? "0" : "100%",
                        opacity: informationMode === "output" ? "0" : "1"
                    }}
                >
                    <ul className={styles.testCaseSelector}>
                        {testCases.map((_, index) => (
                            <li
                                key={index}
                                ref={el => { testCaseSelectorsRef.current[index] = el; }}
                                onClick={() => setActiveTestCaseIndex(index)}
                                style={{
                                    backgroundColor: !testCaseResultsForActiveQuestion[index]
                                        ? (index === activeTestCaseIndex ? "var(--first-layer-background-color" : "var(--second-layer-background-color)")
                                        : RUN_CODE_RESPONSES[testCaseResultsForActiveQuestion[index].statusId] === RunCodeStatuses.ACCEPTED
                                            ? (index === activeTestCaseIndex ? CODE_SUCCEED_BG_COLOR_HOVER : CODE_SUCCEED_BG_COLOR)
                                            : (index === activeTestCaseIndex ? CODE_FAIL_BG_COLOR_HOVER : CODE_FAIL_BG_COLOR),

                                    fontWeight: testCaseResultsForActiveQuestion[index] && RUN_CODE_RESPONSES[testCaseResultsForActiveQuestion[index].statusId] !== RunCodeStatuses.ACCEPTED
                                        ? 600
                                        : 400,
                                }}
                                onMouseEnter={() => handleOnMouseEnter(index)}
                                onMouseLeave={() => handleOnMouseLeave(index)}
                            >
                                Test Case {index + 1}
                            </li>
                        ))}
                    </ul>
                    <div className={styles.testCaseResults}>
                        <table>
                            <tbody>
                                <tr>
                                    <th scope="row">Input</th>
                                    <td style={tdStyle}>
                                        <pre>
                                            {testCases[activeTestCaseIndex] ? testCases[activeTestCaseIndex].input.split('\n').map((input, idx) => (
                                                <code key={idx}>{input}</code>
                                            )) : null}
                                        </pre>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">Expected</th>
                                    <td style={tdStyle}>
                                        <pre>
                                            {testCases[activeTestCaseIndex] ? testCases[activeTestCaseIndex].expectedOutput.split('\n').map((input, idx) => (
                                                <code key={idx}>{input}</code>
                                            )) : null}
                                        </pre>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">Actual</th>
                                    <td style={tdStyle}>
                                        <pre>
                                            <code>{testCaseResultsForActiveQuestion[activeTestCaseIndex]?.actualOutput ?? "Nothing yet"}</code>
                                        </pre>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">Message</th>
                                    <td style={tdStyle}>
                                        <pre>
                                            <code>{testCaseResultsForActiveQuestion[activeTestCaseIndex]?.message ?? "Nothing yet"}</code>
                                        </pre>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div
                    className={styles.codeOutput}
                    style={{
                        height: informationMode === "output" ? "100%" : "0",
                        opacity: informationMode === "output" ? "1" : "0"
                    }}
                >
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
            </div>
        </div>
    );
}