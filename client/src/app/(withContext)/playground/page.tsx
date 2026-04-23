"use client";

import { GAMEPLAY_KEY_BINDINGS, isKeyCombo, translateCombo } from "@/lib/utils/keyBindings";
import { usePopup } from "@/contexts/PopupContext";
import { keyboardManager } from "@/lib/utils/keyboardManager";
import * as monaco from 'monaco-editor';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { instantiateEditorOnMount } from "@/lib/gameplay/utils";
import CodeEditor from "./components/CodeEditor";
import GameplayNavbar from "./components/GameplayNavbar";
import Output from "./components/Output";
import styles from "./page.module.css";
import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";
import { useBaseGameplayStore } from "@/lib/gameplay/hooks/useBaseGameplayStore";
import { PROGRAMMING_LANGUAGES } from "@/components/settings/settingsUtils";

export default function Page() {
    // for code editor
    const userPreference = useUserPreferenceStore(state => state.userPreference);
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const gameplayRef = useRef<HTMLDivElement | null>(null);

    const languageRef = useRef(userPreference.language);

    const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) => {
        instantiateEditorOnMount(editorRef, editor, monacoInstance, userPreference);
    }

    const setCodeContentAtIndex = useBaseGameplayStore(state => state.setCodeContentAtIndex);
    const setCodeContent = (code: string) => setCodeContentAtIndex(0, code);

    useEffect(() => {
        if (languageRef.current === userPreference.language) {
            const currentCode = useBaseGameplayStore.getState().codeContent[0];

            if (currentCode) {
                editorRef.current?.setValue(currentCode);
                return;
            }
            return;
        }

        languageRef.current = userPreference.language;        

        setCodeContent(PROGRAMMING_LANGUAGES[userPreference.language].codeSnippet);
        editorRef.current?.setValue(PROGRAMMING_LANGUAGES[userPreference.language].codeSnippet);
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
    }, [runCodeOutputMode]);

    const runCodeKeyHint = userPreference.displayKeyBindingOnButtons
        ? ` [${translateCombo(GAMEPLAY_KEY_BINDINGS["RUN_CODE_OUTPUT_MODE"].combo)}]`
        : "";

    return (
        <div ref={gameplayRef} tabIndex={0}>
            <GameplayNavbar />
            <PanelGroup direction="horizontal" className={styles.gameplayPanels} style={{ height: "100vh" }}>
                <Panel defaultSize={50} minSize={2} className={styles.informationPanel}>
                    <div className={styles.outputTab}>
                        <div className={styles.outputText}>
                            <p>Output</p>
                        </div>
                        <button
                            className={styles.runCodeButton}
                            onClick={runCodeOutputMode}
                            disabled={isLocked}
                            style={{
                                pointerEvents: isLocked ? "none" : "auto"
                            }}
                        ><b>Run Code</b> <kbd>{runCodeKeyHint}</kbd></button>
                    </div>
                    <Output />
                </Panel>
                <PanelResizeHandle className={styles.verticalGameplayPanelResizeHandler} />
                <Panel defaultSize={50} minSize={2}>
                    <CodeEditor
                        onMount={handleEditorDidMount}
                    />
                </Panel>
            </PanelGroup>
        </div>
    );
}