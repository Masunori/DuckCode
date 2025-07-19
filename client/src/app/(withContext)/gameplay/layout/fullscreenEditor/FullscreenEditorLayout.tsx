"use client";

import { useCallback, useEffect, useRef } from "react";
import { instantiateEditorOnMount, Question, runCodeOutputModeClientSide, runTestCasesClientSide, submitCodeClientSide } from "../../gameplayUtils";
import { GAMEPLAY_KEY_BINDINGS, isKeyCombo } from "@/app/components/settings/settingsUtils";
import { useUserStore } from "@/app/components/contexts/UserContext";
import * as monaco from 'monaco-editor';
import { usePopup } from "@/app/components/contexts/PopupContext";
import QuestionDisplay from "./components/QuestionDisplay";
import CodeEditor from "./components/CodeEditor";
import TestCases from "./components/TestCases";
import styles from "./page.module.css";
import { keyboardManager } from "@/app/utils/keyboardManager";
import Output from "./components/Output";
import { useGameplayController } from "../../hooks/useGameplayController";
import { useShallow } from "zustand/shallow";
import { useGameplayStore } from "../../hooks/useGameplayStore";

export function FullscreenEditorLayout({ question }: { question: Question }) {
    // for code editor
    const user = useUserStore(state => state.user);
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const gameplayRef = useRef<HTMLDivElement | null>(null);

    const [
        lock,
        setIsClusterLocked, 
        informationMode, 
        setInformationMode,
        setActiveIndex
    ] = useGameplayController(
        useShallow(state => [
            state.lock,
            state.setIsClusterLocked,
            state.informationMode,
            state.setInformationMode,
            state.setActiveIndex
        ])
    );

    const [
        codeContent,
        setCodeOutput,
        setTestCaseResults
    ] = useGameplayStore(
        useShallow(
            state => [
                state.codeContent,
                state.setCodeOutput,
                state.setTestCaseResults
            ]
        )
    );

    const setNextInformationMode = useCallback(() => {
        setInformationMode(prev => (
            prev === "question"
                ? "testCases"
                : prev === "testCases"
                ? "output"
                : prev === "output"
                ? "-"
                : "question"
        ));
    }, [setInformationMode]);

    const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) => {
        instantiateEditorOnMount(editorRef, editor, monacoInstance, user);
    }

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
    }, [codeContent, lock, openPopupWith, setCodeOutput, setInformationMode, setIsClusterLocked, user.userPreference.language]);

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
    }, [codeContent, user.userPreference.language, question, lock, setIsClusterLocked, setCodeOutput, openPopupWith, setInformationMode]);

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
    }, [codeContent, lock, openPopupWith, question, setActiveIndex, setCodeOutput, setInformationMode, setIsClusterLocked, setTestCaseResults, user.userPreference.language]);

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
        
        keyboardManager.register("gameplay", "GAMEPLAY_KEY_PRIORITY", handleKeyDown);
        keyboardManager.register("gameplayFullscreen", "GAMEPLAY_TAB_KEY_PRIORITY", handleCloseTab);

        return () => {
            keyboardManager.unregister("gameplay");
            keyboardManager.unregister("gameplayFullscreen");
        }
    }, [runCodeOutputMode, runTestCases, submit, informationMode, setNextInformationMode, setInformationMode]);

    useEffect(() => {
        console.log(informationMode);
    }, [informationMode]);

    return (
        <div ref={gameplayRef} tabIndex={0} className={styles.fullscreenEditorLayout}>
            <CodeEditor onMount={handleEditorDidMount} />
            <QuestionDisplay question={question} />
            <TestCases testCases={question.publicTestCases}/>
            <Output />
        </div>
    );
}