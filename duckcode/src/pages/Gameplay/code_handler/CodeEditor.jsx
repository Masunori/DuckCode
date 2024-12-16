import { Editor } from '@monaco-editor/react';

export default function CodeEditor({ value, handleEditorDidMount, handleEditorChange }) {
    return (
        <div id='code-editor' className='code'>
            <Editor 
                defaultLanguage='javascript'
                defaultValue={value}
                theme='vs-dark'
                onMount={handleEditorDidMount}
                onChange={handleEditorChange}
            />
        </div>
    )
}