import CodeHandlerButtons from "./CodeHandlerButtons";
import CodeOutput from "./CodeOutput";
import TestCasePanel from "./TestCasePanel";

export default function CodeExecutor({ 
    output, 
    executeCodeInOutputMode, 
    runAllTestCases,
    submitCode,
    testCaseResults,
    isTestCasesMode,
    toggleOutputAndTestCases 
}) {
    return (
        <div id="code-executor">
            <CodeHandlerButtons 
                executeCodeInOutputMode={executeCodeInOutputMode} 
                runAllTestCases={runAllTestCases}
                submitCode={submitCode}
                isTestCasesMode={isTestCasesMode}
                toggleOutputAndTestCases={toggleOutputAndTestCases}
            />
            <div id="output-and-test-cases">
                <TestCasePanel testCaseResults={testCaseResults} />
                <CodeOutput output={output} />
            </div>
        </div>
    )
}