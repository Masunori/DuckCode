"use client";

import { LINE_NUMBERS_OPTIONS, RENDER_WHITESPACE_OPTIONS, WORD_WRAP_OPTIONS } from "@/app/userPrefs/userPrefsUtils";
import { PROGRAMMING_LANGUAGES } from "@/components/settings/settingsUtils";
import { PRESET_THEMES } from "@/components/themes/themes";
import { useBaseGameplayStore } from "@/hooks/useBaseGameplayStore";
import { loader } from '@monaco-editor/react';
import * as monaco from "monaco-editor";
import { RefObject, useEffect, useRef } from "react";
import styles from "./fullscreenEditor.module.css";
import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";
import { useDebouncedSave } from "@/hooks/useDebounce";
import useEditor from "@/hooks/useEditor";

loader.config({
    paths: {
        vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/vs',
    },
});


type CodeEditorProps = {
    editorRef: RefObject<monaco.editor.IStandaloneCodeEditor | null>;
}

export default function FullScreenCodeEditor({ editorRef }: CodeEditorProps) {
    const userPreference = useUserPreferenceStore(state => state.userPreference);
    const editorOptionsStore = useUserPreferenceStore(state => state.userPreference.editorOptions);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // this makes sure we only update code content when language actually changes, not on every render
    const languageRef = useRef(userPreference.language);

    const codeContent = useBaseGameplayStore(state => state.codeContent);
    const setCodeContent = useBaseGameplayStore(state => state.setCodeContent);
    const setCodeContentAtIndex = useBaseGameplayStore(state => state.setCodeContentAtIndex);
    
    const activeQuestionIndex = useBaseGameplayStore(state => state.activeQuestionIndex);
    const code = useBaseGameplayStore(state => state.codeContent[activeQuestionIndex]);

    const { debouncedSave } = useDebouncedSave((code: string) => setCodeContentAtIndex(activeQuestionIndex, code), 500);

    function handleEditorChange(value: string | undefined) {
        if (value === undefined) {
            return;
        }

        debouncedSave(value);
    }

    useEffect(() => {
        if (languageRef.current === userPreference.language) {
            return;
        }

        languageRef.current = userPreference.language;
        setCodeContent(new Array(codeContent.length).fill(PROGRAMMING_LANGUAGES[userPreference.language].codeSnippet));
    }, [userPreference.language, setCodeContent, codeContent.length]);

    const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
        theme: PRESET_THEMES[editorOptionsStore.theme].monacoEditorAlias,
        language: PROGRAMMING_LANGUAGES[userPreference.language].monacoEditorAlias,
        value: code,

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

    useEditor({ containerRef, editorRef, editorOptions, onChange: handleEditorChange });

    return (
        <div className={styles.codeEditor} ref={containerRef} />
    );
}