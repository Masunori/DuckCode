import { Editor } from '@monaco-editor/react';
import { useContext } from 'react';
import { SettingsContext } from '../../../App';



export default function CodeEditor({ value, handleEditorDidMount, handleEditorChange }) {
    const {settings} = useContext(SettingsContext);

    // console.log(settings.current.progLang.monaco_editor_alias);

    return (
        <div id='code-editor' className='code'>
            <Editor
                language={settings.current.progLang.monaco_editor_alias}
                value={settings.current.progLang.code_snippet}
                theme='vs-dark'
                onMount={handleEditorDidMount}
                onChange={handleEditorChange}
            />
        </div>
    )
}