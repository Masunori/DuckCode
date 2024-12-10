import { Editor } from '@monaco-editor/react';
import { useRef, useState } from 'react';

export default function CodeEditor() {
    const editorRef = useRef(null);
    const monacoRef = useRef(null);

    const [value, setValue] = useState('// some comment');

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
        monacoRef.current = monaco;

        monaco.editor.defineTheme('duckcode-theme', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '008000', fontStyle: 'italic' },
                { token: 'keyword', foreground: 'ff4500' },
                { token: 'string', foreground: 'c71585' },
            ],
            colors: {
                'editor.background': '#282c34',
                'editor.foreground': '#dcdcdc',
                'editor.selectionBackground': '#b3d7ff',
            }
        });

        monaco.editor.setTheme('duckcode-theme');
    }

    function showValue() {
        alert(editorRef.current.getValue());
    }

    function handleEditorChange(value, event) {
        setValue(value);
    }

    return (
        <div id='code-editor' className='code'>
            {/* <button onClick={showValue}>Show value</button> */}
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