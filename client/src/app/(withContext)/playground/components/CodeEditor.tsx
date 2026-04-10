"use client";

import { PROGRAMMING_LANGUAGES } from "@/components/settings/settingsUtils";
import { PRESET_THEMES } from "@/components/themes/themes";
import { Editor, loader } from '@monaco-editor/react';
import * as monaco from "monaco-editor";
import { useEffect, useRef } from "react";
import { LINE_NUMBERS_OPTIONS, RENDER_WHITESPACE_OPTIONS, WORD_WRAP_OPTIONS } from "../../../userPrefs/userPrefsUtils";
import styles from "../page.module.css";
import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";
import { useBaseGameplayStore } from "@/lib/gameplay/hooks/useBaseGameplayStore";
import { useDebouncedSave } from "@/hooks/useDebounce";

loader.config({
	paths: {
		vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.0/min/vs',
	},
});

type CodeEditorProps = {
    onMount: (editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) => void;
}

export default function CodeEditor({ onMount }: CodeEditorProps) {
    const language = useUserPreferenceStore(state => state.userPreference.language);
    const fontSize = useUserPreferenceStore(state => state.userPreference.fontSize);
    const editorOptionsStore = useUserPreferenceStore(state => state.userPreference.editorOptions);

    const codeContent = useBaseGameplayStore(state => state.codeContent[0]);

    const setCodeContentAtIndex = useBaseGameplayStore(state => state.setCodeContentAtIndex);
    const setCodeContent = (code: string) => setCodeContentAtIndex(0, code);

    const { debouncedSave } = useDebouncedSave((code: string) => setCodeContent(code), 500);


    function handleEditorChange(value: string | undefined) {
        if (value === undefined) {
            return;
        }

        debouncedSave(value);
    }

    const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
        detectIndentation: false,
        fontSize: fontSize,
        lineNumbers: LINE_NUMBERS_OPTIONS[editorOptionsStore.lineNumbers],
        minimap: {
            enabled: editorOptionsStore.enableMinimap,
        },
        renderWhitespace: RENDER_WHITESPACE_OPTIONS[editorOptionsStore.renderWhiteSpace],
        tabSize: editorOptionsStore.tabSize,
        wordWrap: WORD_WRAP_OPTIONS[editorOptionsStore.wordWrap],
        wordWrapColumn: editorOptionsStore.wordWrapColumn,
    }

    return (
        <div className={styles.codeEditor}>
            <Editor
                theme={PRESET_THEMES[editorOptionsStore.theme].monacoEditorAlias}
                language={PROGRAMMING_LANGUAGES[language].monacoEditorAlias}
                onMount={onMount}
                defaultValue={codeContent}
                onChange={handleEditorChange}
                height={"100%"}
                options={editorOptions}
            />
        </div>
    );
}