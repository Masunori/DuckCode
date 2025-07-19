"use client";

import { CSSProperties, Dispatch, SetStateAction, useRef } from "react";
import { TestCase, TestCaseResult } from "../multiplayerUtils";
import styles from "../page.module.css";
import { OutputEntry, RUN_CODE_RESPONSES, RunCodeStatuses } from "@/app/api/gameplay/RunCodeStatuses";

// ignore this

type TestCaseProps = {
    activeIndex: number;
    setActiveIndex: Dispatch<SetStateAction<number>>
    testCases: TestCase[];
    isOutputMode: boolean;
    setIsOutputMode: Dispatch<SetStateAction<boolean>>;
    codeOutput: OutputEntry[];
    testCaseResults: TestCaseResult[];
}

export default function TestCases({ 
    activeIndex,
    setActiveIndex,
    testCases, 
    isOutputMode,
    codeOutput,
    testCaseResults, 
} : TestCaseProps) {
    const testCaseSelectorsRef = useRef<HTMLLIElement[] | null[]>([]);

    const CODE_FAIL_BORDER_COLOR = 'var(--error-code-text-border-color)';
    const CODE_SUCCEED_BORDER_COLOR = 'var(--success-code-text-border-color)';
    const CODE_WARNING_COLOR = 'var(--warn-code-text-border-color)';

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
        <div className={styles.testCases}>
            <div className={styles.codeResults}>
                <div 
                    className={styles.testCasePanel}
                    style={{
                        height: isOutputMode ? "0" : "100%",
                        opacity: isOutputMode ? "0" : "1"
                    }}
                >
                    <ul className={styles.testCaseSelector}>
                        {testCases.map((_, index) => (
                            <li 
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
                                            {testCases[activeIndex].input.split('\n').map((input, idx) => (
                                                <code key={idx}>{input}</code>
                                            ))}
                                        </pre>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">Expected</th>
                                    <td style={tdStyle}>
                                        <pre>
                                            {testCases[activeIndex].expectedOutput.split('\n').map((input, idx) => (
                                                <code key={idx}>{input}</code>
                                            ))}
                                        </pre>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">Actual</th>
                                    <td style={tdStyle}>
                                        <pre>
                                            <code>{testCaseResults[activeIndex]?.actualOutput ?? "Nothing yet"}</code>
                                        </pre>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">Message</th>
                                    <td style={tdStyle}>
                                        <pre>
                                            <code>{testCaseResults[activeIndex]?.message ?? "Loremipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}</code>
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
                        height: isOutputMode ? "100%" : "0",
                        opacity: isOutputMode ? "1" : "0"
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