"use client";

import { UserPreference } from "@/app/userPrefs/userPrefsTypes";
import { PRESET_THEMES } from "@/components/themes/themes";
import * as monaco from 'monaco-editor';
import { RefObject } from "react";

export type TestCase = {
    tid: number;
    input: string;
    expectedOutput: string;
}

export type Example = {
    input: string[];
    output: string[];
    explanation: string;
}

export type Question = {
    qid: number;
    title: string;
    difficulty: number;
    description: string[];
    input: string[]; // description of the input
    output: string[]; // description of the output
    examples: Example[];
    constraints: string[];
    publicTestCases: TestCase[];
}

export const placeholderQuestion: Question = {
    qid: -1,
    title: "Placeholder Question",
    difficulty: -1,
    description: ["Loading..."],
    input: ["Loading..."],
    output: ["Loading..."],
    examples: [
        {
            input: ["Loading..."],
            output: ["Loading..."],
            explanation: "Loading..."
        }
    ],
    constraints: ["Loading..."],
    publicTestCases: [
        {
            tid: -1,
            input: "Loading 1...",
            expectedOutput: "Loading...",
        },
        {
            tid: -2,
            input: "Loading 2...",
            expectedOutput: "Loading...",
        }
    ]
}

export const dummyQuestion: Question = {
    qid: 10000000, // int
    title: 'Two Sum', // string
    difficulty: 1000, // int
    description: [
        "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n",
        "You may assume that each input would have exactly one solution, and you may not use the same element twice.\n",
        "Arrange the values in your answer in INCREASING order."
    ], // string array
    input: [
        'Line 1 contains 1 integer, specifying the size n of the nums array.',
        'Line 2 contains n integers, specifying the elements of the array.',
        'Line 3 contains 1 integer, specifying the target.'
    ], // string array
    output: [
        'One line containing two integers, specifying the indices of the pair of numbers whose sum equals the target.',
        'Return the two integers in increasing order.'
    ], // string array
    examples: [ // JSON object array
        {
            input: [
                '4',
                '1 3 4 6',
                '9',
            ], // string array
            output: [
                '1 3',
            ], // string array
            explanation: 'Because nums[1] + nums[3] == 7, we print 1 and 3.' // string
        }
    ],
    constraints: [
        '2 <= nums.length <= 10^4',
        '-10^9 <= nums[i] <= 10^9',
        '-10^9 <= target <= 10^9',
        'Only one valid answer exists'
    ], // string array
    publicTestCases: [ // JSON object array
        {
            tid: 12345678,
            input: '4\n2 7 11 15\n9', // string 
            expectedOutput: '0 1', // string 
        },
        {
            tid: 12345679,
            input: '3\n3 2 4\n6',
            expectedOutput: '1 2', // string array
        },
        {
            tid: 12345680,
            input: '2\n3 3\n6',
            expectedOutput: '0 1',
        },
        {
            tid: 12345681,
            input: '4\n1 7 2 9\n16', // string array
            expectedOutput: '1 3',
        },
        {
            tid: 12345682,
            input: '6\n1 2 7 8 12 13\n10', // string array
            expectedOutput: '1 3',
        },
        {
            tid: 12345688,
            input: '4\n2 7 11 15\n9', // string 
            expectedOutput: '0 1', // string 
        },
        {
            tid: 12345689,
            input: '3\n3 2 4\n6',
            expectedOutput: '1 2', // string array
        },
        {
            tid: 12345690,
            input: '2\n3 3\n6',
            expectedOutput: '0 1',
        },
        {
            tid: 12345691,
            input: '4\n1 7 2 9\n16', // string array
            expectedOutput: '1 3',
        },
        {
            tid: 12345692,
            input: '6\n1 2 7 8 12 13\n10', // string array
            expectedOutput: '1 3',
        }
    ]
}

export type TestCaseResult = {
    tid: number,
    actualOutput: string;
    statusId: number;
    message: string;
}

export type CodeSubmissionResponse = {
    correct: number;
    total: number;
    statusId: number;
}

export type InformationMode = "question" | "testCases" | "output" | "-";

/**
 * A utility function to help instantiate Monaco Editor when the editor mounts.
 * When passing a function to the Editor's `onMount` attribute, the function looks something like this:
 * 
 * ```typescript
 * import * as monaco from 'monaco-editor';
 * import { Editor } from '@monaco-editor/react;;
 * 
 * const user = useUserStore(state => state.user); // call the user context
 * const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
 * 
 * function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) {
 *      handleEditorDidMount(editorRef, editor, MonacoInstance, user);
 * }
 * 
 * return {
 *     <Editor
 *         onMount={handleEditorDidMount}
 *     />
 * }
 * ```
 * 
 * @param editorRef The React reference to the editor, initialised using `useRef`
 * @param editor The `onMount` attribute is a function that exposes the `editor` instance, pass this to editorRef.current for future use
 * @param monacoInstance The `onMount` attribute is a function that exposes the `monaco` instance, use this to manipulate monaco settings
 * @param user Stores the preference to pass into the editor
 */
export function instantiateEditorOnMount(
    editorRef: RefObject<monaco.editor.IStandaloneCodeEditor | null>,
    editor: monaco.editor.IStandaloneCodeEditor,
    monacoInstance: typeof monaco,
    userPreference: UserPreference
) {
    editorRef.current = editor;

    monacoInstance.editor.defineTheme(
        PRESET_THEMES[userPreference.editorOptions.theme].monacoEditorAlias,
        PRESET_THEMES[userPreference.editorOptions.theme].theme
    );

    // the "Escape" key will defocus from the code editor
    editor.onKeyDown((e: monaco.IKeyboardEvent) => {
        if (e.keyCode === monacoInstance.KeyCode.Escape) {
            const domNode = editor.getDomNode();
            if (domNode && domNode.contains(document.activeElement)) {
                (document.activeElement as HTMLElement).blur();
            }
        }
    });
}