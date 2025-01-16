import { useState, useRef, useEffect, useCallback, useContext } from "react";
import CodeEditor from "./CodeEditor";
import CodeExecutor from "./CodeExecutor";
import { SettingsContext } from "../../../App";
import { presetThemes } from "../../../globalcomponents/color_schemes/themes";

/**
 * CodeHandler contains two parts: the CodeEditor component and the CodeExecutor component
 * 
 * @param {string[][]} testCases - An array of input-expected output pairs, passed into the CodeExecutor component 
 * @returns 
 */
export default function CodeHandler({ testCases, value, setValue }) {
    // because this controls both the editor and the output, the Monaco Editor logic is handled here
    const editorRef = useRef(null);

    const {assignMonacoInstance} = useContext(SettingsContext);            

    // const testCode = [
    //     "const re = /ab+c/; // regexp, const",
    //     "const hex = 0xFF; // hex",
    //     "",
    //     "// Comment: Log 'Hello, world!' to console",
    //     "function greet(a, b) { // function",
    //     "    console.log('Hello, world!'); // string",
    //     "    for (let x = 0; x < 10; x++) {",
    //     "        break;",
    //     "    }",
    //     "}",
    //     "",
    //     "// class",
    //     "class Dummy {",
    //     "    name;",
    //     "    constructor(name) {",
    //     "        this.name = name;",
    //     "    }",
    //     "    greet() {",
    //     "        console.log('Hello, ' + this.name);",
    //     "    }",
    //     "}",
    //     "",
    //     "const dummy = new Dummy('DuckCode');",
    //     "let x = (1 + 1) * (3 / 4) / (5 - 2); // operator"
    // ].join('\n');

    // const [value, setValue] = useState(settings.progLang.code_snippet);

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
        assignMonacoInstance(monaco);

        Object.entries(presetThemes).forEach(theme => {
            monaco.editor.defineTheme(theme[0], theme[1].theme);
        });
    }

    function handleEditorChange(val, event) {
        setValue(val);
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
            body: JSON.stringify({ code: value, language: 'javascript', version: '15.10.0' }),
            signal: signal
        })
            .then(response => {
                console.log(response);
                return response.json();
            })
            .then(data => setCodeOutput(data.run.output))
            .catch(error => console.error('Error executing code: ', error));
    }, [value])
    

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
                value={value}
            />
            <CodeExecutor testCases={testCases} output={codeOutput} executeCode={executeAndLogCode} />
        </div>
    )
}