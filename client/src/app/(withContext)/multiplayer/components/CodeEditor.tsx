"use client";

import styles from "../page.module.css";
import { Editor } from '@monaco-editor/react';
import type * as monaco from "monaco-editor";
import { useUserStore } from"@/app/components/contexts/UserContext";
import { PROGRAMMING_LANGUAGES } from "@/app/components/settings/settingsUtils";
import { LINE_NUMBERS_OPTIONS, RENDER_WHITESPACE_OPTIONS, WORD_WRAP_OPTIONS } from "../../../userPrefs/userPrefsUtils";
import { PRESET_THEMES } from "@/app/components/themes/themes";
import { useCodeEditorStore } from "../stores/codeEditorStores";
import { EXECUTION_STATUS_INFORMATION } from "../multiplayerUtils";
import { useGameplayController } from "../hooks/useGameplayController";
import { useCodeExecutionStore } from "../stores/codeExecutionStore";

type CodeEditorProps = {
    onMount: (editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) => void;
}

export default function CodeEditor({ onMount }: CodeEditorProps) {
    const user = useUserStore(state => state.user);

    const codeByUser = useCodeEditorStore(state => state.codeByUser);
    const setCodeForUser = useCodeEditorStore(state => state.setCodeForUser);
    
    const executionStatusByUser = useCodeExecutionStore(state => state.executionStatusByUser);
    const setExecutionStatus = useCodeExecutionStore(state => state.setExecutionStatus);

    const activeTab = useGameplayController(state => state.activeTab);
    const setActiveTab = useGameplayController(state => state.setActiveTab);
    const readOnlyTabs = useGameplayController(state => state.readOnlyTabs);

    function handleEditorChange(value: string | undefined) {
        setExecutionStatus(activeTab, "idle");
        setCodeForUser(activeTab, value || "");
    }

    const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
        detectIndentation: false,
        fontSize: user.userPreference.fontSize,
        lineNumbers: LINE_NUMBERS_OPTIONS[user.userPreference.editorOptions.lineNumbers],
        minimap: {
            enabled: user.userPreference.editorOptions.enableMinimap,
        },
        renderWhitespace: RENDER_WHITESPACE_OPTIONS[user.userPreference.editorOptions.renderWhiteSpace],
        tabSize: user.userPreference.editorOptions.tabSize,
        wordWrap: WORD_WRAP_OPTIONS[user.userPreference.editorOptions.wordWrap],
        wordWrapColumn: user.userPreference.editorOptions.wordWrapColumn,
        readOnly: readOnlyTabs.includes(activeTab)
    }

    return (
        <div className={styles.codeEditor}>
            <ul className={styles.codeEditorTabs}>
                {Object.keys(codeByUser).map((user, index) => (
                    <li 
                        key={index} 
                        onClick={() => { setActiveTab(user); }}
                        className={ activeTab === user ? styles.selected : "" }
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
            <div className={readOnlyTabs.includes(activeTab) ? styles.editorOverlayReadonly : styles.editorOverlay}>
                <Editor
                    theme={PRESET_THEMES[user.userPreference.editorOptions.theme].monacoEditorAlias}
                    language={PROGRAMMING_LANGUAGES[user.userPreference.language].monaco_editor_alias}
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