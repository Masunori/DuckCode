"use client";

import { GAMEPLAY_KEY_BINDINGS, isKeyCombo } from "@/components/settings/settingsUtils";
import { usePopup } from "@/contexts/PopupContext";
import { instantiateEditorOnMount, Question } from "@/lib/gameplay/utils";
import { keyboardManager } from "@/lib/utils/keyboardManager";
import * as monaco from 'monaco-editor';
import { useCallback, useEffect, useRef } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useShallow } from "zustand/shallow";
import CodeEditor from "../../components/CodeEditor";
import CodeHandlerButtons from "../../components/CodeHandlerButtons";
import InformationPanelButtons from "../../components/InformationPanelButtons";
import styles from "./page.module.css";
import { useBaseGameplayStore } from "@/lib/gameplay/hooks/useBaseGameplayStore";
import { printd } from "@/lib/utils/debugUtils";
import QuestionTab from "../../components/QuestionTab";
import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";
import TwoTabsOutput from "../../components/TwoTabsOutput";
import TwoTabsTestCases from "../../components/TwoTabsTestCases";

export function TwoTabsInvertedLayout({ questions }: { questions: Question[] }) {
    // for code editor
    const userPreference = useUserPreferenceStore(state => state.userPreference);
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const gameplayRef = useRef<HTMLDivElement | null>(null);

    const informationMode = useBaseGameplayStore(state => state.informationMode);
    const setInformationMode = useBaseGameplayStore(state => state.setInformationMode);
    const activeQuestionIndex = useBaseGameplayStore(state => state.activeQuestionIndex);
    const setActiveQuestionIndex = useBaseGameplayStore(state => state.setActiveQuestionIndex);

    const question = questions[activeQuestionIndex];
    printd("@/components/gameplay/layout/twoTabs/TwoTabsLayout", "Rendering TwoTabsLayout with question:", question);

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
                runTestCasesClientSide();
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
                setInformationMode((prevMode) => prevMode === "question"
                    ? "testCases"
                    : prevMode === "testCases"
                        ? "output"
                        : "question"
                );
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

        keyboardManager.register("gameplay", "GAMEPLAY_KEY_PRIORITY", handleKeyDown);
        return () => {
            keyboardManager.unregister("gameplay");
        }
    }, [runCodeClientSide, runTestCasesClientSide, setInformationMode, submitCodeClientSide]);


    return (
        <div ref={gameplayRef} tabIndex={0}>
            <PanelGroup direction="horizontal" className={styles.gameplayPanels} style={{ height: "100vh" }}>
                <Panel defaultSize={50} minSize={2}>
                    <CodeEditor
                        onMount={handleEditorDidMount}
                    />
                </Panel>
                <PanelResizeHandle className={styles.verticalGameplayPanelResizeHandler} />
                <Panel defaultSize={50} minSize={2} className={styles.informationPanel}>
                    <InformationPanelButtons />
                    {informationMode === "question"
                        ? <QuestionTab questions={questions} />
                        : informationMode === "output"
                            ? <TwoTabsOutput />
                            : informationMode === "testCases"
                                ? <TwoTabsTestCases testCases={question.publicTestCases} />
                                : <></>
                    }
                    <div className={styles.twoTabsInvertedCodeHandlerButtons}>
                        <CodeHandlerButtons
                            onRunCode={runCodeClientSide}
                            onRunTestCases={runTestCasesClientSide}
                            onSubmitCode={submitCodeClientSide}
                        />
                    </div>
                </Panel>
            </PanelGroup>
        </div>
    );
}