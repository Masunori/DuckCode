"use client";

import { usePopup } from "@/contexts/PopupContext";
import { useBaseGameplayStore } from "@/hooks/useBaseGameplayStore";
import { printd } from "@/utils/debugUtils";
import { Question } from "@/utils/gameplay";
import { GAMEPLAY_KEY_BINDINGS, isKeyCombo } from '@/utils/keyBindings';
import { keyboardManager } from "@/utils/keyboardManager";
import * as monaco from 'monaco-editor';
import { useCallback, useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/shallow";
import FullScreenCodeEditor from "../../components/FullScreenCodeEditor";
import FullScreenOutput from "../../components/FullScreenOutput";
import FulLScreenQuestionDisplay from "../../components/FullScreenQuestionDisplay";
import FullScreenTestCases from "../../components/FullScreenTestCases";
import GameplayNavbar from '../../components/GameplayNavbar';
import QuestionSwitcher from "../../components/QuestionSwitcher";
import styles from "./page.module.css";

export function FullscreenEditorLayout({ questions }: { questions: Question[] }) {
    // for code editor
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const gameplayRef = useRef<HTMLDivElement | null>(null);
    const [isFocusedOnEditor, setIsFocusedOnEditor] = useState(false);

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

            if (isFocusedOnEditor) {
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
                runTestCasesClientSide();
                return true;
            } else if (isKeyCombo(e, GAMEPLAY_KEY_BINDINGS["SUBMIT_CODE"].combo)) {
                e.preventDefault();
                submitCodeClientSide();
                return true;
            } else if (isKeyCombo(e, GAMEPLAY_KEY_BINDINGS["FOCUS_EDITOR"].combo) && editor) {
                e.preventDefault();
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
            if (isFocusedOnEditor) {
                return false;
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
    }, [isFocusedOnEditor, runCodeClientSide, runTestCasesClientSide, submitCodeClientSide, informationMode, setNextInformationMode, setInformationMode, setActiveQuestionIndex, questions.length]);

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
            <GameplayNavbar isKeyBindingEnabled={!isFocusedOnEditor} />
            <div className={styles.editorAndSwitcher}>
                <QuestionSwitcher numQuestions={questions.length} />
                <FullScreenCodeEditor
                    editorRef={editorRef}
                    setIsFocusedOnEditor={setIsFocusedOnEditor}
                />
            </div>
            <FulLScreenQuestionDisplay questions={questions} />
            <FullScreenTestCases testCases={question.publicTestCases} />
            <FullScreenOutput />
        </div>
    );
}