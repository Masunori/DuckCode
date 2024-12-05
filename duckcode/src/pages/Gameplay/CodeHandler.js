import CodeEditor from "./CodeEditor";
import CodeExecutor from "./CodeExecutor";

export default function CodeHandler({ testCases }) {
    return (
        <div id="code-handler">
            <CodeEditor />
            <CodeExecutor testCases={testCases} />
        </div>
    )
}