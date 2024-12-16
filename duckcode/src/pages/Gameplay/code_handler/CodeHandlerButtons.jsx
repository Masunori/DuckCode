let isTestCasesMode = true;

function toggleOutputAndTestCases() {
    const toggleButton = document.getElementById('toggle-output-testcases');
    const outputAndTestCasesDiv = document.getElementById('output-and-test-cases');
    const test = document.getElementById('test-case-panel');
    const runThisButton = document.getElementById('run-this-test-case');

    if (isTestCasesMode) {
        toggleButton.innerText = "Switch to Test Case Panel";
        runThisButton.innerText = "Run Code";
        outputAndTestCasesDiv.style.transform = "translate(0, -50%)";
        isTestCasesMode = false;
        test.style.opacity = 0;
    } else {
        toggleButton.innerText = "Switch to Output Mode";
        runThisButton.innerText = "Run this Test Case";
        outputAndTestCasesDiv.style.transform = "translate(0, 0)";
        isTestCasesMode = true;
        test.style.opacity = 1
    }
}

export default function CodeHandlerButtons({ executeCode }) {
    function runCodeInOutputMode() {
        if (!isTestCasesMode) {
            return executeCode();
        }
        return null;
    }


    return (
        <div id="test-case-buttons">
            <button id="toggle-output-testcases" onClick={toggleOutputAndTestCases}>Switch to Output Mode</button>
            <button>Add a Custom Test Case</button>
            <button id='run-this-test-case' onClick={() => isTestCasesMode ? null : runCodeInOutputMode()}>Run this Test Case</button>
            <button>Run all Test Cases</button>
            <button id="submit">Submit</button>
        </div>
    )
}