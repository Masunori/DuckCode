import CodeHandlerButtons from "./CodeHandlerButtons";
import CodeOutput from "./CodeOutput";
import TestCasePanel from "./TestCasePanel";

export default function CodeExecutor({ testCases }) {
    return (
        <div id="code-executor">
            <CodeHandlerButtons />
            <div id="output-and-test-cases">
                <TestCasePanel testCases={testCases} />
                <CodeOutput />
            </div>
        </div>
    )
}