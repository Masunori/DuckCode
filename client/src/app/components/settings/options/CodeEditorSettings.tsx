import { LINE_NUMBERS_OPTIONS, RENDER_WHITESPACE_OPTIONS, UserPreference, WORD_WRAP_OPTIONS } from "@/app/userPrefs/userPrefsUtils";
import DropdownInput from "../../inputs/DropdownInput";
import styles from "../settings.module.css";
import { CODE_EDITOR_LIVE_PREVIEW_TEXT, PLKeys, PROGRAMMING_LANGUAGES } from "../settingsUtils";
import { Dispatch, SetStateAction } from "react";
import * as monaco from 'monaco-editor';
import { Editor } from "@monaco-editor/react";
import NumberInput from "../../inputs/NumberInput";
import { useUserStore } from"../../contexts/UserContext";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { PRESET_THEMES } from "../../themes/themes";

type CodeEditorSettingsProps = {
    nextUserPreference: UserPreference;
    setNextUserPreference: Dispatch<SetStateAction<UserPreference>>;
}

export default function CodeEditorSettings({ nextUserPreference, setNextUserPreference }: CodeEditorSettingsProps) {
    const user = useUserStore(state => state.user);
    const userPreference = user.userPreference;

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

    return (
        <PanelGroup direction="horizontal" className={`${styles.settingsOptionDisplay} ${styles.codeEditorSettingsDisplay}`}>
            <Panel defaultSize={50} minSize={25} maxSize={80} className={styles.demoEditor}>
                <h2>Code Editor Preview</h2>
                <Editor
                    options={ editorOptions }
                    value={CODE_EDITOR_LIVE_PREVIEW_TEXT}
                    theme={PRESET_THEMES[nextUserPreference.editorOptions.theme].monacoEditorAlias}
                    language={PROGRAMMING_LANGUAGES[nextUserPreference.language].monaco_editor_alias}
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