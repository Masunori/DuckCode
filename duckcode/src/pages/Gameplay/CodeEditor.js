import { Editor } from '@monaco-editor/react';
// import * as monaco from 'monaco-editor';
// import { useEffect, useRef } from 'react';

// export default function CodeEditor() {
//     const editorContainerRef = useRef(null);
//     const editorRef = useRef(null);

//     useEffect(() => {
//         if (editorContainerRef.current) {
//             editorRef.current = monaco.editor.create(editorContainerRef.current, {
//                 value: "// some comment",
//                 language: "javascript",
//                 automaticLayout: false,
//             });
//         }

//         return () => {
//             if (editorRef.current) {
//                 editorRef.current.dispose();
//             }
//         };
//     }, []);

//     return (
//         <div id="code-editor" ref={editorContainerRef}>
            
//         </div>
//     )
// }

export default function CodeEditor() {
    return (
        <div id='code-editor' className='code'>
            <Editor 
                defaultLanguage='javascript'
                defaultValue='// some comment'
                theme='vs-dark'
            />
        </div>
    )
}