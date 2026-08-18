"use client";

import { useBaseGameplayStore } from "@/hooks/useBaseGameplayStore";
import { RUN_CODE_STATUSES, RunCodeStatuses } from "@/services/apiClient/types";
import { TestCase } from "@/utils/gameplay";
import styles from "./twoTabs.module.css";

export default function TwoTabsTestCases({ testCases }: { testCases: TestCase[] }) {
    const activeTestCaseIndex = useBaseGameplayStore(state => state.activeTestCaseIndex);
    const setActiveTestCaseIndex = useBaseGameplayStore(state => state.setActiveTestCaseIndex);
    const testCaseResults = useBaseGameplayStore(state => state.testCaseResults);
    const activeQuestionIndex = useBaseGameplayStore(state => state.activeQuestionIndex);

    const testCaseResultsForActiveQuestion = testCaseResults[activeQuestionIndex] || [];

    function selectTestCaseIndicator(idx: number) {
        return !testCaseResultsForActiveQuestion[idx]
            ? ""
            : RUN_CODE_STATUSES[testCaseResultsForActiveQuestion[idx].statusId] === RunCodeStatuses.ACCEPTED
                ? "[✔]"
                : "[✖]";
    }

    const tdClassName = !testCaseResultsForActiveQuestion[activeTestCaseIndex]
        ? ""
        : RUN_CODE_STATUSES[testCaseResultsForActiveQuestion[activeTestCaseIndex].statusId] === RunCodeStatuses.ACCEPTED
            ? styles.pass
            : styles.fail;

    return (
        <div className={styles.testCasePanel}>
            <ul className={styles.testCaseSelector}>
                {testCases.map((_, index) => (
                    <li
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
                        Test Case {index + 1} {selectTestCaseIndicator(index)}
                    </li>
                ))}
            </ul>
            <div className={styles.testCaseResults}>
                <table>
                    <tbody>
                        <tr>
                            <th scope="row">Input</th>
                            <td className={tdClassName}>
                                <pre>
                                    {testCases[activeTestCaseIndex] ? testCases[activeTestCaseIndex].input.split('\n').map((input, idx) => (
                                        <code key={idx}>{input}</code>
                                    )) : null}
                                </pre>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Expected</th>
                            <td className={tdClassName}>
                                <pre>
                                    {testCases[activeTestCaseIndex] ? testCases[activeTestCaseIndex].expectedOutput.split('\n').map((input, idx) => (
                                        <code key={idx}>{input}</code>
                                    )) : null}
                                </pre>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Actual</th>
                            <td className={tdClassName}>
                                <pre>
                                    <code>{testCaseResultsForActiveQuestion[activeTestCaseIndex]?.actualOutput ?? "Nothing yet"}</code>
                                </pre>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Message</th>
                            <td className={tdClassName}>
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