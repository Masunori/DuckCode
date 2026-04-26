"use client";

import { RUN_CODE_RESPONSES, RunCodeStatuses } from "@/lib/apiClient/runCodeStatuses";
import { TestCase } from "@/lib/gameplay/utils";
import { CSSProperties, useCallback, useEffect, useRef } from "react";
import styles from "./default.module.css";
import { useBaseGameplayStore } from "@/lib/gameplay/hooks/useBaseGameplayStore";
import { GAMEPLAY_KEY_BINDINGS, translateCombo } from '@/lib/utils/keyBindings';
import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";
import { useGettingStartedInstruction } from "@/contexts/GettingStartedInstructionContext";

type TestCaseProps = {
    testCases: TestCase[];
    runCode: () => void;
    runTestCases: () => void;
    submitCode: () => void;
}

const CODE_FAIL_BORDER_COLOR = 'var(--wrong-on-hover-indicator-color)';
const CODE_SUCCEED_BORDER_COLOR = 'var(--correct-indicator-color)';
const CODE_WARNING_COLOR = 'var(--warn-code-text-border-color)';

const CODE_FAIL_BG_COLOR = 'var(--wrong-indicator-color)';
const CODE_FAIL_BG_COLOR_HOVER = 'var(--wrong-on-hover-indicator-color)';

const CODE_SUCCEED_BG_COLOR = 'var(--correct-indicator-color)';
const CODE_SUCCEED_BG_COLOR_HOVER = 'var(--correct-on-hover-indicator-color)';

