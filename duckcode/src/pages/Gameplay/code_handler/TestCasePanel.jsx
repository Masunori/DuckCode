import { useContext, useEffect, useState } from "react";
import { QuestionContext } from "../Gameplay";

export default function TestCasePanel({ testCaseResults }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const testCases = useContext(QuestionContext).publicTestCases;

    useEffect(() => {
        console.log(testCaseResults);
    }, [testCaseResults]);

    return (
        <div id="test-case-panel">
            <ul id="test-case-selector">
                {testCases.map((_, index) => <li 
                        onClick={() => setActiveIndex(index)}
                        key={index}
                        className={index === activeIndex ? "active" : ""}
                    >Test Case {index + 1}</li>)}
            </ul>
            <div id="test-case-results">
                <table>
                    <tbody>
                        <tr>
                            <th scope="row"><p>Input</p></th>
                            <td>
                                <pre>
                                    {testCases[activeIndex].input.split('\n').map((i, idx) => (
                                        <code key={idx}>{i}</code>
                                    ))}
                                </pre>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><p>Expected</p></th>
                            <td>
                                <pre>
                                    {testCases[activeIndex].expectedOutput.split('\n').map((o, idx) => (
                                        <code key={idx}>{o}</code>
                                    ))}
                                </pre>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><p>Actual</p></th>
                            <td><pre>{
                                testCaseResults && testCaseResults.success 
                                ? testCaseResults.results[activeIndex].stdout
                                    .split('\n')
                                    .map((o, idx) => (<code key={idx}>{o}</code>))
                                : <code></code>
                            }</pre></td>
                        </tr>
                        <tr>
                            <th scope="row"><p>Message</p></th>
                            <td>
                                {
                                    testCaseResults && testCaseResults.success
                                    ? testCaseResults.results[activeIndex].status
                                        .split('\n')
                                        .map((o, idx) => (<code key={idx}>{o}</code>))
                                    : <code></code>
                                }
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}