import { useState } from "react";

export default function CodeHandlerButtons({ executeCodeInOutputMode, runAllTestCases }) {
    const [isTestCasesMode, setIsTestCasesMode] = useState(true);

    function toggleOutputAndTestCases() {
        const toggleButton = document.getElementById('toggle-output-testcases');
        const outputAndTestCasesDiv = document.getElementById('output-and-test-cases');
        const test = document.getElementById('test-case-panel');
        const runThisButton = document.getElementById('run-all-test-cases-button');
    
        if (isTestCasesMode) {
            toggleButton.innerText = "Switch to Test Case Panel";
            runThisButton.innerText = "Run Code";
            outputAndTestCasesDiv.style.transform = "translate(0, -50%)";
            setIsTestCasesMode(false);
            test.style.opacity = 0;
        } else {
            toggleButton.innerText = "Switch to Output Mode";
            runThisButton.innerText = "Run all Test Cases";
            outputAndTestCasesDiv.style.transform = "translate(0, 0)";
            setIsTestCasesMode(true);
            test.style.opacity = 1
        }
    }
    

    return (
        <div id="test-case-buttons">
            <button id="toggle-output-testcases" onClick={toggleOutputAndTestCases}>Switch to Output Mode</button>
            {/* <button>Add a Custom Test Case</button> */}
            <button 
                id="run-all-test-cases-button" 
                onClick={isTestCasesMode ? runAllTestCases : executeCodeInOutputMode}
            >Run all Test Cases</button>
            <button id="submit">Submit</button>
        </div>
    )
}