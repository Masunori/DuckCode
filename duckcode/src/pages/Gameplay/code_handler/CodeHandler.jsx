import { useState, useRef, useEffect, useCallback, useContext } from "react";
import CodeEditor from "./CodeEditor";
import CodeExecutor from "./CodeExecutor";
import { SettingsContext } from "../../../App";
import { presetThemes } from "../../../globalcomponents/color_schemes/themes";
import { QuestionContext } from "../Gameplay";
import { LANGUAGE_TO_ID } from "../../../globalcomponents/constants";

/**
 * CodeHandler contains two parts: the CodeEditor component and the CodeExecutor component
 * 
 * It encapsulates the code editor and executor portion of the gameplay page.
 * @returns the CodeHandler component
 */
export default function CodeHandler({ codeEditorContent, setCodeEditorContent }) {
    // because this controls both the editor and the output, the Monaco Editor logic is handled here
    const editorRef = useRef(null);
    const questionTemplate = useContext(QuestionContext);
    const {settings} = useContext(SettingsContext);

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

    const [codeOutput, setCodeOutput] = useState({
        status: 'success',
        output: '>> Your code wil be displayed here...'
    });

    /**
     * All functionalities of CodeHandlerButtons share the same AbortController instance.
     * This is so that only one function is running at any time
     */
    const currentPistonCallController = useRef(null);
   
    const executeCodeInOutputMode = useCallback(() => {
        const runCode = async () => {
            if (currentPistonCallController.current) {
                currentPistonCallController.current.abort();
            }

            const controller = new AbortController();
            currentPistonCallController.current = controller;

            try {
                const response = await fetch('http://13.236.119.143/run_code_only', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        qid: questionTemplate.qid,
                        sourceCode: codeEditorContent,
                        languageId: LANGUAGE_TO_ID[settings.progLang.formal_name]
                    })
                });

                if (!response.ok) {
                    throw new Error(`Failed to execute code! Status: ${response.status}`);
                }

                const result = await response.json();

                if (result.results.stdout) {
                    setCodeOutput({
                        status: 'success',
                        output: result.results.stdout,
                    });
                } else {
                    setCodeOutput({
                        status: 'error',
                        output: result.results.stderr,
                    });
                }
            } catch (error) {
                console.error(error);
            }
        }

        setCodeOutput({
            status: 'loading',
            output: '>> Running code... You can click "Run Code" again to start a new execution!'
        });
        runCode();
    }, [codeEditorContent, questionTemplate.qid, settings.progLang.formal_name]);
    
    const [testCaseResults, setTestCaseResults] = useState(null);

    const runAllTestCases = useCallback(() => {
        const runCode = async () => {
            if (currentPistonCallController.current) {
                currentPistonCallController.current.abort();
            }

            const controller = new AbortController();
            currentPistonCallController.current = controller;

            try {
                const response = await fetch('http://13.236.119.143/run_all_test_case', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        qid: questionTemplate.qid,
                        sourceCode: codeEditorContent,
                        languageId: LANGUAGE_TO_ID[settings.progLang.formal_name]
                    })
                });

                if (!response.ok) {
                    throw new Error(`Failed to execute code! Status: ${response.status}`);
                }

                const result = await response.json();
                console.log(result);
                setTestCaseResults(result);
            } catch (error) {
                console.error(error);
            }
        }

        setCodeOutput({
            status: 'loading',
            output: '>> Running code... You can click "Run Code" again to start a new execution!'
        });
        runCode();
    }, [codeEditorContent, questionTemplate.qid, settings.progLang.formal_name]);

    // Ctrl + Enter: Execute the code in the CodeEditor, if the CodeExecutor is set to Output Mode
    useEffect(() => {
        const runCode = (event) => {
            if (event.ctrlKey && event.key === 'Enter') {
                executeCodeInOutputMode();
            }
        }
        document.addEventListener('keydown', runCode);

        return () => {
            document.removeEventListener('keydown', runCode);
        }
    }, [executeCodeInOutputMode]);

    return (
        <div id="code-handler">
            <CodeEditor 
                handleEditorChange={handleEditorChange}
                handleEditorDidMount={handleEditorDidMount}
                codeContent={codeEditorContent}
            />
            <CodeExecutor 
                output={codeOutput} 
                executeCodeInOutputMode={executeCodeInOutputMode} 
                runAllTestCases={runAllTestCases}
                testCaseResults={testCaseResults}
            />
        </div>
    )
}