"use client";

import DefaultTestCases from "@/components/multiplayer/components/DefaultTestCases";
import { GAMEPLAY_KEY_BINDINGS, isKeyCombo, MULTIPLAYER_KEY_BINDINGS } from "@/components/settings/settingsUtils";
import { usePopup } from "@/contexts/PopupContext";
import { useUserStore } from "@/contexts/UserContext";
import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";
import { OutputEntry } from "@/lib/apiClient/runCodeStatuses";
import { instantiateEditorOnMount, Question, TestCaseResult } from "@/lib/gameplay/utils";
import { selectCodeByUser, selectCodeOutputSetterForUser, selectExecutionStatusSetterForUser, selectTestCaseResultsSetterForUser, useMultiplayerGameplayStore } from "@/lib/multiplayer/hooks/useMultiplayerGameplayStore";
import { printd } from "@/lib/utils/debugUtils";
import { keyboardManager } from "@/lib/utils/keyboardManager";
import type * as monacoType from 'monaco-editor';
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useShallow } from "zustand/shallow";
import CodeEditor from "../../components/CodeEditor";
import QuestionDisplay from "../../components/QuestionDisplay";
import QuestionSwitcher from "../../components/QuestionSwitcher";
import styles from "./page.module.css";

export function DefaultLayout({ questions }: { questions: Question[] }) {
    const [monaco, setMonaco] = useState<typeof import('monaco-editor') | null>(null);
    useEffect(() => {
        import('monaco-editor').then((monacoInstance) => {
            setMonaco(monacoInstance);
        });
    }, []);

    useEffect(() => {
        printd("@/components/multiplayer/layout/default/DefaultLayout", "Received questions:", questions);
    }, [questions]);

    // for code editor
    const user = useUserStore(state => state.user);
    const userPreference = useUserPreferenceStore(state => state.userPreference);
    const editorRef = useRef<monacoType.editor.IStandaloneCodeEditor | null>(null);
    const gameplayRef = useRef<HTMLDivElement | null>(null);

    const activeTestCaseIndex = useMultiplayerGameplayStore(state => state.activeTestCaseIndex);
    const activeCodeView = useMultiplayerGameplayStore(state => state.activeCodeView);
    const activeTab = activeCodeView.kind === "shared"
        ? "Team"
        : activeCodeView.userId === user.id
            ? "You"
            : activeCodeView.userId.toString();
    const setActiveCodeView = useMultiplayerGameplayStore(state => state.setActiveCodeView);
    const activeQuestionIndex = useMultiplayerGameplayStore(state => state.activeQuestionIndex);
    const readOnly = activeCodeView.kind === "private" && activeCodeView.userId != user.id;

    const informationMode = useMultiplayerGameplayStore(state => state.informationMode);
    const setInformationMode = useMultiplayerGameplayStore(state => state.setInformationMode);

    const isLocked = useMultiplayerGameplayStore(state => state.isLocked);

    const [
        runCode,
        runTestCases,
        submitCode
    ] = useMultiplayerGameplayStore(
        useShallow(
            state => [
                state.runCode,
                state.runTestCases,
                state.submitCode
            ]
        )
    );


    const setExecutionStatusForUser = useMultiplayerGameplayStore(selectExecutionStatusSetterForUser);
    const setTestCaseResultsForUser = useMultiplayerGameplayStore(selectTestCaseResultsSetterForUser);
    const setCodeOutputForUser = useMultiplayerGameplayStore(selectCodeOutputSetterForUser);

    const setTestCaseResults = useCallback((testCaseResults: TestCaseResult[]) =>
        setTestCaseResultsForUser(activeTab, activeQuestionIndex, testCaseResults)
        , [activeTab, activeQuestionIndex, setTestCaseResultsForUser]);

    const setCodeOutput = useCallback((output: OutputEntry[]) =>
        setCodeOutputForUser(activeTab, output)
        , [activeTab, setCodeOutputForUser]);

    // instantiates the reference to the code editor when it first mounts
    const handleEditorDidMount = useCallback((editor: monacoType.editor.IStandaloneCodeEditor, monacoInstance: typeof monacoType) => {
        instantiateEditorOnMount(editorRef, editor, monacoInstance, userPreference);
    }, [userPreference]);
    const { openPopupWith } = usePopup();

    // for code handling
    // executing code normally
    const runCodeWrapper = useCallback(async () => {
        if (readOnly) {
            openPopupWith(
                "You do not have permission to run another player's code.",
                "Understood",
                null,
                () => { },
                () => { }
            );

            return;
        }

        const activeTab = activeCodeView.kind === "shared" ? "Team" : activeCodeView.userId.toString();

        setExecutionStatusForUser(activeTab, "running");

        const response = await runCode();

        if (!response) {
            setExecutionStatusForUser(activeTab, "codeError");
            return;
        }

        openPopupWith(
            response.message,
            "Understood",
            null,
            () => { },
            () => { }
        );
    }, [runCode, readOnly, openPopupWith]);

    const runTestCasesWrapper = useCallback(async () => {
        if (readOnly) {
            openPopupWith(
                "You do not have permission to run test cases for another player's code.",
                "Understood",
                null,
                () => { },
                () => { }
            );

            return;
        }

        const activeTab = activeCodeView.kind === "shared" ? "Team" : activeCodeView.userId.toString();

        setExecutionStatusForUser(activeTab, "running");

        const response = await runTestCases();

        if (!response) {
            setExecutionStatusForUser(activeTab, "codeError");
            return;
        }

        openPopupWith(
            response.message,
            "Understood",
            null,
            () => { },
            () => { }
        );
    }, [runTestCases, readOnly, openPopupWith]);

    const router = useRouter();
    const reset = useMultiplayerGameplayStore(state => state.reset);
    const submitWrapper = useCallback(async () => {
        setExecutionStatusForUser("Team", "running");

        const response = await submitCode();

        if (!response) {
            setExecutionStatusForUser("Team", "codeError");
            return;
        }

        const submissionSuccessful = response.message === "Congratulations! You pass all test cases. Exit?";

        openPopupWith(
            response.message,
            submissionSuccessful ? "Exit" : "Understood",
            submissionSuccessful ? "Go back to code" : null,
            submissionSuccessful ? () => { reset(); router.push("/home") } : () => { },
            () => { }
        );
    }, []);

    // change model whenever the user changes tab
    const codeByUser = useMultiplayerGameplayStore(useShallow(selectCodeByUser));
    const codeForTab = codeByUser[activeTab];

    useEffect(() => {
        const editor = editorRef.current;

        if (!editor || !monaco) {
            return;
        }

        const model = editor.getModel();

        /*
            If I call `model.setValue(codeByUser[activeTab])`, codeByUser will become a dependency
            of this useEffect, which will cause an infinite loop as `setValue` triggers a change
            in state of codeByUser.

            Thus, I use `codeForTab`, which removes the dependency on codeByUser.
        */
        if (model && codeForTab && model.getValue() !== codeForTab[activeQuestionIndex]) {
            model.setValue(codeForTab[activeQuestionIndex]);
        }
    }, [activeTab, codeForTab, activeQuestionIndex, monaco]);

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
                if (isLocked || readOnly) {
                    return false;
                }

                runCodeWrapper();
                return true;
            } else if (isKeyCombo(e, GAMEPLAY_KEY_BINDINGS["RUN_TEST_CASES"].combo)) {
                e.preventDefault();
                if (isLocked || readOnly) {
                    return false;
                }

                runTestCasesWrapper();
                return true;
            } else if (isKeyCombo(e, GAMEPLAY_KEY_BINDINGS["SUBMIT_CODE"].combo)) {
                e.preventDefault();
                if (isLocked || readOnly) {
                    return false;
                }

                submitWrapper();
                return true;
            } else if (isKeyCombo(e, GAMEPLAY_KEY_BINDINGS["FOCUS_EDITOR"].combo) && editor) {
                e.preventDefault(); // stop "i" from inserting text somewhere random
                editor.focus();
                return true;
            } else if (isKeyCombo(e, GAMEPLAY_KEY_BINDINGS["TOGGLE_OUTPUT_TEST_CASE_MODE"].combo)) {
                e.preventDefault();
                setInformationMode(informationMode === "output" ? "testCases" : "output");
                return true;
            } else if (isKeyCombo(e, MULTIPLAYER_KEY_BINDINGS["TOGGLE_TEAM_TAB"].combo)) {
                e.preventDefault();

                setActiveCodeView({ kind: "shared" });
                return true;
            } else if (isKeyCombo(e, MULTIPLAYER_KEY_BINDINGS["TOGGLE_PLAYER_1_TAB"].combo)) {
                e.preventDefault();
                setActiveCodeView({ kind: "private", userId: user.id });
                return true;
            } else if (isKeyCombo(e, MULTIPLAYER_KEY_BINDINGS["TOGGLE_PLAYER_2_TAB"].combo)) {
                e.preventDefault();
                setActiveCodeView({ kind: "private", userId: Number(Object.keys(codeByUser)[2]) });
                return true;
            } else if (isKeyCombo(e, MULTIPLAYER_KEY_BINDINGS["TOGGLE_PLAYER_3_TAB"].combo)) {
                e.preventDefault();

                if (Object.keys(codeByUser).length < 4) {
                    return false;
                }

                setActiveCodeView({ kind: "private", userId: Number(Object.keys(codeByUser)[3]) });
                return true;
            }

            return false;
        }

        keyboardManager.register("gameplay", "GAMEPLAY_KEY_PRIORITY", handleKeyDown);

        return () => {
            keyboardManager.unregister("gameplay");
        }
    }, [runCodeWrapper, runTestCases, submitWrapper, informationMode, isLocked, readOnly, activeCodeView, setActiveCodeView, codeByUser, setInformationMode]);

    if (!questions) {
        printd("@/components/multiplayer/layout/default/DefaultLayout", "No questions received. Rendering null.");
        return null;
    }

    return (
        <div ref={gameplayRef} tabIndex={0}>
            <PanelGroup direction="horizontal" className={styles.gameplayPanels} style={{ height: "100vh" }}>
                <Panel defaultSize={40} minSize={2}>
                    <QuestionSwitcher numQuestions={questions.length} />
                    <QuestionDisplay question={questions[activeQuestionIndex]} />
                </Panel>
                <PanelResizeHandle className={styles.verticalGameplayPanelResizeHandler} />
                <Panel defaultSize={60} minSize={2} className={styles.codePanel}>
                    <CodeEditor
                        onMount={handleEditorDidMount}
                    />
                    <DefaultTestCases
                        testCases={questions[activeQuestionIndex].publicTestCases}
                        runCode={runCodeWrapper}
                        runTestCases={runTestCasesWrapper}
                        submitCode={submitWrapper}
                    />
                </Panel>
            </PanelGroup>
        </div>
    );
}