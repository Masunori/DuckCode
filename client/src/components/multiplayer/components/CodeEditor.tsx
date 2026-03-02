"use client";

import { LINE_NUMBERS_OPTIONS, RENDER_WHITESPACE_OPTIONS, WORD_WRAP_OPTIONS } from "@/app/userPrefs/userPrefsUtils";
import { PROGRAMMING_LANGUAGES } from "@/components/settings/settingsUtils";
import { PRESET_THEMES } from "@/components/themes/themes";
import { useUserStore } from "@/contexts/UserContext";
import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";
import { selectCodeByUser, selectCodeSetterForUserAtQuestionIdx, selectExecutionStatusForUser, selectExecutionStatusSetterForUser, useMultiplayerGameplayStore } from "@/lib/multiplayer/hooks/useMultiplayerGameplayStore";
import { EXECUTION_STATUS_INFORMATION } from "@/lib/multiplayer/utils";
import { Editor } from '@monaco-editor/react';
import type * as monaco from "monaco-editor";
import { useShallow } from "zustand/shallow";
import styles from "../page.module.css";

type CodeEditorProps = {
    onMount: (editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) => void;
}

export default function CodeEditor({ onMount }: CodeEditorProps) {
    const user = useUserStore(state => state.user);
    const userPreference = useUserPreferenceStore(state => state.userPreference);

    const activeQuestionIndex = useMultiplayerGameplayStore(state => state.activeQuestionIndex);

    const codeByUser = useMultiplayerGameplayStore(useShallow(selectCodeByUser));
    const setCodeForUserAtQuestionIdx = useMultiplayerGameplayStore(selectCodeSetterForUserAtQuestionIdx);

    const executionStatusByUser = useMultiplayerGameplayStore(useShallow(selectExecutionStatusForUser));
    const setExecutionStatusForUser = useMultiplayerGameplayStore(selectExecutionStatusSetterForUser);

    const activeCodeView = useMultiplayerGameplayStore(state => state.activeCodeView);
    const setActiveCodeView = useMultiplayerGameplayStore(state => state.setActiveCodeView);

    const activeTab = activeCodeView.kind === "shared"
        ? "Team"
        : activeCodeView.userId === user.id
            ? "You"
            : activeCodeView.userId.toString();

    const tabToCodeView = (tab: string) => {
        if (tab === "Team") {
            return { kind: "shared" } as const;
        } else if (tab === "You") {
            return { kind: "private", userId: user.id } as const;
        } else {
            return { kind: "private", userId: parseInt(tab) } as const;
        }
    }

    function handleEditorChange(value: string | undefined) {
        setExecutionStatusForUser(activeTab, "idle");
        setCodeForUserAtQuestionIdx(activeTab, activeQuestionIndex, value || "");
    }

    const readOnly = activeCodeView.kind === "private" && activeCodeView.userId != user.id;

    const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
        detectIndentation: false,
        fontSize: userPreference.fontSize,
        lineNumbers: LINE_NUMBERS_OPTIONS[userPreference.editorOptions.lineNumbers],
        minimap: {
            enabled: userPreference.editorOptions.enableMinimap,
        },
        renderWhitespace: RENDER_WHITESPACE_OPTIONS[userPreference.editorOptions.renderWhiteSpace],
        tabSize: userPreference.editorOptions.tabSize,
        wordWrap: WORD_WRAP_OPTIONS[userPreference.editorOptions.wordWrap],
        wordWrapColumn: userPreference.editorOptions.wordWrapColumn,
        readOnly: readOnly,
    }

    return (
        <div className={styles.codeEditor}>
            <ul className={styles.codeEditorTabs}>
                {Object.keys(codeByUser).map((user, index) => (
                    <li
                        key={index}
                        onClick={() => { setActiveCodeView(tabToCodeView(user)); }}
                        className={activeCodeView.kind === "private" && activeCodeView.userId === parseInt(user) ? styles.selected : ""}
                        style={{ color: EXECUTION_STATUS_INFORMATION[executionStatusByUser[user]].color }}
                    >
                        <div>{user}</div>
                        <span
                            title={EXECUTION_STATUS_INFORMATION[executionStatusByUser[user]].desc}
                        >
                            {EXECUTION_STATUS_INFORMATION[executionStatusByUser[user]].abbr}
                        </span>
                    </li>
                ))}
            </ul>
            <div className={readOnly ? styles.editorOverlayReadonly : styles.editorOverlay}>
                <Editor
                    theme={PRESET_THEMES[userPreference.editorOptions.theme].monacoEditorAlias}
                    language={PROGRAMMING_LANGUAGES[userPreference.language].monacoEditorAlias}
                    defaultLanguage="javascript"
                    onMount={onMount}
                    onChange={handleEditorChange}
                    height={"100%"}
                    options={editorOptions}
                />
            </div>
        </div>
    );
}