"use client";

import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { InformationMode, instantiateEditorOnMount, Question, runCodeOutputModeClientSide, runTestCasesClientSide, submitCodeClientSide, TestCaseResult } from "../../gameplayUtils";
import { GAMEPLAY_KEY_BINDINGS, isKeyCombo, PROGRAMMING_LANGUAGES } from "@/app/components/settings/settingsUtils";
import { useUserStore } from "@/app/components/contexts/UserContext";
import * as monaco from 'monaco-editor';
import { OutputEntry } from "@/app/api/gameplay/RunCodeStatuses";
import { usePopup } from "@/app/components/contexts/PopupContext";
import { Lock } from "@/app/utils/lock";
import GameplayNavbar from "../../components/GameplayNavbar";
import QuestionDisplay from "./components/QuestionDisplay";
import CodeEditor from "./components/CodeEditor";
import TestCases from "./components/TestCases";
import styles from "./page.module.css";
import { GAMEPLAY_KEY_PRIORITY, GAMEPLAY_TAB_KEY_PRIORITY, keyboardManager } from "@/app/utils/keyboardManager";
import Output from "./components/Output";

export function FullscreenEditorLayout({ question }: {question: Question}) {
    // for code editor
    const user = useUserStore(state => state.user);
    const [codeContent, setCodeContent] = useState<string | undefined>(PROGRAMMING_LANGUAGES[user.userPreference.language].code_snippet);
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const gameplayRef = useRef<HTMLDivElement | null>(null);
    const lock: Lock = useMemo(() => new Lock(), []);
    // eslint-disable-next-line
    const setIsClusterLocked: Dispatch<SetStateAction<boolean>> = bool => {};

    const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) => {
        instantiateEditorOnMount(editorRef, editor, monacoInstance, user);
    }

    // this is used in the code output UI component
    const [informationMode, setInformationMode] = useState<InformationMode>("-");
    const setNextInformationMode = () => {
        setInformationMode(prev => prev === "-"
            ? "question"
            : prev === "question"
            ? "output"
            : prev === "output"
            ? "testCases"
            : "-"
        );
    }

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
        
        runCodeOutputModeClientSide(
            codeContent as string,
            user.userPreference.language,
            lock,
            setIsClusterLocked,
            setCodeOutput,
            openPopupWith,
            setInformationMode,
        );     
    }, [codeContent, lock, openPopupWith, user.userPreference.language]);

    // submit code
    const submit = useCallback(async () => {
        if (typeof(codeContent) === undefined) {
            return;
        }

        submitCodeClientSide(
            codeContent as string,
            user.userPreference.language,
            question,
            lock,
            setIsClusterLocked,
            setCodeOutput,
            openPopupWith,
            setInformationMode
        );
    }, [codeContent, lock, openPopupWith, user.userPreference.language, question]);

    // run code against all test cases
    // if all test cases passed, prompt to submit code
    const runTestCases = useCallback(async () => {
        if (typeof(codeContent) === undefined) {
            return;
        }

        runTestCasesClientSide(
            codeContent as string,
            user.userPreference.language,
            question,
            lock,
            setIsClusterLocked,
            setCodeOutput,
            setTestCaseResults,
            setActiveIndex,
            openPopupWith,
            setInformationMode
        );
    }, [codeContent, lock, openPopupWith, question, user.userPreference.language]);

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
                setNextInformationMode();
                return true;
            }

            return false;
        }

        const handleCloseTab = (e: KeyboardEvent) => {
            if (isKeyCombo(e, GAMEPLAY_KEY_BINDINGS["EXIT_TAB_ON_FULLSCREEN"].combo) && informationMode !== "-") {
                e.preventDefault();
                setInformationMode("-");
                return true;
            } else if (isKeyCombo(e, GAMEPLAY_KEY_BINDINGS["TOGGLE_QUESTION_TAB"].combo)) {
                e.preventDefault();
                setInformationMode(prev => prev === "question" ? "-" : "question");
            } else if (isKeyCombo(e, GAMEPLAY_KEY_BINDINGS["TOGGLE_OUTPUT_TAB"].combo)) {
                e.preventDefault();
                setInformationMode(prev => prev === "output" ? "-" : "output");
            } else if (isKeyCombo(e, GAMEPLAY_KEY_BINDINGS["TOGGLE_TEST_CASES_TAB"].combo)) {
                e.preventDefault();
                setInformationMode(prev => prev === "testCases" ? "-" : "testCases");
            }

            return false;
        };
        
        keyboardManager.register("gameplay", GAMEPLAY_KEY_PRIORITY, handleKeyDown);
        keyboardManager.register("gameplayFullscreen", GAMEPLAY_TAB_KEY_PRIORITY, handleCloseTab);

        return () => {
            keyboardManager.unregister("gameplay");
            keyboardManager.unregister("gameplayFullscreen");
        }
    }, [runCodeOutputMode, runTestCases, submit, informationMode]);

    useEffect(() => {
        console.log(informationMode);
    }, [informationMode]);

    return (
        <div ref={gameplayRef} tabIndex={0} className={styles.fullscreenEditorLayout}>
            <GameplayNavbar />
            <CodeEditor 
                onMount={handleEditorDidMount}
                codeContent={codeContent}
                setCodeContent={setCodeContent}
            />
            <QuestionDisplay 
                question={question}
                informationMode={informationMode}
                setInformationMode={setInformationMode}
            />
            <TestCases
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                testCases={question.publicTestCases}
                testCaseResults={testCaseResults}
                informationMode={informationMode}
                setInformationMode={setInformationMode}
            />
            <Output
                codeOutput={codeOutput}
                informationMode={informationMode}
                setInformationMode={setInformationMode}
            />
        </div>
    );
}