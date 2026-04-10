"use client";

import { UserPreference } from "@/app/userPrefs/userPrefsTypes";
import { LINE_NUMBERS_OPTIONS, RENDER_WHITESPACE_OPTIONS, WORD_WRAP_OPTIONS } from "@/app/userPrefs/userPrefsUtils";
import DropdownInput from "@/components/inputs/DropdownInput";
import NumberInput from "@/components/inputs/NumberInput";
import styles from "@/components/settings/settings.module.css";
import { PRESET_THEMES } from "@/components/themes/themes";
import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";
import { Editor, loader } from "@monaco-editor/react";
import * as monaco from 'monaco-editor';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { CODE_EDITOR_LIVE_PREVIEW_TEXT, isKeyCombo, PLKeys, PROGRAMMING_LANGUAGES } from "../settingsUtils";
import { keyboardManager } from "@/lib/utils/keyboardManager";
import { printd } from "@/lib/utils/debugUtils";

loader.config({
	paths: {
		vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.0/min/vs',
	},
});

type CodeEditorSettingsProps = {
    nextUserPreference: UserPreference;
    setNextUserPreference: Dispatch<SetStateAction<UserPreference>>;
}

export default function CodeEditorSettings({ nextUserPreference, setNextUserPreference }: CodeEditorSettingsProps) {
    const userPreference = useUserPreferenceStore(state => state.userPreference);

    const options = Object.entries(PROGRAMMING_LANGUAGES).map(([plkey, value]) => `${plkey} (${value.version})`);
    const extractPLKey = (str: string) => str.split(" ")[0];

    const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
        detectIndentation: false,
        fontSize: userPreference.fontSize,
        lineNumbers: LINE_NUMBERS_OPTIONS[nextUserPreference.editorOptions.lineNumbers],
        minimap: {
            enabled: nextUserPreference.editorOptions.enableMinimap,
        },
        renderWhitespace: RENDER_WHITESPACE_OPTIONS[nextUserPreference.editorOptions.renderWhiteSpace],
        tabSize: nextUserPreference.editorOptions.tabSize,
        wordWrap: WORD_WRAP_OPTIONS[nextUserPreference.editorOptions.wordWrap],
        wordWrapColumn: nextUserPreference.editorOptions.wordWrapColumn,
    }

    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null);
    const monacoRef = useRef<typeof monaco>(null);
    const [isEditorReady, setIsEditorReady] = useState(false);

    function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) {
        editorRef.current = editor;
        monacoRef.current = monacoInstance;
        setIsEditorReady(true);
    }

    useEffect(() => {
        const editor = editorRef.current;
        const monacoInstance = monacoRef.current;

        if (!editor || !monacoInstance) return;

        function handleEscapeKey(e: KeyboardEvent) {
            if (isKeyCombo(e, { ctrl: false, shift: false, key: "Escape" })) {
                e.preventDefault();
                const domNode = editor?.getDomNode();

                if (domNode && domNode.contains(document.activeElement)) {
                    (document.activeElement as HTMLElement).blur();
                    return true;
                }
            }

            return false;
        }

        keyboardManager.register(
            "codeEditorSettingsEscapeKey",
            "INPUT_KEY_PRIORITY",
            handleEscapeKey
        );

        return () => {
            keyboardManager.unregister("codeEditorSettingsEscapeKey");
        }
    }, [isEditorReady]);

    return (
        <PanelGroup direction="horizontal" className={`${styles.settingsOptionDisplay} ${styles.codeEditorSettingsDisplay}`}>
            <Panel defaultSize={50} minSize={25} maxSize={80} className={styles.demoEditor}>
                <h2>Code Editor Preview</h2>
                <Editor
                    onMount={handleEditorDidMount}
                    height="85%"
                    options={editorOptions}
                    value={CODE_EDITOR_LIVE_PREVIEW_TEXT}
                    theme={PRESET_THEMES[nextUserPreference.editorOptions.theme].monacoEditorAlias}
                    language={PROGRAMMING_LANGUAGES[nextUserPreference.language].monacoEditorAlias}
                />
            </Panel>
            <PanelResizeHandle className={styles.resizeHandler} />
            <Panel defaultSize={50} >
                <div className={styles.codeEditorSettingsOptions}>
                    <section className={styles.settingsContentChunk}>
                        <h2>Functional Settings</h2>
                        {nextUserPreference && <DropdownInput
                            options={options}
                            defaultOption={`${nextUserPreference.language} (${PROGRAMMING_LANGUAGES[nextUserPreference.language].version})`}
                            inputId="programming-language-options"
                            dropdownName="Programming Language"
                            handleOptionChange={option => {
                                setNextUserPreference({
                                    ...nextUserPreference,
                                    language: extractPLKey(option) as PLKeys
                                })
                            }}
                        />}
                    </section>
                    <section className={styles.settingsContentChunk}>
                        <h2>Visual Settings</h2>
                        {nextUserPreference && <DropdownInput
                            options={Object.keys(PRESET_THEMES)}
                            defaultOption={nextUserPreference.editorOptions.theme}
                            inputId="editor-theme"
                            dropdownName="Theme"
                            handleOptionChange={option => {
                                setNextUserPreference({
                                    ...nextUserPreference,
                                    editorOptions: {
                                        ...nextUserPreference.editorOptions,
                                        theme: option
                                    }
                                })
                            }}
                        />}
                        {nextUserPreference && <DropdownInput
                            options={Object.keys(LINE_NUMBERS_OPTIONS)}
                            defaultOption={nextUserPreference.editorOptions.lineNumbers}
                            inputId="line-numbers"
                            dropdownName="Line Numbers"
                            handleOptionChange={option => {
                                setNextUserPreference({
                                    ...nextUserPreference,
                                    editorOptions: {
                                        ...nextUserPreference.editorOptions,
                                        lineNumbers: option
                                    }
                                })
                            }}
                        />}
                        {nextUserPreference && <DropdownInput
                            options={["True", "False"]}
                            defaultOption={nextUserPreference.editorOptions.enableMinimap ? "True" : "False"}
                            inputId="enable-minimap"
                            dropdownName="Enable Minimap"
                            handleOptionChange={option => {
                                setNextUserPreference({
                                    ...nextUserPreference,
                                    editorOptions: {
                                        ...nextUserPreference.editorOptions,
                                        enableMinimap: option === "True"
                                    }
                                })
                            }}
                        />}
                        {nextUserPreference && <DropdownInput
                            options={Object.keys(RENDER_WHITESPACE_OPTIONS)}
                            defaultOption={nextUserPreference.editorOptions.renderWhiteSpace}
                            inputId="render-whitespace"
                            dropdownName="Whitespace Rendering"
                            handleOptionChange={option => {
                                setNextUserPreference({
                                    ...nextUserPreference,
                                    editorOptions: {
                                        ...nextUserPreference.editorOptions,
                                        renderWhiteSpace: option
                                    }
                                })
                            }}
                        />}
                        {nextUserPreference && <DropdownInput
                            options={["2", "4", "8"]}
                            defaultOption={nextUserPreference.editorOptions.tabSize.toString()}
                            inputId="tab-size"
                            dropdownName="Tab size"
                            handleOptionChange={option => {
                                setNextUserPreference({
                                    ...nextUserPreference,
                                    editorOptions: {
                                        ...nextUserPreference.editorOptions,
                                        tabSize: Number(option)
                                    }
                                })
                            }}
                        />}
                        {nextUserPreference && <DropdownInput
                            options={Object.keys(WORD_WRAP_OPTIONS)}
                            defaultOption={nextUserPreference.editorOptions.wordWrap}
                            inputId="word-wrap"
                            dropdownName="Word Wrap"
                            handleOptionChange={option => {
                                setNextUserPreference({
                                    ...nextUserPreference,
                                    editorOptions: {
                                        ...nextUserPreference.editorOptions,
                                        wordWrap: option
                                    }
                                })
                            }}
                        />}
                        {nextUserPreference && <NumberInput
                            inputId="word-wrap-column"
                            defaultValue={userPreference.editorOptions.wordWrapColumn as number}
                            min={40}
                            max={200}
                            increment={10}
                            inputName="Word Wrap Column"
                            handleInputChange={num => {
                                setNextUserPreference({
                                    ...nextUserPreference,
                                    editorOptions: {
                                        ...nextUserPreference.editorOptions,
                                        wordWrapColumn: num
                                    }
                                })
                            }}
                        />}
                    </section>
                </div>
            </Panel>
        </PanelGroup>
    )
}