"use client";

import { GAMEPLAY_KEY_BINDINGS, isKeyCombo, translateCombo } from "@/utils/keyBindings";
import { usePopup } from "@/contexts/PopupContext";
import { keyboardManager } from "@/utils/keyboardManager";
import * as monaco from 'monaco-editor';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import CodeEditor from "./components/CodeEditor";
import GameplayNavbar from "./components/GameplayNavbar";
import Output from "./components/Output";
import styles from "./page.module.css";
import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";
import { useBaseGameplayStore } from "@/hooks/useBaseGameplayStore";
import { PROGRAMMING_LANGUAGES } from "@/utils/settings";

export default function Page() {
    // for code editor
    const userPreference = useUserPreferenceStore(state => state.userPreference);
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const gameplayRef = useRef<HTMLDivElement | null>(null);

    const languageRef = useRef(userPreference.language);

    const [isFocusedOnEditor, setIsFocusedOnEditor] = useState(false);

    const codeContent = useBaseGameplayStore(state => state.codeContent[0] ?? PROGRAMMING_LANGUAGES[userPreference.language].codeSnippet);
    const setCodeContentAtIndex = useBaseGameplayStore(state => state.setCodeContentAtIndex);
    const setCodeContent = (code: string) => setCodeContentAtIndex(0, code);

    useEffect(() => {
        const language = userPreference.language;
        const snippet = PROGRAMMING_LANGUAGES[language].codeSnippet;
        const currentCode = useBaseGameplayStore.getState().codeContent[0];

        if (currentCode === undefined) {
            setCodeContent(snippet);
            editorRef.current?.setValue(snippet);
            languageRef.current = language;
            return;
        }

        if (languageRef.current !== language) {
            languageRef.current = language;
            setCodeContent(snippet);
            editorRef.current?.setValue(snippet);
        }
    }, [userPreference.language]);

    const isLocked = useBaseGameplayStore(state => state.isLocked);

    const { openPopupWith } = usePopup();

    const runCode = useBaseGameplayStore(state => state.runCode);
    // for code handling
    // executing code normally
    const runCodeOutputMode = useCallback(async () => {
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


    // this useEffect encapsulates all key bindings
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const editor = editorRef.current;

            if (isFocusedOnEditor) {
                if (isKeyCombo(e, GAMEPLAY_KEY_BINDINGS["DEFOCUS_EDITOR"].combo)) {
                    (document.activeElement as HTMLElement).blur();
                    return true;
                }
            } else if (isKeyCombo(e, GAMEPLAY_KEY_BINDINGS["RUN_CODE_OUTPUT_MODE"].combo)) {
                e.preventDefault();
                runCodeOutputMode();
                return true;
            } else if (isKeyCombo(e, GAMEPLAY_KEY_BINDINGS["FOCUS_EDITOR"].combo) && editor) {
                e.preventDefault(); // stop "i" from inserting text somewhere random
                editor.focus();
                return true;
            } else if (isKeyCombo(e, GAMEPLAY_KEY_BINDINGS["TOGGLE_OUTPUT_TEST_CASE_MODE"].combo)) {
                e.preventDefault();
                return true;
            }

            return false;
        }

        keyboardManager.register("gameplay", "GAMEPLAY_KEY_PRIORITY", handleKeyDown);
        return () => {
            keyboardManager.unregister("gameplay");
        }
    }, [runCodeOutputMode, isFocusedOnEditor]);

    const runCodeKeyHint = userPreference.displayKeyBindingOnButtons
        ? ` [${translateCombo(GAMEPLAY_KEY_BINDINGS["RUN_CODE_OUTPUT_MODE"].combo)}]`
        : "";

    return (
        <div ref={gameplayRef} tabIndex={0}>
            <GameplayNavbar isKeyBindingEnabled={!isFocusedOnEditor} />
            <PanelGroup direction="horizontal" className={styles.gameplayPanels} style={{ height: "100vh" }}>
                <Panel defaultSize={50} minSize={2} className={styles.informationPanel}>
                    <div className={styles.outputTab}>
                        <div className={styles.outputText}>
                            <p>Output</p>
                        </div>
                        <button
                            className={styles.runCodeButton}
                            onClick={runCodeOutputMode}
                            disabled={isLocked || codeContent.trim() === ""}
                        ><b>Run Code</b> <kbd>{runCodeKeyHint}</kbd></button>
                    </div>
                    <Output />
                </Panel>
                
                <PanelResizeHandle className={styles.verticalGameplayPanelResizeHandler} />
                
                <Panel defaultSize={50} minSize={2}>
                    <CodeEditor
                        editorRef={editorRef}
                        setIsFocusedOnEditor={setIsFocusedOnEditor}
                    />
                </Panel>
            </PanelGroup>
        </div>
    );
}