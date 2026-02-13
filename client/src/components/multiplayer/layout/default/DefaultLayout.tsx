"use client";

import { GAMEPLAY_KEY_BINDINGS, isKeyCombo, MULTIPLAYER_KEY_BINDINGS } from "@/components/settings/settingsUtils";
import { usePopup } from "@/contexts/PopupContext";
import { useUserStore } from "@/contexts/UserContext";
import { OutputEntry } from "@/lib/apiClient/runCodeStatuses";
import { keyboardManager } from "@/lib/utils/keyboardManager";
import type * as monacoType from 'monaco-editor';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useShallow } from "zustand/shallow";
import CodeEditor from "../../components/CodeEditor";
import QuestionDisplay from "../../components/QuestionDisplay";
import { useGameplayController } from "../../hooks/useGameplayController";
import { instantiateEditorOnMount, Question, runCodeOutputModeClientSide, runTestCasesClientSide, submitCodeClientSide, TestCaseResult } from "../../multiplayerUtils";
import { useCodeEditorStore } from "../../stores/codeEditorStores";
import { useCodeExecutionStore } from "../../stores/codeExecutionStore";
import TestCases from "./components/TestCases";
import styles from "./page.module.css";

export function DefaultLayout({ questions }: { questions: Question[] }) {
    const [monaco, setMonaco] = useState<typeof import('monaco-editor') | null>(null);
    useEffect(() => {
        import('monaco-editor').then((monacoInstance) => {
            setMonaco(monacoInstance);
        });
    }, []);

    // for code editor
    const user = useUserStore(state => state.user);
    const editorRef = useRef<monacoType.editor.IStandaloneCodeEditor | null>(null);
    const gameplayRef = useRef<HTMLDivElement | null>(null);

    const [
        setActiveIndex,
        activeTab,
        setActiveTab,
        informationMode,
        setInformationMode,
        lock,
        isClusterLocked,
        setIsClusterLocked,
        readOnlyTabs
    ] = useGameplayController(
        useShallow((state) => [
            state.setActiveTestCaseIndex,
            state.activeTab,
            state.setActiveTab,
            state.informationMode,
            state.setInformationMode,
            state.lock,
            state.isClusterLocked,
            state.setIsClusterLocked,
            state.readOnlyTabs
        ])
    );

    // changes code output and test case results content when changing code editor tabs
    const [
        setExecutionStatus,
        setTestCaseResultsForUser,
        setOutputForUser
    ] = useCodeExecutionStore(
        useShallow((state) => [
            state.setExecutionStatus,
            state.setTestCaseResults,
            state.setOutput
        ])
    );

    const setTestCaseResults = useCallback((testCaseResults: TestCaseResult[]) =>
        setTestCaseResultsForUser(activeTab, testCaseResults)
        , [activeTab, setTestCaseResultsForUser]);

    const setCodeOutput = useCallback((output: OutputEntry[]) =>
        setOutputForUser(activeTab, output)
        , [activeTab, setOutputForUser]);

    const codeByUser = useCodeEditorStore(state => state.codeByUser);
    const programmingLanguage = useCodeEditorStore(state => state.programmingLanguage);

    const isReadonlyTab = useMemo(() => readOnlyTabs.includes(activeTab), [activeTab, readOnlyTabs]);

    // instantiates the reference to the code editor when it first mounts
    const handleEditorDidMount = (editor: monacoType.editor.IStandaloneCodeEditor, monacoInstance: typeof monacoType) => {
        instantiateEditorOnMount(editorRef, editor, monacoInstance, user);
    }
    const { openPopupWith } = usePopup();

    // for code handling
    // executing code normally
    const runCodeOutputMode = useCallback(async () => {
        if (isReadonlyTab) {
            return;
        }

        setExecutionStatus(activeTab, "running");

        runCodeOutputModeClientSide(
            codeByUser[activeTab],
            programmingLanguage,
            lock,
            setIsClusterLocked,
            setCodeOutput,
            openPopupWith,
            setInformationMode,
            activeTab,
            setExecutionStatus
        );
    }, [isReadonlyTab, setExecutionStatus, activeTab, codeByUser, programmingLanguage, lock, setIsClusterLocked, setCodeOutput, openPopupWith, setInformationMode]);

    // submit code
    const submit = useCallback(async () => {
        if (activeTab !== "Team") {
            return;
        }

        setExecutionStatus(activeTab, "running");

        submitCodeClientSide(
            codeByUser[activeTab],
            programmingLanguage,
            question,
            lock,
            setIsClusterLocked,
            setCodeOutput,
            openPopupWith,
            setInformationMode
        );
    }, [activeTab, setExecutionStatus, codeByUser, programmingLanguage, question, lock, setIsClusterLocked, setCodeOutput, openPopupWith, setInformationMode]);

    // run code against all test cases
    // if all test cases passed, prompt to submit code
    const runTestCases = useCallback(async () => {
        if (isReadonlyTab) {
            return;
        }

        setExecutionStatus(activeTab, "running");

        runTestCasesClientSide(
            codeByUser[activeTab],
            programmingLanguage,
            question,
            lock,
            setIsClusterLocked,
            setCodeOutput,
            setTestCaseResults,
            setActiveIndex,
            openPopupWith,
            setInformationMode,
            activeTab,
            setExecutionStatus
        );

        console.log(useCodeExecutionStore.getState().testCasesResultsByUser);
    }, [activeTab, codeByUser, isReadonlyTab, lock, openPopupWith, programmingLanguage, question, setActiveIndex, setCodeOutput, setExecutionStatus, setInformationMode, setIsClusterLocked, setTestCaseResults]);

    // change model whenever the user changes tab
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
        if (model && model.getValue() !== codeForTab) {
            model.setValue(codeForTab);
        }
    }, [activeTab, codeForTab, monaco]);

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
                if (isClusterLocked || readOnlyTabs.includes(activeTab)) {
                    return false;
                }

                runCodeOutputMode();
                return true;
            } else if (isKeyCombo(e, GAMEPLAY_KEY_BINDINGS["RUN_TEST_CASES"].combo)) {
                e.preventDefault();
                if (isClusterLocked || readOnlyTabs.includes(activeTab)) {
                    return false;
                }

                runTestCases();
                return true;
            } else if (isKeyCombo(e, GAMEPLAY_KEY_BINDINGS["SUBMIT_CODE"].combo)) {
                e.preventDefault();
                if (isClusterLocked || readOnlyTabs.includes(activeTab)) {
                    return false;
                }

                submit();
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

                setActiveTab("Team");
                return true;
            } else if (isKeyCombo(e, MULTIPLAYER_KEY_BINDINGS["TOGGLE_PLAYER_1_TAB"].combo)) {
                e.preventDefault();
                setActiveTab(Object.keys(codeByUser)[1]);
                return true;
            } else if (isKeyCombo(e, MULTIPLAYER_KEY_BINDINGS["TOGGLE_PLAYER_2_TAB"].combo)) {
                e.preventDefault();
                setActiveTab(Object.keys(codeByUser)[2]);
                return true;
            } else if (isKeyCombo(e, MULTIPLAYER_KEY_BINDINGS["TOGGLE_PLAYER_3_TAB"].combo)) {
                e.preventDefault();

                if (Object.keys(codeByUser).length < 4) {
                    return false;
                }

                setActiveTab(Object.keys(codeByUser)[3]);
                return true;
            }

            return false;
        }

        keyboardManager.register("gameplay", "GAMEPLAY_KEY_PRIORITY", handleKeyDown);

        return () => {
            keyboardManager.unregister("gameplay");
        }
    }, [runCodeOutputMode, runTestCases, submit, informationMode, isClusterLocked, readOnlyTabs, activeTab, setActiveTab, codeByUser, setInformationMode]);

    return (
        <div ref={gameplayRef} tabIndex={0}>
            <PanelGroup direction="horizontal" className={styles.gameplayPanels} style={{ height: "100vh" }}>
                <Panel defaultSize={40} minSize={2}>
                    <QuestionDisplay question={questions[0]} />
                </Panel>
                <PanelResizeHandle className={styles.verticalGameplayPanelResizeHandler} />
                <Panel defaultSize={60} minSize={2} className={styles.codePanel}>
                    <CodeEditor
                        onMount={handleEditorDidMount}
                    />
                    <TestCases
                        testCases={questions[0].publicTestCases}
                        runCode={runCodeOutputMode}
                        runTestCases={runTestCases}
                        submitCode={submit}
                    />
                </Panel>
            </PanelGroup>
        </div>
    );
}