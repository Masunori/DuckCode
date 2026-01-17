"use client";

import { GAMEPLAY_KEY_BINDINGS, isKeyCombo, PROGRAMMING_LANGUAGES } from "@/components/settings/settingsUtils";
import { usePopup } from "@/contexts/PopupContext";
import { runCode } from "@/lib/apiClient/gameplay";
import { OutputEntry } from "@/lib/apiClient/runCodeStatuses";
import { keyboardManager } from "@/lib/utils/keyboardManager";
import { LockV2 } from "@/lib/utils/lock";
import * as monaco from 'monaco-editor';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { instantiateEditorOnMount } from "@/lib/gameplay/utils";
import CodeEditor from "./components/CodeEditor";
import GameplayNavbar from "./components/GameplayNavbar";
import Output from "./components/Output";
import styles from "./page.module.css";
import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";

export default function Page() {
    // for code editor
    const userPreference = useUserPreferenceStore(state => state.userPreference);
    const [codeContent, setCodeContent] = useState<string | undefined>(PROGRAMMING_LANGUAGES[userPreference.language].codeSnippet);
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const gameplayRef = useRef<HTMLDivElement | null>(null);
    const [isClusterLocked, setIsClusterLocked] = useState(false);

    const lock: LockV2 = useMemo(() => new LockV2(), []);

    useEffect(() => {
        const unsubscribe = lock.subscribe(setIsClusterLocked);
        return unsubscribe;
    }, [lock]);

    const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) => {
        instantiateEditorOnMount(editorRef, editor, monacoInstance, userPreference);
    }

    // this is used in the information panel
    const [codeOutput, setCodeOutput] = useState<OutputEntry[]>(
        [
            {
                type: "log",
                content: ">> Your code will be displayed here...",
            },
        ]
    );

    const { openPopupWith } = usePopup();

    // for code handling
    // executing code normally
    const runCodeOutputMode = useCallback(async () => {
        if (typeof (codeContent) === undefined) {
            return;
        }

        try {
            const response = await lock.call(() => runCode(codeContent as string, userPreference.language));

            if (!response) {
                throw new Error("Please wait for the code to run before attempting running the code again.");
            }

            setCodeOutput(response.output);

            if (response.status != 200 || !response.output) {
                throw new Error(`An error occurred. Message: ${response.codeStatus}`);
            }
        } catch (err) {
            openPopupWith(
                (err as Error).message,
                "Understood",
                null,
                () => { },
                () => { }
            )
        }

    }, [codeContent, lock, openPopupWith]);

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
                            disabled={isClusterLocked}
                            style={{
                                pointerEvents: isClusterLocked ? "none" : "auto"
                            }}
                        >Run Code</button>
                    </div>
                    <Output codeOutput={codeOutput} />
                </Panel>
                <PanelResizeHandle className={styles.verticalGameplayPanelResizeHandler} />
                <Panel defaultSize={50} minSize={2}>
                    <CodeEditor
                        onMount={handleEditorDidMount}
                        codeContent={codeContent}
                        setCodeContent={setCodeContent}
                    />
                </Panel>
            </PanelGroup>
        </div>
    );
}