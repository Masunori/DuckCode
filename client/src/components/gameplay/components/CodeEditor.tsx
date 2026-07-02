"use client";

import { LINE_NUMBERS_OPTIONS, RENDER_WHITESPACE_OPTIONS, WORD_WRAP_OPTIONS } from "@/app/userPrefs/userPrefsUtils";
import { PROGRAMMING_LANGUAGES } from "@/utils/settings";
import { PRESET_THEMES } from "@/components/themes/themes";
import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";
import { useDebouncedSave } from "@/hooks/useDebounce";
import { useBaseGameplayStore } from "@/hooks/useBaseGameplayStore";
import { printd } from "@/utils/debugUtils";
import { Editor, loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { RefObject, useEffect, useRef } from "react";
import styles from "../page.module.css";
import { useGettingStartedInstruction } from "@/contexts/GettingStartedInstructionContext";
import useEditor from "@/hooks/useEditor";

loader.config({
    paths: {
        vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/vs',
    },
});

type CodeEditorProps = {
    editorRef: RefObject<monaco.editor.IStandaloneCodeEditor | null>;
}

export default function CodeEditor({ editorRef }: CodeEditorProps) {
    const userPreference = useUserPreferenceStore(state => state.userPreference);
    const editorOptionsStore = useUserPreferenceStore(state => state.userPreference.editorOptions);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const monacoRef = useRef<typeof monaco | null>(null);

    const ctx = useGettingStartedInstruction();

    useEffect(() => {
        const update = () => {
            if (containerRef.current) {
                ctx?.registerTargetRect("code-editor", containerRef.current.getBoundingClientRect());
            }
        }

        update();

        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [])

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

    // changes the default code content whenever programming language changes
    useEffect(() => {
        printd("@/components/gameplay/components/CodeEditor", "User language preference is:", languageRef.current);
        printd("@/components/gameplay/components/CodeEditor", "User language preference changed to:", userPreference.language);

        if (languageRef.current === userPreference.language) {
            return;
        }
        languageRef.current = userPreference.language;
        setCodeContent(new Array(codeContent.length).fill(PROGRAMMING_LANGUAGES[userPreference.language].codeSnippet));

        printd("@/components/gameplay/components/CodeEditor", "Updated code content due to language change.");
    }, [userPreference.language, setCodeContent, codeContent.length]);

    const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
        // theme: PRESET_THEMES[editorOptionsStore.theme].monacoEditorAlias,
        // language: PROGRAMMING_LANGUAGES[userPreference.language].monacoEditorAlias,
        // value: code,

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

    useEditor({ monacoRef, editorRef });

    return (
        <div className={styles.codeEditor} ref={containerRef}>
            <Editor
                theme={PRESET_THEMES[editorOptionsStore.theme].monacoEditorAlias}
                language={PROGRAMMING_LANGUAGES[userPreference.language].monacoEditorAlias}
                defaultValue={code}
                options={editorOptions}
                onMount={(editor, monaco) => {
                    editorRef.current = editor;
                    monacoRef.current = monaco;
                }}
                onChange={handleEditorChange}
            />
        </div>
    );
}