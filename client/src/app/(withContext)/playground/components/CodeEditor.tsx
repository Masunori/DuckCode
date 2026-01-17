"use client";

import { PROGRAMMING_LANGUAGES } from "@/components/settings/settingsUtils";
import { PRESET_THEMES } from "@/components/themes/themes";
import { Editor } from '@monaco-editor/react';
import * as monaco from "monaco-editor";
import { Dispatch, SetStateAction, useEffect } from "react";
import { LINE_NUMBERS_OPTIONS, RENDER_WHITESPACE_OPTIONS, WORD_WRAP_OPTIONS } from "../../../userPrefs/userPrefsUtils";
import styles from "../page.module.css";
import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";

type CodeEditorProps = {
    onMount: (editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) => void;
    codeContent: string | undefined;
    setCodeContent: Dispatch<SetStateAction<string | undefined>>;
}

export default function CodeEditor({ onMount, codeContent, setCodeContent }: CodeEditorProps) {
    const userPreference = useUserPreferenceStore(state => state.userPreference);

    function handleEditorChange(value: string | undefined) {
        setCodeContent(value);
    }

    useEffect(() => {
        setCodeContent(PROGRAMMING_LANGUAGES[userPreference.language].codeSnippet);
    }, [userPreference, setCodeContent]);

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
    }

    return (
        <div className={styles.codeEditor}>
            <Editor
                theme={PRESET_THEMES[userPreference.editorOptions.theme].monacoEditorAlias}
                language={PROGRAMMING_LANGUAGES[userPreference.language].monacoEditorAlias}
                defaultLanguage="javascript"
                onMount={onMount}
                value={codeContent}
                defaultValue={PROGRAMMING_LANGUAGES[userPreference.language].codeSnippet}
                onChange={handleEditorChange}
                height={"100%"}
                options={editorOptions}
            />
        </div>
    );
}