export default function CodeHandlerButtons({ 
    executeCodeInOutputMode, 
    runAllTestCases, 
    submitCode, 
    isTestCasesMode, 
    toggleOutputAndTestCases 
}) {
    return (
        <div id="test-case-buttons">
            <button id="toggle-output-testcases" onClick={toggleOutputAndTestCases}>Switch to Output Mode</button>
            {/* <button>Add a Custom Test Case</button> */}
            <button 
                id="run-all-test-cases-button" 
                onClick={isTestCasesMode ? runAllTestCases : executeCodeInOutputMode}
            >Run all Test Cases</button>
            <button id="submit" onClick={submitCode}>Submit</button>
        </div>
    )
}