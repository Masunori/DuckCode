"use client";

import { PROGRAMMING_LANGUAGES } from "@/utils/settings";
import { PRESET_THEMES } from "@/components/themes/themes";
import { Editor, loader } from '@monaco-editor/react';
import * as monaco from "monaco-editor";
import { RefObject, useRef } from "react";
import { LINE_NUMBERS_OPTIONS, RENDER_WHITESPACE_OPTIONS, WORD_WRAP_OPTIONS } from "../../../userPrefs/userPrefsUtils";
import styles from "../page.module.css";
import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";
import { useBaseGameplayStore } from "@/hooks/useBaseGameplayStore";
import { useDebouncedSave } from "@/hooks/useDebounce";
import useEditor from "@/hooks/useEditor";
import { SetState } from "@/utils/types";

loader.config({
	paths: {
		vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/vs',
	},
});

type CodeEditorProps = {
    editorRef: RefObject<monaco.editor.IStandaloneCodeEditor | null>;
    setIsFocusedOnEditor: SetState<boolean>;
}

export default function CodeEditor({ editorRef, setIsFocusedOnEditor }: CodeEditorProps) {
    const monacoRef = useRef<typeof monaco | null>(null);
    
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
        // theme: PRESET_THEMES[editorOptionsStore.theme].monacoEditorAlias,
        // language: PROGRAMMING_LANGUAGES[language].monacoEditorAlias,
        // value: codeContent,

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

    useEditor({ monacoRef, editorRef });

    return (
        <div className={styles.codeEditor}>
            <Editor
                theme={PRESET_THEMES[editorOptionsStore.theme].monacoEditorAlias}
                language={PROGRAMMING_LANGUAGES[language].monacoEditorAlias}
                defaultValue={codeContent}
                options={editorOptions}
                onMount={(editor, monaco) => {
                    editorRef.current = editor;
                    monacoRef.current = monaco;

                    editor.onDidFocusEditorWidget(() => {
                        setIsFocusedOnEditor(true);
                    });

                    editor.onDidBlurEditorWidget(() => {
                        setIsFocusedOnEditor(false);
                    });
                }}
                onChange={handleEditorChange}
            />
        </div>
    );
}