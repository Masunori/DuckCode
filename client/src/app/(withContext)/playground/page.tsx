"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GAMEPLAY_KEY_BINDINGS, isKeyCombo, PROGRAMMING_LANGUAGES } from "@/app/components/settings/settingsUtils";
import { useUserStore } from"@/app/components/contexts/UserContext";
import * as monaco from 'monaco-editor';
import { OutputEntry } from "@/app/api/gameplay/RunCodeStatuses";
import { usePopup } from "@/app/components/contexts/PopupContext";
import { Lock, LockUnavailableError } from "@/app/utils/lock";
import { runCode } from "@/lib/apiClient/gameplay";
import GameplayNavbar from "./components/GameplayNavbar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import CodeEditor from "./components/CodeEditor";
import styles from "./page.module.css";
import Output from "./components/Output";
import { keyboardManager } from "@/app/utils/keyboardManager";
import { instantiateEditorOnMount } from "../gameplay/gameplayUtils";

export default function Page() {
    // for code editor
    const user = useUserStore(state => state.user);
    const [codeContent, setCodeContent] = useState<string | undefined>(PROGRAMMING_LANGUAGES[user.userPreference.language].code_snippet);
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const gameplayRef = useRef<HTMLDivElement | null>(null);
    const lock: Lock = useMemo(() => new Lock(), []);
    const [isClusterLocked, setIsClusterLocked] = useState(false);

    const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) => {
        instantiateEditorOnMount(editorRef, editor, monacoInstance, user);
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
        if (typeof(codeContent) === undefined) {
            return;
        }
        
        try {
            setIsClusterLocked(true);
            const response = await lock.call(() => runCode(0, codeContent as string, 'JavaScript'));

            if (response.status != 200 || !response.output) {
                throw new Error(`An error occurred. Error code: ${response.status}. Message: ${response.message}`);
            }

            setCodeOutput(response.output);
        } catch (err) {
            if (err instanceof LockUnavailableError) {
                openPopupWith(
                    "Please wait for the code to run before attempting running the code again, running test cases, or submitting the code.",
                    "Understood",
                    null,
                    () => {},
                    () => {}
                )
            } else {
                openPopupWith(
                    (err as Error).message,
                    "Understood",
                    null,
                    () => {},
                    () => {}
                )
            }
        } finally {
            setIsClusterLocked(false);
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