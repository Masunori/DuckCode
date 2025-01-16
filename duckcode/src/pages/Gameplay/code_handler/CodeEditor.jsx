import { Editor } from '@monaco-editor/react';
import { useContext } from 'react';
import { SettingsContext } from '../../../App';



export default function CodeEditor({ value, handleEditorDidMount, handleEditorChange }) {
    const {settings} = useContext(SettingsContext);

    return (
        <div id='code-editor' className='code'>
            <Editor
                language={settings.progLang.monaco_editor_alias}
                value={value}
                theme='vs-dark'
                onMount={handleEditorDidMount}
                onChange={handleEditorChange}
            />
        </div>
    )
}