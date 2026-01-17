"use client";

import { LINE_NUMBERS_OPTIONS, RENDER_WHITESPACE_OPTIONS, WORD_WRAP_OPTIONS } from "@/app/userPrefs/userPrefsUtils";
import { PROGRAMMING_LANGUAGES } from "@/components/settings/settingsUtils";
import { PRESET_THEMES } from "@/components/themes/themes";
import { useUserStore } from "@/contexts/UserContext";
import { useBaseGameplayStore } from "@/lib/gameplay/hooks/useBaseGameplayStore";
import { Editor } from '@monaco-editor/react';
import * as monaco from "monaco-editor";
import { useEffect } from "react";
import styles from "../page.module.css";

type CodeEditorProps = {
    onMount: (editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) => void;
}

export default function CodeEditor({ onMount }: CodeEditorProps) {
    const codeContent = useBaseGameplayStore(state => state.codeContent);
    const setCodeContent = useBaseGameplayStore(state => state.setCodeContent);
    const setCodeContentAtIndex = useBaseGameplayStore(state => state.setCodeContentAtIndex);
    const activeQuestionIndex = useBaseGameplayStore(state => state.activeQuestionIndex);

    const user = useUserStore(state => state.user);

    function handleEditorChange(value: string | undefined) {
        if (!value) {
            return;
        }

        setCodeContentAtIndex(activeQuestionIndex, value);
    }

    useEffect(() => {
        setCodeContent(new Array(codeContent.length).fill(PROGRAMMING_LANGUAGES[user.userPreference.language].codeSnippet));
    }, [user.userPreference.language, setCodeContent, codeContent.length]);

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
                language={PROGRAMMING_LANGUAGES[user.userPreference.language].monacoEditorAlias}
                defaultLanguage="javascript"
                onMount={onMount}
                value={codeContent[activeQuestionIndex]}
                defaultValue={PROGRAMMING_LANGUAGES[user.userPreference.language].codeSnippet}
                onChange={handleEditorChange}
                height={"100%"}
                options={editorOptions}
            />
        </div>
    );
}