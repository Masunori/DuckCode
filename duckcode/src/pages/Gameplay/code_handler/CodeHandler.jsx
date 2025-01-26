import { useState, useRef, useEffect, useCallback, useContext } from "react";
import CodeEditor from "./CodeEditor";
import CodeExecutor from "./CodeExecutor";
import { SettingsContext } from "../../../App";
import { presetThemes } from "../../../globalcomponents/color_schemes/themes";

/**
 * CodeHandler contains two parts: the CodeEditor component and the CodeExecutor component
 * @returns 
 */
export default function CodeHandler({ codeEditorContent, setCodeEditorContent }) {
    // because this controls both the editor and the output, the Monaco Editor logic is handled here
    const editorRef = useRef(null);

    const {assignMonacoInstance} = useContext(SettingsContext);

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
        assignMonacoInstance(monaco);

        Object.entries(presetThemes).forEach(theme => {
            monaco.editor.defineTheme(theme[0], theme[1].theme);
        });
    }

    function handleEditorChange(val, event) {
        setCodeEditorContent(val);
    }

    const [codeOutput, setCodeOutput] = useState(">> Your results will be displayed here...");

    /**
     * Executes the code in the CodeEditor if the CodeExecutor is set to Output Mode.
     */
    // const currentPistonCallController = useRef(null);
    const currentPistonCallController = useRef(null);
   
    const executeAndLogCode = useCallback(() => {
        // alert(value);

        if (currentPistonCallController.current) {
            currentPistonCallController.current.abort();
        }

        currentPistonCallController.current = new AbortController();
        const signal = currentPistonCallController.current.signal;

        fetch('http://localhost:5000/execute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: codeEditorContent, language: 'javascript', version: '15.10.0' }),
            signal: signal
        })
            .then(response => {
                console.log(response);
                return response.json();
            })
            .then(data => setCodeOutput(data.run.output))
            .catch(error => console.error('Error executing code: ', error));
    }, [codeEditorContent])
    

    // Ctrl + Enter: Execute the code in the CodeEditor, if the CodeExecutor is set to Output Mode
    useEffect(() => {
        const runCode = (event) => {
            if (event.ctrlKey && event.key === 'Enter') {
                executeAndLogCode();
            }
        }
        document.addEventListener('keydown', runCode);

        return () => {
            document.removeEventListener('keydown', runCode);
        }
    }, [executeAndLogCode]);

    return (
        <div id="code-handler">
            <CodeEditor 
                handleEditorChange={handleEditorChange}
                handleEditorDidMount={handleEditorDidMount}
                codeContent={codeEditorContent}
            />
            <CodeExecutor output={codeOutput} executeCode={executeAndLogCode} />
        </div>
    )
}