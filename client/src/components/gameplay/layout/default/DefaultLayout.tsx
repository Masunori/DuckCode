"use client";

import { GAMEPLAY_KEY_BINDINGS, isKeyCombo } from '@/lib/utils/keyBindings';
import { usePopup } from "@/contexts/PopupContext";
import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";
import { useTimerStore } from "@/hooks/useTimerStore";
import { useBaseGameplayStore } from "@/lib/gameplay/hooks/useBaseGameplayStore";
import { instantiateEditorOnMount, Question } from "@/lib/gameplay/utils";
import { printd } from "@/lib/utils/debugUtils";
import { keyboardManager } from "@/lib/utils/keyboardManager";
import * as monaco from 'monaco-editor';
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useShallow } from "zustand/shallow";
import CodeEditor from "../../components/CodeEditor";
import DefaultTestCases from "../../components/DefaultTestCases";
import GameplayNavbar from "../../components/GameplayNavbar";
import QuestionTab from "../../components/QuestionTab";
import WinPopup from "../../components/WinPopup";
import styles from "./page.module.css";
import { useGettingStartedInstruction } from '@/contexts/GettingStartedInstructionContext';
import { getProfile } from '@/lib/apiClient/user';
import { useUserStore } from '@/contexts/UserContext';

export function DefaultLayout({ questions }: { questions: Question[] }) {
    // for code editor
    const userPreference = useUserPreferenceStore(state => state.userPreference);
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const gameplayRef = useRef<HTMLDivElement | null>(null);

    printd("@/components/gameplay/layout/default/DefaultLayout", "Rendering DefaultLayout with questions:", questions);

    const ctx = useGettingStartedInstruction();
    const setUser = useUserStore(state => state.setUser);

    // Use refs to maintain stable references for keyboard handler
    const callbacksRef = useRef<{
        runCodeClientSide: () => Promise<void>;
        runTestCasesClientSide: () => Promise<void>;
        submitCodeClientSide: () => Promise<void>;
    }>({
        runCodeClientSide: async () => { },
        runTestCasesClientSide: async () => { },
        submitCodeClientSide: async () => { },
    });

    const setInformationMode = useBaseGameplayStore(state => state.setInformationMode);
    const activeQuestionIndex = useBaseGameplayStore(state => state.activeQuestionIndex);
    const setActiveQuestionIndex = useBaseGameplayStore(state => state.setActiveQuestionIndex);

    const question = questions[activeQuestionIndex];
    printd("@/components/gameplay/layout/default/DefaultLayout", "Rendering DefaultLayout with question:", question);

    const { openPopupWith } = usePopup();

    const [
        runCode,
        runTestCases,
        submitCode,
    ] = useBaseGameplayStore(
        useShallow(
            state => [
                state.runCode,
                state.runTestCases,
                state.submitCode,
            ]
        )
    );

    const resetGameState = useBaseGameplayStore(state => state.reset);
    const router = useRouter();

    const resetTimer = useTimerStore(state => state.reset);
    const pauseTimer = useTimerStore(state => state.pause);

    const [isShowingWinPopup, setIsShowingWinPopup] = useState(false);
    const [winTimeElapsedSeconds, setWinTimeElapsedSeconds] = useState<number | null>(null);

    const runCodeClientSide = useCallback(async () => {
        const response = await runCode();

        if (!response) {
            return;
        }

        openPopupWith(
            response.message,
            "Understood",
            null,
            () => { },
            () => { }
        );
    }, [runCode, openPopupWith]);

    const submitCodeClientSide = useCallback(async () => {
        const response = await submitCode();

        if (!response) {
            return;
        }

        const submissionSuccessful = response.message === "pass";

        if (submissionSuccessful) {
            setWinTimeElapsedSeconds(Math.floor(useTimerStore.getState().timeElapsed / 1000));
            setIsShowingWinPopup(true);
            pauseTimer();
        } else {
            openPopupWith(
                response.message,
                "Understood",
                null,
                () => { },
                () => { }
            );
        }
    }, [submitCode, openPopupWith, setIsShowingWinPopup, pauseTimer]);

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
            () => {
                if (passed) {
                    submitCodeClientSide();
                }
            },
            () => { }
        );
    }, [runTestCases, openPopupWith, submitCodeClientSide]);

    const exitGameplayOnWin = useCallback(async () => {
        if (ctx) {
            const res = await getProfile();

            alert(JSON.stringify(res));
            if (res.status === 200 && res.data?.exp && res.data.exp > 0) {
                setUser(res.data);
                router.push("/home");
            }
        } else {
            router.push("/home");
            router.refresh();
        }

        resetGameState();
        resetTimer();
        setWinTimeElapsedSeconds(null);
        setIsShowingWinPopup(false);
    }, []);

    // Keep keybinding callbacks fresh while allowing one-time registration effect.
    useEffect(() => {
        callbacksRef.current = {
            runCodeClientSide,
            runTestCasesClientSide,
            submitCodeClientSide,
        };
    }, [runCodeClientSide, runTestCasesClientSide, submitCodeClientSide]);

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

    // useEffect(() => {

    // }, [userPreference.language]);

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
                callbacksRef.current.runCodeClientSide();
                return true;
            } else if (isKeyCombo(e, GAMEPLAY_KEY_BINDINGS["RUN_TEST_CASES"].combo)) {
                e.preventDefault();
                callbacksRef.current.runTestCasesClientSide();
                return true;
            } else if (isKeyCombo(e, GAMEPLAY_KEY_BINDINGS["SUBMIT_CODE"].combo)) {
                e.preventDefault();
                callbacksRef.current.submitCodeClientSide();
                return true;
            } else if (isKeyCombo(e, GAMEPLAY_KEY_BINDINGS["FOCUS_EDITOR"].combo) && editor) {
                e.preventDefault(); // stop "i" from inserting text somewhere random
                editor.focus();
                return true;
            } else if (isKeyCombo(e, GAMEPLAY_KEY_BINDINGS["TOGGLE_OUTPUT_TEST_CASE_MODE"].combo)) {
                e.preventDefault();
                setInformationMode(prev => prev === "output" ? "testCases" : "output");
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
    }, []);

    return (
        <div ref={gameplayRef} tabIndex={0}>
            <GameplayNavbar />
            {
                isShowingWinPopup && (
                    <WinPopup
                        timeElapsed={winTimeElapsedSeconds ?? 0}
                        exit={exitGameplayOnWin}
                    />
                )
            }
            <PanelGroup direction="horizontal" className={styles.gameplayPanels} style={{ height: "100vh" }}>
                <Panel defaultSize={40} minSize={2}>
                    <QuestionTab questions={questions} />
                </Panel>
                <PanelResizeHandle className={styles.verticalGameplayPanelResizeHandler} />
                <Panel defaultSize={60} minSize={2} className={styles.codePanel}>
                    <CodeEditor
                        onMount={handleEditorDidMount}
                    />
                    <DefaultTestCases
                        testCases={question.publicTestCases}
                        runCode={runCodeClientSide}
                        runTestCases={runTestCasesClientSide}
                        submitCode={submitCodeClientSide}
                    />
                </Panel>
            </PanelGroup>
        </div>
    );
}