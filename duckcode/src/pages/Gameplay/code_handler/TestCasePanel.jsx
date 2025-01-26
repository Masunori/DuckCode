import { useContext, useState } from "react";
import { QuestionContext } from "../Gameplay";

export default function TestCasePanel() {
    const [activeIndex, setActiveIndex] = useState(0);
    const testCases = useContext(QuestionContext).publicTestCases;

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
                                    {testCases[activeIndex].input.map((i, idx) => (
                                        <code key={idx}>{i}</code>
                                    ))}
                                </pre>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><p>Expected</p></th>
                            <td>
                                <pre>
                                    {testCases[activeIndex].expectedOutput.map((o, idx) => (
                                        <code key={idx}>{o}</code>
                                    ))}
                                </pre>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><p>Actual</p></th>
                            <td><pre><code>0 2</code></pre></td>
                        </tr>
                        <tr>
                            <th scope="row"><p>Message</p></th>
                            <td>
                                <code>
                                    [FAILED] Expected and Actual Outputs do not Match. 
                                    This is a very long long long long long long long 
                                    long long long long long long long long long long 
                                    long long long long long long long long long message.
                                    This is a very long long long long long long long 
                                    long long long long long long long long long long 
                                    long long long long long long long long long message.
                                </code>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}