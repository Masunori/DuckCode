import CodeHandlerButtons from "./CodeHandlerButtons";
import CodeOutput from "./CodeOutput";
import TestCasePanel from "./TestCasePanel";

export default function CodeExecutor({ 
    output, 
    executeCodeInOutputMode, 
    runAllTestCases,
    testCaseResults 
}) {
    return (
        <div id="code-executor">
            <CodeHandlerButtons 
                executeCodeInOutputMode={executeCodeInOutputMode} 
                runAllTestCases={runAllTestCases}
            />
            <div id="output-and-test-cases">
                <TestCasePanel testCaseResults={testCaseResults} />
                <CodeOutput output={output} />
            </div>
        </div>
    )
}