export default function DefaultTestCases({
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

    // speficically for getting started instruction
    const ctx = useGettingStartedInstruction();
    
    const testCasesRef = useRef<HTMLDivElement | null>(null);
    const codeHandlerButtonsRef = useRef<HTMLDivElement | null>(null);
    const codeResultsRef = useRef<HTMLDivElement | null>(null);

    const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
    const runButtonRef = useRef<HTMLButtonElement | null>(null);
    const submitButtonRef = useRef<HTMLButtonElement | null>(null);

    const testCaseSelectorRef = useRef<HTMLUListElement | null>(null);
    const testCaseResultsRef = useRef<HTMLDivElement | null>(null);
    const testCaseInputRef = useRef<HTMLTableRowElement | null>(null);
    const testCaseExpectedRef = useRef<HTMLTableRowElement | null>(null);
    const testCaseActualRef = useRef<HTMLTableRowElement | null>(null);
    const testCaseMessageRef = useRef<HTMLTableRowElement | null>(null);

    useEffect(() => {
        const update = () => {
            if (testCasesRef.current) {
                ctx?.registerTargetRect("test-cases", testCasesRef.current.getBoundingClientRect());
            }

            if (codeHandlerButtonsRef.current) {
                ctx?.registerTargetRect("code-handler-buttons", codeHandlerButtonsRef.current.getBoundingClientRect());
            }
            
            if (codeResultsRef.current) {
                ctx?.registerTargetRect("code-results", codeResultsRef.current.getBoundingClientRect());
            }

            if (toggleButtonRef.current) {
                ctx?.registerTargetRect("toggle-button", toggleButtonRef.current.getBoundingClientRect());
            }

            if (runButtonRef.current) {
                ctx?.registerTargetRect("run-button", runButtonRef.current.getBoundingClientRect());
            }

            if (submitButtonRef.current) {
                ctx?.registerTargetRect("submit-button", submitButtonRef.current.getBoundingClientRect());
            }

            if (testCaseSelectorRef.current) {
                ctx?.registerTargetRect("test-case-selector", testCaseSelectorRef.current.getBoundingClientRect());
            }

            if (testCaseResultsRef.current) {
                ctx?.registerTargetRect("test-case-results", testCaseResultsRef.current.getBoundingClientRect());
            }

            if (testCaseInputRef.current) {
                ctx?.registerTargetRect("test-case-input", testCaseInputRef.current.getBoundingClientRect());
            }

            if (testCaseExpectedRef.current) {
                ctx?.registerTargetRect("test-case-expected", testCaseExpectedRef.current.getBoundingClientRect());
            }

            if (testCaseActualRef.current) {
                ctx?.registerTargetRect("test-case-actual", testCaseActualRef.current.getBoundingClientRect());
            }
            
            if (testCaseMessageRef.current) {
                ctx?.registerTargetRect("test-case-message", testCaseMessageRef.current.getBoundingClientRect());
            }
        }

        update();
        
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);


    const testCaseResultsForActiveQuestion = testCaseResults[activeQuestionIndex] || [];

    function selectTestCaseIndicator(idx: number) {
        return !testCaseResultsForActiveQuestion[idx]
            ? ""
            : RUN_CODE_RESPONSES[testCaseResultsForActiveQuestion[idx].statusId] === RunCodeStatuses.ACCEPTED
                ? "[✔]"
                : "[✖]";
    }

    // printd("@/components/gameplay/layout/default/components/TestCases", "Rendering TestCases with testCases:", testCases, "and testCaseResults:", testCaseResults);

    const testCaseSelectorsRef = useRef<HTMLLIElement[] | null[]>([]);

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

    const userPreference = useUserPreferenceStore(state => state.userPreference);
    const switchModeKeyHint = userPreference.displayKeyBindingOnButtons
        ? <kbd>[{translateCombo(GAMEPLAY_KEY_BINDINGS["TOGGLE_OUTPUT_TEST_CASE_MODE"].combo)}]</kbd>
        : "";

    const runCodeKeyHint = userPreference.displayKeyBindingOnButtons
        ? <kbd>[{translateCombo(GAMEPLAY_KEY_BINDINGS["RUN_CODE_OUTPUT_MODE"].combo)}]</kbd>
        : "";

    const runTestCasesKeyHint = userPreference.displayKeyBindingOnButtons
        ? <kbd>[{translateCombo(GAMEPLAY_KEY_BINDINGS["RUN_TEST_CASES"].combo)}]</kbd>
        : "";

    const submitCodeKeyHint = userPreference.displayKeyBindingOnButtons
        ? <kbd>[{translateCombo(GAMEPLAY_KEY_BINDINGS["SUBMIT_CODE"].combo)}]</kbd>
        : "";

    return (
        <div className={styles.testCases} ref={testCasesRef}>
            <div className={styles.codeHandlerButtons} ref={codeHandlerButtonsRef}>
                <button
                    className={styles.togglePanelButton}
                    ref={toggleButtonRef}
                    onClick={() => setInformationMode(informationMode === "output" ? "testCases" : "output")}
                >
                    <b>{informationMode === "output" ? "Switch to Test Cases Mode" : "Switch to Output Mode"}</b>
                    {switchModeKeyHint}
                </button>
                <button
                    className={styles.runAllTestCasesButton}
                    ref={runButtonRef}
                    onClick={informationMode === "output" ? runCode : runTestCases}
                    disabled={isLocked} style={{
                        pointerEvents: isLocked ? "none" : "auto",
                    }}
                >
                    {informationMode === "output" ? <b>Run Code</b> : <b>Run all Test Cases</b>}
                    {informationMode === "output" ? runCodeKeyHint : runTestCasesKeyHint}
                </button>
                <button
                    className={styles.submitCodeButton}
                    ref={submitButtonRef}
                    onClick={submitCode}
                    disabled={isLocked} style={{
                        pointerEvents: isLocked ? "none" : "auto",
                    }}
                ><b>Submit</b> {submitCodeKeyHint}</button>
            </div>
            <div className={styles.codeResults} ref={codeResultsRef}>
                <div
                    className={styles.testCasePanel}
                    style={{
                        height: informationMode === "output" ? "0" : "100%",
                        opacity: informationMode === "output" ? "0" : "1"
                    }}
                >
                    <ul className={styles.testCaseSelector} ref={testCaseSelectorRef}>
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

                                    fontWeight: index === activeTestCaseIndex
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
                    <div className={styles.testCaseResults} ref={testCaseResultsRef}>
                        <table>
                            <tbody>
                                <tr ref={testCaseInputRef}>
                                    <th scope="row">Input</th>
                                    <td style={tdStyle}>
                                        <pre>
                                            {testCases[activeTestCaseIndex] ? testCases[activeTestCaseIndex].input.split('\n').map((input, idx) => (
                                                <code key={idx}>{input}</code>
                                            )) : null}
                                        </pre>
                                    </td>
                                </tr>
                                <tr ref={testCaseExpectedRef}>
                                    <th scope="row">Expected</th>
                                    <td style={tdStyle}>
                                        <pre>
                                            {testCases[activeTestCaseIndex] ? testCases[activeTestCaseIndex].expectedOutput.split('\n').map((input, idx) => (
                                                <code key={idx}>{input}</code>
                                            )) : null}
                                        </pre>
                                    </td>
                                </tr>
                                <tr ref={testCaseActualRef}>
                                    <th scope="row">Actual</th>
                                    <td style={tdStyle}>
                                        <pre>
                                            <code>{testCaseResultsForActiveQuestion[activeTestCaseIndex]?.actualOutput ?? "Nothing yet"}</code>
                                        </pre>
                                    </td>
                                </tr>
                                <tr ref={testCaseMessageRef}>
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
                                ? CODE_FAIL_BG_COLOR
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