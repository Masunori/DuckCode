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
    nextuserPreference: UserPreference;
    setNextuserPreference: Dispatch<SetStateAction<UserPreference>>;
}

export default function CodeEditorSettings({ nextuserPreference, setNextuserPreference }: CodeEditorSettingsProps) {
    const user = useUserStore(state => state.user);
    const userPreference = user.userPreference;

    const options = Object.entries(PROGRAMMING_LANGUAGES).map(([plkey, value]) => `${plkey} (${value.version})`);
    const extractPLKey = (str: string) => str.split(" ")[0];
    
    const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
        detectIndentation: false,
        fontSize: userPreference.fontSize,
        lineNumbers: LINE_NUMBERS_OPTIONS[nextuserPreference.editorOptions.lineNumbers],
        minimap: {
            enabled: nextuserPreference.editorOptions.enableMinimap,
        },
        renderWhitespace: RENDER_WHITESPACE_OPTIONS[nextuserPreference.editorOptions.renderWhiteSpace],
        tabSize: nextuserPreference.editorOptions.tabSize,
        wordWrap: WORD_WRAP_OPTIONS[nextuserPreference.editorOptions.wordWrap],
        wordWrapColumn: nextuserPreference.editorOptions.wordWrapColumn,
    }

    return (
        <PanelGroup direction="horizontal" className={`${styles.settingsOptionDisplay} ${styles.codeEditorSettingsDisplay}`}>
            <Panel defaultSize={50} minSize={25} maxSize={80} className={styles.demoEditor}>
                <h2>Code Editor Preview</h2>
                <Editor
                    options={ editorOptions }
                    value={CODE_EDITOR_LIVE_PREVIEW_TEXT}
                    theme={PRESET_THEMES[nextuserPreference.editorOptions.theme].monacoEditorAlias}
                    language={PROGRAMMING_LANGUAGES[nextuserPreference.language].monaco_editor_alias}
                />
            </Panel>
            <PanelResizeHandle className={styles.resizeHandler} />
            <Panel defaultSize={50} >
                <div className={styles.codeEditorSettingsOptions}>
                    <section className={styles.settingsContentChunk}>
                        <h2>Functional Settings</h2>
                        {nextuserPreference && <DropdownInput
                            options={options}
                            defaultOption={`${nextuserPreference.language} (${PROGRAMMING_LANGUAGES[nextuserPreference.language].version})`}
                            inputId="programming-language-options"
                            dropdownName="Programming Language"
                            handleOptionChange={option => {
                                setNextuserPreference({
                                    ...nextuserPreference,
                                    language: extractPLKey(option) as PLKeys
                                })
                            }}
                        />}
                    </section>
                    <section className={styles.settingsContentChunk}>
                        <h2>Visual Settings</h2>
                        {nextuserPreference && <DropdownInput
                            options={Object.keys(PRESET_THEMES)}
                            defaultOption={nextuserPreference.editorOptions.theme}
                            inputId="editor-theme"
                            dropdownName="Theme"
                            handleOptionChange={option => {
                                setNextuserPreference({
                                    ...nextuserPreference,
                                    editorOptions: {
                                        ...nextuserPreference.editorOptions,
                                        theme: option
                                    }
                                })
                            }}
                        />}
                        {nextuserPreference && <DropdownInput
                            options={Object.keys(LINE_NUMBERS_OPTIONS)}
                            defaultOption={nextuserPreference.editorOptions.lineNumbers}
                            inputId="line-numbers"
                            dropdownName="Line Numbers"
                            handleOptionChange={option => {
                                setNextuserPreference({
                                    ...nextuserPreference,
                                    editorOptions: {
                                        ...nextuserPreference.editorOptions,
                                        lineNumbers: option
                                    }
                                })
                            }}
                        />}
                        {nextuserPreference && <DropdownInput
                            options={["True", "False"]}
                            defaultOption={nextuserPreference.editorOptions.enableMinimap ? "True" : "False"}
                            inputId="enable-minimap"
                            dropdownName="Enable Minimap"
                            handleOptionChange={option => {
                                setNextuserPreference({
                                    ...nextuserPreference,
                                    editorOptions: {
                                        ...nextuserPreference.editorOptions,
                                        enableMinimap: option === "True"
                                    }
                                })
                            }}
                        />}
                        {nextuserPreference && <DropdownInput
                            options={Object.keys(RENDER_WHITESPACE_OPTIONS)}
                            defaultOption={nextuserPreference.editorOptions.renderWhiteSpace}   
                            inputId="render-whitespace"
                            dropdownName="Whitespace Rendering"
                            handleOptionChange={option => {
                                setNextuserPreference({
                                    ...nextuserPreference,
                                    editorOptions: {
                                        ...nextuserPreference.editorOptions,
                                        renderWhiteSpace: option
                                    }
                                })
                            }}
                        />}
                        {nextuserPreference && <DropdownInput
                            options={["2", "4", "8"]}
                            defaultOption={nextuserPreference.editorOptions.tabSize.toString()}
                            inputId="tab-size"
                            dropdownName="Tab size"
                            handleOptionChange={option => {
                                setNextuserPreference({
                                    ...nextuserPreference,
                                    editorOptions: {
                                        ...nextuserPreference.editorOptions,
                                        tabSize: Number(option)
                                    }
                                })
                            }}
                        />}
                        {nextuserPreference && <DropdownInput
                            options={Object.keys(WORD_WRAP_OPTIONS)}
                            defaultOption={nextuserPreference.editorOptions.wordWrap}
                            inputId="word-wrap"
                            dropdownName="Word Wrap"
                            handleOptionChange={option => {
                                setNextuserPreference({
                                    ...nextuserPreference,
                                    editorOptions: {
                                        ...nextuserPreference.editorOptions,
                                        wordWrap: option
                                    }
                                })
                            }}
                        />}
                        {nextuserPreference && <NumberInput
                            inputId="word-wrap-column"
                            defaultValue={userPreference.editorOptions.wordWrapColumn as number}
                            min={40}
                            max={200}
                            increment={10}
                            inputName="Word Wrap Column"
                            handleInputChange={num => {
                                setNextuserPreference({
                                    ...nextuserPreference,
                                    editorOptions: {
                                        ...nextuserPreference.editorOptions,
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