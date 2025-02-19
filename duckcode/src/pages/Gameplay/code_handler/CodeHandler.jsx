import { useState, useRef, useEffect, useCallback, useContext } from "react";
import CodeEditor from "./CodeEditor";
import CodeExecutor from "./CodeExecutor";
import { SettingsContext } from "../../../App";
import { presetThemes } from "../../../globalcomponents/color_schemes/themes";
import { QuestionContext } from "../Gameplay";
import { STATUS_ID_TO_SUBMISSION_MESSAGE } from "../../../globalcomponents/constants";
import { runCode, runCodeFake } from "../../../services/gameplay/runCode";
import { runAllTestCases, runAllTestCasesFake } from "../../../services/gameplay/runAllTestCases";
import { submitCode, submitCodeFake } from "../../../services/gameplay/submitCode";
import { openConfirmWithMessage } from "../../../globalcomponents/utility_components/Confirm";
import { useNavigate } from "react-router-dom";

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
    const [isCodeRunning, setIsCodeRunning] = useState(false);

    const navigate = useNavigate();

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
        status: 'loading',
        output: '>> Your code wil be displayed here...'
    });

    /**
     * All functionalities of CodeHandlerButtons share the same AbortController instance.
     * This is so that only one function is running at any time
     */
    // const currentPistonCallController = useRef(null);
   
    /**
     * Executes the code in output mode.
     */
    const executeCodeInOutputMode = useCallback(() => {
        const runCode = async () => {
            // if (currentPistonCallController.current) {
            //     currentPistonCallController.current.abort();
            // }

            // const controller = new AbortController();
            // currentPistonCallController.current = controller;

            try {
                const result = await runCodeFake(
                    questionTemplate.qid,
                    codeEditorContent,
                    settings.progLang.formal_name
                );

                setIsCodeRunning(false);
                setCodeOutput({
                    status: 'success',
                    output: result.output
                })
            } catch (error) {
                console.error(error);
            }
        }

        setCodeOutput({
            status: 'loading',
            output: '>> Running code... You can click "Run Code" again to start a new execution!'
        });
        setIsCodeRunning(true);
        runCode();
    }, [codeEditorContent, questionTemplate.qid, settings.progLang.formal_name]);
    
    const [testCaseResults, setTestCaseResults] = useState(null);

    /**
     * Run the user's code against all public test cases.
     */
    const fetchRunAllTestCases = useCallback(() => {
        const runCode = async () => {
            // if (currentPistonCallController.current) {
            //     currentPistonCallController.current.abort();
            // }

            // const controller = new AbortController();
            // currentPistonCallController.current = controller;

            try {
                const result = await runAllTestCasesFake(
                    questionTemplate.question_id,
                    codeEditorContent,
                    settings.progLang.formal_name
                );
                
                setIsCodeRunning(false);
                setTestCaseResults(result);
            } catch (error) {
                console.error(error);
            }
        }

        setIsCodeRunning(true);
        setCodeOutput({
            status: 'loading',
            output: '>> Running code... You can click "Run Code" again to start a new execution!'
        });
        runCode();
    }, [codeEditorContent, questionTemplate.question_id, settings.progLang.formal_name]);

    // toggle between output mode and test case mode
    const [isTestCasesMode, setIsTestCasesMode] = useState(true);

    /**
     * Toggles between the Output and TestCasePanel component UI.
     */
    const toggleOutputAndTestCases = useCallback(() => {
        const toggleButton = document.getElementById('toggle-output-testcases');
        const outputAndTestCasesDiv = document.getElementById('output-and-test-cases');
        const test = document.getElementById('test-case-panel');
        const runThisButton = document.getElementById('run-all-test-cases-button');
    
        if (isTestCasesMode) {
            toggleButton.innerText = "Switch to Test Case Panel";
            runThisButton.innerText = "Run Code";
            outputAndTestCasesDiv.style.transform = "translate(0, -50%)";
            setIsTestCasesMode(false);
            test.style.opacity = 0;
        } else {
            toggleButton.innerText = "Switch to Output Mode";
            runThisButton.innerText = "Run all Test Cases";
            outputAndTestCasesDiv.style.transform = "translate(0, 0)";
            setIsTestCasesMode(true);
            test.style.opacity = 1
        }
    }, [setIsTestCasesMode, isTestCasesMode]);

    /**
     * Submits the user's code. A submission runs the user's code against all public and private test cases.
     */
    const fetchSubmitCode = useCallback(() => {
        const runCode = async () => {
            // if (currentPistonCallController.current) {
            //     currentPistonCallController.current.abort();
            // }

            // const controller = new AbortController();
            // currentPistonCallController.current = controller;
            
            try {
                const result = await submitCodeFake(
                    questionTemplate.question_id,
                    codeEditorContent,
                    settings.progLang.formal_name,
                    true
                );

                setIsCodeRunning(false);
                setCodeOutput({
                    status: result.result.correct === result.result.total ? 'success' : 'fail',
                    output: `Number of Correct Test Cases: ${result.result.correct}\nTotal Number of Correct Test Cases: ${result.result.total}\nStatus: ${STATUS_ID_TO_SUBMISSION_MESSAGE[result.result.statusId]}`
                });

                if (result.result.correct === result.result.total) {
                    openConfirmWithMessage(
                        "Congratulations! Your code has passed all public and private test cases! Exit the match?",
                        "Stay",
                        "Exit Match",
                        ()=>null,
                        ()=>navigate('/home')
                    )
                }
            } catch (error) {
                console.error(error);
            }
        }

        setIsCodeRunning(true);
        setCodeOutput({
            status: 'loading',
            output: '>> Running code... You can click "Run Code" again to start a new execution!'
        });

        runCode();
        if (isTestCasesMode) {
            toggleOutputAndTestCases();
        }
    }, [codeEditorContent, questionTemplate.question_id, settings.progLang.formal_name, toggleOutputAndTestCases, isTestCasesMode, navigate]);


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
                runAllTestCases={fetchRunAllTestCases}
                testCaseResults={testCaseResults}
                submitCode={fetchSubmitCode}
                isTestCasesMode={isTestCasesMode}
                toggleOutputAndTestCases={toggleOutputAndTestCases}
                isCodeRunning={isCodeRunning}
            />
        </div>
    )
}