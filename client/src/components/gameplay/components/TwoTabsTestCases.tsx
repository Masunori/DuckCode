"use client";

import { RUN_CODE_RESPONSES, RunCodeStatuses } from "@/lib/apiClient/runCodeStatuses";
import { TestCase } from "@/lib/gameplay/utils";
import { CSSProperties, useRef } from "react";
import styles from "./twoTabs.module.css";
import { useBaseGameplayStore } from "@/lib/gameplay/hooks/useBaseGameplayStore";

const CODE_FAIL_BORDER_COLOR = 'var(--wrong-on-hover-indicator-color)';
const CODE_SUCCEED_BORDER_COLOR = 'var(--correct-indicator-color)';
const CODE_WARNING_COLOR = 'var(--warn-code-text-border-color)';

const CODE_FAIL_BG_COLOR = 'var(--wrong-indicator-color)';
const CODE_FAIL_BG_COLOR_HOVER = 'var(--wrong-on-hover-indicator-color)';

const CODE_SUCCEED_BG_COLOR = 'var(--correct-indicator-color)';
const CODE_SUCCEED_BG_COLOR_HOVER = 'var(--correct-on-hover-indicator-color)';

export default function TwoTabsTestCases({ testCases }: { testCases: TestCase[] }) {
    const activeTestCaseIndex = useBaseGameplayStore(state => state.activeTestCaseIndex);
    const setActiveTestCaseIndex = useBaseGameplayStore(state => state.setActiveTestCaseIndex);
    const testCaseResults = useBaseGameplayStore(state => state.testCaseResults);
    const activeQuestionIndex = useBaseGameplayStore(state => state.activeQuestionIndex);

    const testCaseResultsForActiveQuestion = testCaseResults[activeQuestionIndex];

    const testCaseSelectorsRef = useRef<HTMLLIElement[] | null[]>([]);

    function selectTestCaseIndicator(idx: number) {
        return !testCaseResultsForActiveQuestion[idx]
            ? ""
            : RUN_CODE_RESPONSES[testCaseResultsForActiveQuestion[idx].statusId] === RunCodeStatuses.ACCEPTED
                ? "[✔]"
                : "[✖]";
    }

    const tdStyle: CSSProperties = {
        backgroundColor: "var(--terminal-like-background-color)",
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
        <div className={styles.testCasePanel}>
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
                        Test Case {index + 1} {selectTestCaseIndicator(index)}
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
    );
}