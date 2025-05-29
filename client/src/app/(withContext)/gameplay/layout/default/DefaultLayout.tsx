"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Question, TestCaseResult } from "../../gameplayUtils";
import { GAMEPLAY_KEY_BINDINGS, isKeyCombo, PROGRAMMING_LANGUAGES } from "@/app/components/settings/settingsUtils";
import { useUser } from "@/app/components/contexts/UserContext";
import * as monaco from 'monaco-editor';
import { PRESET_THEMES } from "@/app/components/themes/themes";
import { OutputEntry, RUN_CODE_RESPONSES, RunCodeStatuses } from "@/app/api/gameplay/RunCodeStatuses";
import { usePopup } from "@/app/components/contexts/PopupContext";
import { Lock } from "@/app/utils/lock";
import { runAllTestCases, runCode, submitCode } from "@/lib/apiClient/gameplay";
import GameplayNavbar from "../../components/GameplayNavbar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import QuestionDisplay from "../../components/QuestionDisplay";
import CodeEditor from "../../components/CodeEditor";
import TestCases from "./components/TestCases";
import styles from "./page.module.css";
import { GAMEPLAY_KEY_PRIORITY, keyboardManager } from "@/app/utils/keyboardManager";

export function DefaultLayout({ question }: {question: Question}) {
    // for code editor
    const { user } = useUser();
    const [codeContent, setCodeContent] = useState<string | undefined>(PROGRAMMING_LANGUAGES[user.userPreference.language].code_snippet);
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const gameplayRef = useRef<HTMLDivElement | null>(null);
    const lock: Lock = useMemo(() => new Lock(), []);
    const [isClusterLocked, setIsClusterLocked] = useState(false);

    const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) => {
        editorRef.current = editor;

        monacoInstance.editor.defineTheme(
            PRESET_THEMES[user.userPreference.editorOptions.theme].monacoEditorAlias,
            PRESET_THEMES[user.userPreference.editorOptions.theme].theme
        )

        editor.onKeyDown((e: monaco.IKeyboardEvent) => {
            if (e.keyCode === monacoInstance.KeyCode.Escape) {
                const domNode = editor.getDomNode();
                if (domNode && domNode.contains(document.activeElement)) {
                    (document.activeElement as HTMLElement).blur();
                }
            }
        })
    }

    // this is used in the code output UI component
    const [isOutputMode, setIsOutputMode] = useState(false);
    const [codeOutput, setCodeOutput] = useState<OutputEntry[]>(
        [
            {
                type: "log",
                content: ">> Your code will be displayed here...",
            },
        ]
    );

    // this is used for the test case selector and display panel UI component
    const [testCaseResults, setTestCaseResults] = useState<TestCaseResult[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);

    const { openPopupWith } = usePopup();

    // for code handling
    // executing code normally
    const runCodeOutputMode = useCallback(async () => {
        if (typeof(codeContent) === undefined) {
            return;
        }
        
        try{
            setIsClusterLocked(true);
            const response = await lock.call(() => runCode(question.qid, codeContent as string, 'JavaScript'));
            setIsOutputMode(true);
            setCodeOutput(response.output);
        } catch {
            openPopupWith(
                "Please wait for the code to run before attempting running the code again, running test cases, or submitting the code.",
                "Understood",
                null,
                () => {},
                () => {}
            )
        } finally {
            setIsClusterLocked(false);
        }
        
    }, [codeContent, lock, openPopupWith, question.qid]);

    // submit code
    const submit = useCallback(async () => {
        if (typeof(codeContent) === undefined) {
            return;
        }

        try {
            setIsClusterLocked(true);
            const response = await lock.call(() => submitCode(question.qid, codeContent as string, 'JavaScript'));

            setIsOutputMode(true);
            setCodeOutput([
                { type: "log", content: `Correct: ${response.result.correct}` },
                { type: "log", content: `Total: ${response.result.total}` },
                { type: response.result.statusId === 1 ? "log" : "error", content: `Status: ${RUN_CODE_RESPONSES[response.result.statusId]}` },
            ]);
        } catch {
            openPopupWith(
                "Please wait for the code to run before attempting running the code, running test cases, or submitting the code again.",
                "Understood",
                null,
                () => {},
                () => {}
            )
        } finally {  
            setIsClusterLocked(false);
        }
    }, [codeContent, lock, openPopupWith, question.qid]);

    // run code against all test cases
    // if all test cases passed, prompt to submit code
    const runTestCases = useCallback(async () => {
        if (typeof(codeContent) === undefined) {
            return;
        }

        try {
            setIsClusterLocked(true);
            const response = await lock.call(() => runAllTestCases(question.qid, codeContent as string, 'JavaScript'));

            setIsOutputMode(false);
            setTestCaseResults(response.results);

            for (let i = 0; i < response.results.length; i++) {
                if (RUN_CODE_RESPONSES[response.results[i].statusId] !== RunCodeStatuses.ACCEPTED) {
                    openPopupWith(
                        `Test case ${i + 1} failed. Reason: ${response.results[i].message}`,
                        "Understood",
                        null,
                        () => {},
                        () => {}
                    );

                    setActiveIndex(i);
                    return;
                }
            }
            
            openPopupWith(
                `All public test cases passed!`,
                "Submit Code",
                "Go back to code",
                submit,
                () => {}
            );
        } catch {
            openPopupWith(
                "Please wait for the code to run before attempting running the code, running test cases again, or submitting the code.",
                "Understood",
                null,
                () => {},
                () => {}
            )
        } finally {
            setIsClusterLocked(false);
        }
    }, [codeContent, lock, openPopupWith, question.qid, submit]);

    // this useEffect encapsulates all key bindings
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const editor = editorRef.current;
            const active = document.activeElement;
            const isFocusOnEditor = editor && editor.getDomNode()?.contains(active);

            if (isFocusOnEditor) {
                if (isKeyCombo(e, GAMEPLAY_KEY_BINDINGS["DEFOCUS_EDITOR"].combo)) {
                    gameplayRef.current?.focus();
                    return true;
                }
            } else if (isKeyCombo(e, GAMEPLAY_KEY_BINDINGS["RUN_CODE_OUTPUT_MODE"].combo)) {
                e.preventDefault();
                runCodeOutputMode();
                return true;
            } else if (isKeyCombo(e, GAMEPLAY_KEY_BINDINGS["RUN_TEST_CASES"].combo)) {
                e.preventDefault();
                runTestCases();
                return true;
            } else if (isKeyCombo(e, GAMEPLAY_KEY_BINDINGS["SUBMIT_CODE"].combo)) {
                e.preventDefault();
                submit();
                return true;
            } else if (isKeyCombo(e, GAMEPLAY_KEY_BINDINGS["FOCUS_EDITOR"].combo) && editor) {
                e.preventDefault(); // stop "i" from inserting text somewhere random
                editor.focus();
                return true;
            } else if (isKeyCombo(e, GAMEPLAY_KEY_BINDINGS["TOGGLE_OUTPUT_TEST_CASE_MODE"].combo)) {
                e.preventDefault();
                setIsOutputMode(prev => !prev);
                return true;
            }

            return false;
        }

        keyboardManager.register("gameplay", GAMEPLAY_KEY_PRIORITY, handleKeyDown);
        return () => {
            keyboardManager.unregister("gameplay");
        }
    }, [runCodeOutputMode, runTestCases, submit]);


    return (
        <div ref={gameplayRef} tabIndex={0}>
            <GameplayNavbar />
            <PanelGroup direction="horizontal" className={styles.gameplayPanels} style={{ height: "100vh" }}>
                <Panel defaultSize={40} minSize={2}>
                    <QuestionDisplay question={question} />
                </Panel>
                <PanelResizeHandle className={styles.verticalGameplayPanelResizeHandler} />
                <Panel defaultSize={60} minSize={2} className={styles.codePanel}>
                    <CodeEditor 
                        onMount={handleEditorDidMount}
                        codeContent={codeContent}
                        setCodeContent={setCodeContent}
                    />
                    <TestCases 
                        activeIndex={activeIndex}
                        setActiveIndex={setActiveIndex}
                        testCases={question.publicTestCases} 
                        isOutputMode={isOutputMode}
                        setIsOutputMode={setIsOutputMode}
                        codeOutput={codeOutput}
                        runCode={runCodeOutputMode}
                        runTestCases={runTestCases}
                        submitCode={submit}
                        testCaseResults={testCaseResults}
                        isClusterLocked={isClusterLocked}
                    />
                </Panel>
            </PanelGroup>
        </div>
    );
}