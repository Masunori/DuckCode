import { useContext, useEffect, useRef, useState } from "react";
import { QuestionContext } from "../Gameplay";
import { openConfirmWithMessage } from "../../../globalcomponents/utility_components/Confirm";

function TestCaseResults({ input, expectedOutput, testCaseResult }) {
    const [background, setBackground] = useState('var(--terminal-like-background-color)');
    const [border, setBorder] = useState('1px solid var(--second-layer-background-color)');

    useEffect(() => {
        setBackground(Array.isArray(testCaseResult.actualOutput) && testCaseResult.actualOutput.length === 0
            ? 'var(--terminal-like-background-color)'
            : testCaseResult.actualOutput.join('\n') === expectedOutput
            ? 'var(--valid-code-bg-color)'
            : 'var(--invalid-code-bg-color)');

        setBorder(Array.isArray(testCaseResult.actualOutput) && testCaseResult.actualOutput.length === 0
            ? '1px solid var(--second-layer-background-color)'
            : testCaseResult.actualOutput.join('\n')  === expectedOutput
            ? '1px solid var(--valid-code-border-color)'
            : '1px solid var(--invalid-code-border-color)');
    }, [expectedOutput, testCaseResult]);
     
    return (
        <div id="test-case-results">
                <table>
                    <tbody>
                        <tr>
                            <th scope="row"><p>Input</p></th>
                            <td style={{
                                backgroundColor: background,
                                border: border
                            }}>
                                <pre>
                                    {input.split('\n').map((i, idx) => (
                                        <code key={idx} style={{ backgroundColor: background }}>{i}</code>
                                    ))}
                                </pre>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><p>Expected</p></th>
                            <td style={{
                                backgroundColor: background,
                                border: border
                            }}>
                                <pre>
                                    {expectedOutput.split('\n').map((o, idx) => (
                                        <code key={idx} style={{ backgroundColor: background }}>{o}</code>
                                    ))}
                                </pre>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><p>Actual</p></th>
                            <td style={{
                                backgroundColor: background,
                                border: border
                            }}><pre>{
                                testCaseResult
                                ? testCaseResult.actualOutput.map((a, idx) => (
                                    <code key={idx} style={{ backgroundColor: background }}>{a}</code>
                                ))
                                : <code style={{ backgroundColor: background }}></code>
                            }</pre></td>
                        </tr>
                        <tr>
                            <th scope="row"><p>Message</p></th>
                            <td style={{
                                backgroundColor: background,
                                border: border
                            }}>
                                <code style={{ backgroundColor: background }}>{testCaseResult ? testCaseResult.status : ""}</code>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
    )
}

export default function TestCasePanel({ testCaseResults }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const testCaseButtonRefs = useRef([]);
    
    const testCases = useContext(QuestionContext).publicTestCases;

    useEffect(() => {
        if (testCaseResults) {
            for (let i = 0; i < testCaseResults.result.length; i++) {
                if (testCaseResults.result[i].status !== "Accepted") {
                    setActiveIndex(i);

                    openConfirmWithMessage(
                        `Notice: Public Test Case ${i + 1} has failed.`,
                        'NONE',
                        'Understood',
                        ()=>null,
                        ()=>null,
                        true
                    )

                    break;
                }
            }
        }
    }, [testCaseResults]);

    // useEffect(() => {
    //     const activeElement = testCaseButtonRefs.current[activeIndex];
    //     if (activeElement) {
    //         activeElement.scrollIntoView({
    //             behavior: 'smooth',
    //             block: 'center',
    //         });
    //     }
    // }, [activeIndex]);

    return (
        <div id="test-case-panel">
            <ul id="test-case-selector">
                {testCases.map((_, index) => <li 
                        ref={el => testCaseButtonRefs.current[index] = el}
                        onClick={() => setActiveIndex(index)}
                        key={index}
                        className={index === activeIndex ? "active" : ""}
                    >Test Case {index + 1}</li>)}
            </ul>
            <TestCaseResults
                input={testCases[activeIndex].input}
                expectedOutput={testCases[activeIndex].expectedOutput}
                testCaseResult={
                    testCaseResults 
                    ? testCaseResults.result[activeIndex] 
                    : {
                        actualOutput: [],
                        status: ""
                    }
                }
            />
        </div>
    )
}