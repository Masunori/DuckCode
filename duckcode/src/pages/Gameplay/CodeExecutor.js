import { useState } from "react";

function TestCasePanel({ testCases }) {
    const [activeIndex, setActiveIndex] = useState(0);
    console.log(activeIndex);

    const setAndLog = (i) => {
        setActiveIndex(i);
        console.log(i);
    };

    return (
        <div id="test-case-panel">
            <ul id="test-case-selector">
                {testCases.map((_, index) => <li 
                        onClick={() => setAndLog(index)}
                        key={index}
                        className={index === activeIndex ? "active" : ""}
                    >Test Case {index + 1}</li>)}
            </ul>
            <table id="test-case-results">
                <tbody>
                    <tr>
                        <th scope="row"><p>Input</p></th>
                        <td><code>{testCases[activeIndex][0]}</code></td>
                    </tr>
                    <tr>
                        <th scope="row"><p>Expected</p></th>
                        <td><code>{testCases[activeIndex][1]}</code></td>
                    </tr>
                    <tr>
                        <th scope="row"><p>Actual</p></th>
                        <td><code>[0, 2]</code></td>
                    </tr>
                    <tr>
                        <th scope="row"><p>Message</p></th>
                        <td>
                            <code>
                                [FAILED] Expected and Actual Outputs do not Match. 
                                This is a very long long long long long long long 
                                long long long long long long long long long long 
                                long long long long long long long long long message.
                            </code>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

function Output() {
    return (
        <div>
            
        </div>
    )
}

export default function CodeExecutor({ testCases }) {
    const [activeIndex, setActiveIndex] = useState(0);
    console.log(activeIndex);

    const setAndLog = (i) => {
        setActiveIndex(i);
        console.log(i);
    };

    return (
        <div id="code-executor">
            <div id="test-case-buttons">
                <button>Switch to Output Mode</button>
                <button>Add a Custom Test Case</button>
                <button>Run this Test Case</button>
                <button>Run all Test Cases</button>
                <button id="submit">Submit</button>
            </div>
            <ul id="test-case-selector">
                {testCases.map((_, index) => <li 
                        onClick={() => setAndLog(index)}
                        key={index}
                        className={index === activeIndex ? "active" : ""}
                    >Test Case {index + 1}</li>)}
            </ul>
            <table id="test-case-results">
                <tbody>
                    <tr>
                        <th scope="row"><p>Input</p></th>
                        <td><code>{testCases[activeIndex][0]}</code></td>
                    </tr>
                    <tr>
                        <th scope="row"><p>Expected</p></th>
                        <td><code>{testCases[activeIndex][1]}</code></td>
                    </tr>
                    <tr>
                        <th scope="row"><p>Actual</p></th>
                        <td><code>[0, 2]</code></td>
                    </tr>
                    <tr>
                        <th scope="row"><p>Message</p></th>
                        <td>
                            <code>
                                [FAILED] Expected and Actual Outputs do not Match. 
                                This is a very long long long long long long long 
                                long long long long long long long long long long 
                                long long long long long long long long long message.
                            </code>
                        </td>
                    </tr>
                </tbody>
            </table>
            {/* <TestCasePanel testCases={testCases} /> */}
        </div>
    )
}