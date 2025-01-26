import CodeHandlerButtons from "./CodeHandlerButtons";
import CodeOutput from "./CodeOutput";
import TestCasePanel from "./TestCasePanel";

export default function CodeExecutor({ output, executeCode }) {
    return (
        <div id="code-executor">
            <CodeHandlerButtons executeCode={executeCode} />
            <div id="output-and-test-cases">
                <TestCasePanel />
                <CodeOutput output={output} />
            </div>
        </div>
    )
}