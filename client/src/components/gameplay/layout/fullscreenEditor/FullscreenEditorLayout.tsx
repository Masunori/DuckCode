"use client";

import { GAMEPLAY_KEY_BINDINGS, isKeyCombo } from "@/components/settings/settingsUtils";
import { usePopup } from "@/contexts/PopupContext";
import { instantiateEditorOnMount, Question } from "@/lib/gameplay/utils";
import { keyboardManager } from "@/lib/utils/keyboardManager";
import * as monaco from 'monaco-editor';
import { useCallback, useEffect, useRef } from "react";
import { useShallow } from "zustand/shallow";
import styles from "./page.module.css";
import { useBaseGameplayStore } from "@/lib/gameplay/hooks/useBaseGameplayStore";
import { printd } from "@/lib/utils/debugUtils";
import QuestionSwitcher from "../../components/QuestionSwitcher";
import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";
import FulLScreenQuestionDisplay from "../../components/FullScreenQuestionDisplay";
import FullScreenTestCases from "../../components/FullScreenTestCases";
import FullScreenOutput from "../../components/FullScreenOutput";
import FullScreenCodeEditor from "../../components/FullScreenCodeEditor";

export function FullscreenEditorLayout({ questions }: { questions: Question[] }) {
    // for code editor
    const userPreference = useUserPreferenceStore(state => state.userPreference);
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const gameplayRef = useRef<HTMLDivElement | null>(null);

    const informationMode = useBaseGameplayStore(state => state.informationMode);
    const setInformationMode = useBaseGameplayStore(state => state.setInformationMode);
    const activeQuestionIndex = useBaseGameplayStore(state => state.activeQuestionIndex);
    const setActiveQuestionIndex = useBaseGameplayStore(state => state.setActiveQuestionIndex);

    const question = questions[activeQuestionIndex];
    printd("@/components/gameplay/layout/fullscreenEditor/FullscreenEditorLayout", "Rendering FullscreenEditorLayout with question:", question);

    const { openPopupWith } = usePopup();

    const [
        runCode,
        runTestCases,
        submitCode
        ] = useBaseGameplayStore(
        useShallow(
            state => [
                state.runCode,
                state.runTestCases,
                state.submitCode
            ]
        )
    );

    const runCodeClientSide = useCallback(async () => {
        const response = await runCode();

        if (!response) {
            return;
        }

        openPopupWith(
            response.message,
            "Understood",
            null,
            () => {},
            () => {}
        );
    }, [runCode, openPopupWith]);

    const submitCodeClientSide = useCallback(async () => {
        const response = await submitCode();

        if (!response) {
            return;
        }

        openPopupWith(
            response.message,
            "Understood",
            null,
            () => {},
            () => {}
        );  
    }, [submitCode, openPopupWith]);

    const runTestCasesClientSide = useCallback(async () => {
        const response = await runTestCases();

        if (!response) {
            return;
        }

        const passed = response.message === "All public test cases passed successfully.";

        openPopupWith(
            response.message,
            passed ? "Submit Code" : "Understood",
            passed ? "Go back to code" : null,
            () => passed ? submitCodeClientSide() : {},
            () => {}
        );
    }, [runTestCases, openPopupWith, submitCodeClientSide]);

    

    const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) => {
        instantiateEditorOnMount(editorRef, editor, monacoInstance, userPreference);
    }

    useEffect(() => {
        const editor = editorRef.current;

        if (editor) {
            const codeContent = useBaseGameplayStore.getState().codeContent;
            editor.setValue(codeContent[activeQuestionIndex]);
        }
    }, [activeQuestionIndex]);

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
                runCodeClientSide();
                return true;
            } else if (isKeyCombo(e, GAMEPLAY_KEY_BINDINGS["RUN_TEST_CASES"].combo)) {
                e.preventDefault();
                runTestCases();
                return true;
            } else if (isKeyCombo(e, GAMEPLAY_KEY_BINDINGS["SUBMIT_CODE"].combo)) {
                e.preventDefault();
                submitCodeClientSide();
                return true;
            } else if (isKeyCombo(e, GAMEPLAY_KEY_BINDINGS["FOCUS_EDITOR"].combo) && editor) {
                e.preventDefault(); // stop "i" from inserting text somewhere random
                editor.focus();
                return true;
            } else if (isKeyCombo(e, GAMEPLAY_KEY_BINDINGS["TOGGLE_OUTPUT_TEST_CASE_MODE"].combo)) {
                e.preventDefault();
                setNextInformationMode();
                return true;
            } else if (isKeyCombo(e, GAMEPLAY_KEY_BINDINGS["PREVIOUS_QUESTION"].combo)) {
                e.preventDefault();
                setActiveQuestionIndex(i => Math.max(i - 1, 0));
                return true;
            } else if (isKeyCombo(e, GAMEPLAY_KEY_BINDINGS["NEXT_QUESTION"].combo)) {
                e.preventDefault();
                setActiveQuestionIndex(i => Math.min(i + 1, questions.length - 1));
                return true;
            }

            return false;
        }

        const handleCloseTab = (e: KeyboardEvent) => {
            const editor = editorRef.current;
            const active = document.activeElement;
            const isFocusOnEditor = editor && editor.getDomNode()?.contains(active);

            if (isFocusOnEditor) {
                return false; // don't trigger tab closing when user is focused on editor, since they might be trying to type a tab or use tab for autocompletion
            }

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
    }, [runCodeClientSide, runTestCasesClientSide, submitCodeClientSide, informationMode, setNextInformationMode, setInformationMode]);

    useEffect(() => {
        const editor = editorRef.current;
        const gameplay = gameplayRef.current;

        if (!editor) {
            return;
        }

        const ro = new ResizeObserver(() => editor.layout());
        if (gameplay) {
            ro.observe(gameplay);
        }

        return () => {
            ro.disconnect();
        }
    }, []);


    return (
        <div ref={gameplayRef} tabIndex={0} className={styles.fullscreenEditorLayout}>
            <div className={styles.editorAndSwitcher}>
                <QuestionSwitcher numQuestions={questions.length} />
                <FullScreenCodeEditor onMount={handleEditorDidMount} />
            </div>
            <FulLScreenQuestionDisplay questions={questions} />
            <FullScreenTestCases testCases={question.publicTestCases} />
            <FullScreenOutput />
        </div>
    );
}