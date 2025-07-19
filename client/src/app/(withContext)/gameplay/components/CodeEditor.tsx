"use client";

import styles from "../page.module.css";
import { Editor } from '@monaco-editor/react';
import * as monaco from "monaco-editor";
import { useUserStore } from"@/app/components/contexts/UserContext";
import { PROGRAMMING_LANGUAGES } from "@/app/components/settings/settingsUtils";
import { LINE_NUMBERS_OPTIONS, RENDER_WHITESPACE_OPTIONS, WORD_WRAP_OPTIONS } from "../../../userPrefs/userPrefsUtils";
import { PRESET_THEMES } from "@/app/components/themes/themes";
import { useShallow } from "zustand/shallow";
import { useEffect } from "react";
import { useGameplayStore } from "../hooks/useGameplayStore";

type CodeEditorProps = {
    onMount: (editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) => void;
}

export default function CodeEditor({ onMount }: CodeEditorProps) {
    const user = useUserStore(state => state.user);
    const [codeContent, setCodeContent] = useGameplayStore(
        useShallow(
            state => [state.codeContent, state.setCodeContent]
        )
    )

    function handleEditorChange(value: string | undefined) {
        if (value === undefined) {
            return;
        }

        setCodeContent(value);
    }

    // changes the default code content whenever programming language changes
    useEffect(() => {
        setCodeContent(PROGRAMMING_LANGUAGES[user.userPreference.language].code_snippet);
    }, [user.userPreference.language, setCodeContent]);

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
    }

    return (
        <div className={styles.codeEditor}>
            <Editor
                theme={PRESET_THEMES[user.userPreference.editorOptions.theme].monacoEditorAlias}
                language={PROGRAMMING_LANGUAGES[user.userPreference.language].monaco_editor_alias}
                defaultLanguage="javascript"
                onMount={onMount}
                value={codeContent}
                defaultValue={PROGRAMMING_LANGUAGES[user.userPreference.language].code_snippet}
                onChange={handleEditorChange}
                height={"100%"}
                options={editorOptions}
            />
        </div>
    );
}