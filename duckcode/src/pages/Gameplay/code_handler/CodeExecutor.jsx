import CodeHandlerButtons from "./CodeHandlerButtons";
import CodeOutput from "./CodeOutput";
import TestCasePanel from "./TestCasePanel";

export default function CodeExecutor({ testCases, output, executeCode }) {
    return (
        <div id="code-executor">
            <CodeHandlerButtons executeCode={executeCode} />
            <div id="output-and-test-cases">
                <TestCasePanel testCases={testCases} />
                <CodeOutput output={output} />
            </div>
        </div>
    )
}