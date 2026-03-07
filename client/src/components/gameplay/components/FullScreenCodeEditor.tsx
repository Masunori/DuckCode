"use client";

import { LINE_NUMBERS_OPTIONS, RENDER_WHITESPACE_OPTIONS, WORD_WRAP_OPTIONS } from "@/app/userPrefs/userPrefsUtils";
import { PROGRAMMING_LANGUAGES } from "@/components/settings/settingsUtils";
import { PRESET_THEMES } from "@/components/themes/themes";
import { useBaseGameplayStore } from "@/lib/gameplay/hooks/useBaseGameplayStore";
import { Editor } from '@monaco-editor/react';
import * as monaco from "monaco-editor";
import { useEffect, useRef } from "react";
import styles from "./fullscreenEditor.module.css";
import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";
import { useDebouncedSave } from "@/hooks/useDebounce";

type CodeEditorProps = {
    onMount: (editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) => void;
}

export default function FullScreenCodeEditor({ onMount }: CodeEditorProps) {
    const userPreference = useUserPreferenceStore(state => state.userPreference);

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
                key={userPreference.language}
                theme={PRESET_THEMES[userPreference.editorOptions.theme].monacoEditorAlias}
                language={PROGRAMMING_LANGUAGES[userPreference.language].monacoEditorAlias}
                defaultLanguage="javascript"
                onMount={onMount}
                defaultValue={code}
                onChange={handleEditorChange}
                height={"100%"}
                options={editorOptions}
            />
        </div>
    );
}