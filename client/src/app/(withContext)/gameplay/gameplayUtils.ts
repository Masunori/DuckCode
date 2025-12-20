"use client";

import { RefObject } from "react";
import * as monaco from 'monaco-editor';
import { PRESET_THEMES } from "@/app/components/themes/themes";
import { User } from "@/app/userPrefs/userPrefsUtils";
import { Lock, LockUnavailableError } from "@/app/utils/lock";
import { runAllTestCases, runCode, submitCode } from "@/lib/apiClient/gameplay";
import { OutputEntry, RUN_CODE_RESPONSES, RunCodeStatuses } from "@/app/api/gameplay/RunCodeStatuses";

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
    title: "",
    difficulty: -1,
    description: [],
    input: [],
    output: [],
    examples: [
        {
            input: [],
            output: [],
            explanation: ""
        }
    ],
    constraints: [],
    publicTestCases: [
        {
            tid: -1,
            input: "",
            expectedOutput: "",
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
    user: User
) {
    editorRef.current = editor;

    monacoInstance.editor.defineTheme(
        PRESET_THEMES[user.userPreference.editorOptions.theme].monacoEditorAlias,
        PRESET_THEMES[user.userPreference.editorOptions.theme].theme
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

/*
    ABOUT THE LOCK MECHANISM

    In multiplayer or arcade, there are 3 functionalities that make a call to the same compiler API:
    - Run code in output mode (just run the code and get whatever printed)
    - Run code in test cases mode (run the code against a bunch of public test cases)
    - Submit code (run the code against both public and private test cases)

    These functionalities will share a lock. A lock is a mechanism that, when one of the functionalities are running, 
    it will block the other functionalities (even another call to this same functionality) from running, until this run ends.
    Read more about the `Lock` class at `src/app/utils/lock.tsx`.

    This mechanism prevents spamming calls on te client side by spamming buttons.
*/

/**
 * Runs the user code and handles the necessary UI display.
 * 
 * @param codeContent The user's code
 * @param programmingLanguage The user's chosen programming language for the code
 * @param lock Refer to line 192 of this file for the lock
 * @param setIsClusterLocked Set the React state of the cluster's locked status
 * @param setCodeOutput Set the output returned by the compiler API
 * @param openPopupWith This function cannot access the popup context, so it relies on the caller which is a React component within the popup context provider
 * @param setInformationMode in some layouts, the user toggles between `"question"`, `"output"` and `"testCases"` modes, pass the set function here. If there is no multiple information modes, you can ignore this
 */
export async function runCodeOutputModeClientSide(
    codeContent: string,
    programmingLanguage: string,
    lock: Lock,
    setIsClusterLocked: (bool: boolean) => void,
    setCodeOutput: (output: OutputEntry[]) => void,
    openPopupWith: (popupMessage: string, confirmMessage: string, cancelMessage: string | null, confirm: () => void, cancelFn: () => void) => void,
    setInformationMode?: (mode: InformationMode) => void,
) {
    try {
        setIsClusterLocked(true);
        const response = await lock.call(() => runCode(0, codeContent, programmingLanguage));
        
        if (setInformationMode) {
            setInformationMode("output");
        }

        if (response.status != 200 || !response.output) {
            throw new Error(`An error occurred. Error code: ${response.status}. Message: ${response.message}`);
        }

        setCodeOutput(response.output);
    } catch (err) {
        if (err instanceof LockUnavailableError) {
            openPopupWith(
                "Please wait for the code to run before attempting running the code again, running test cases, or submitting the code.",
                "Understood",
                null,
                () => {},
                () => {}
            );
        } else {
            openPopupWith(
                (err as Error).message,
                "Understood",
                null,
                () => {},
                () => {}
            );
        }
    } finally {
        setIsClusterLocked(false);
    }
}

/**
 * Run the user's code against a list of public test cases for a question and handles the necessary UI display.
 * 
 * @param codeContent The user's code
 * @param programmingLanguage The user's chosen programming language for the code
 * @param question The question in which the user is submitting code for
 * @param lock Refer to line 192 of this file for the lock
 * @param setIsClusterLocked Set the React state of the cluster's locked status
 * @param setCodeOutput Set the output returned by the compiler API
 * @param setTestCaseResults Set the test case results array with the API call's response
 * @param setActiveIndex Set the index for the test case that is displayed in the test case panel
 * @param openPopupWith This function cannot access the popup context, so it relies on the caller which is a React component within the popup context provider
 * @param setInformationMode in some layouts, the user toggles between `"question"`, `"output"` and `"testCases"` modes, pass the set function here. If there is no multiple information modes, you can ignore this
 */
export async function runTestCasesClientSide(
    codeContent: string,
    programmingLanguage: string,
    question: Question,
    lock: Lock,
    setIsClusterLocked: (bool: boolean) => void,
    setCodeOutput: (output: OutputEntry[]) => void,
    setTestCaseResults: (results: TestCaseResult[]) => void,
    setActiveIndex: (index: number) => void,
    openPopupWith: (popupMessage: string, confirmMessage: string, cancelMessage: string | null, confirm: () => void, cancelFn: () => void) => void,
    setInformationMode?: (mode: InformationMode) => void,
) {
    try {
        setIsClusterLocked(true);
        const response = await lock.call(() => runAllTestCases(question.qid, codeContent, programmingLanguage));

        if (setInformationMode) {
            setInformationMode("testCases");
        }
        setTestCaseResults(response.results);

        for (let i = 0; i < response.results.length; i++) {
            if (RUN_CODE_RESPONSES[response.results[i].statusId] !== RunCodeStatuses.ACCEPTED) {
                openPopupWith(
                    `Test case ${i + 1} failed. Reason: ${response.results[i].message}`,
                    "Understood",
                    null,
                    () => {},
                    () => {}
                );

                setActiveIndex(i);
                return;
            }
        }
        
        openPopupWith(
            `All public test cases passed!`,
            "Submit Code",
            "Go back to code",
            () => submitCodeClientSide(
                codeContent,
                programmingLanguage,
                question,
                lock,
                setIsClusterLocked,
                setCodeOutput,
                openPopupWith,
                setInformationMode
            ),
            () => {}
        );
    } catch {
        openPopupWith(
            "Please wait for the code to run before attempting running the code, running test cases again, or submitting the code.",
            "Understood",
            null,
            () => {},
            () => {}
        )
    } finally {
        setIsClusterLocked(false);
    }
}

/**
 * Submits the user code for a question and handles the necessary UI display.
 * 
 * @param codeContent The user's code
 * @param programmingLanguage The user's chosen programming language for the code
 * @param question The question in which the user is submitting code for
 * @param lock Refer to line 192 of this file for the lock
 * @param setIsClusterLocked Set the React state of the cluster's locked status
 * @param setCodeOutput Set the output returned by the compiler API
 * @param openPopupWith This function cannot access the popup context, so it relies on the caller which is a React component within the popup context provider
 * @param setInformationMode in some layouts, the user toggles between `"question"`, `"output"` and `"testCases"` modes, pass the set function here. If there is no multiple information modes, you can ignore this
 */
export async function submitCodeClientSide(
    codeContent: string,
    programmingLanguage: string,
    question: Question,
    lock: Lock,
    setIsClusterLocked: (bool: boolean) => void,
    setCodeOutput: (output: OutputEntry[]) => void,
    openPopupWith: (popupMessage: string, confirmMessage: string, cancelMessage: string | null, confirm: () => void, cancelFn: () => void) => void,
    setInformationMode?: (mode: InformationMode) => void,
) {
    try {
        setIsClusterLocked(true);
        const response = await lock.call(() => submitCode(question.qid, codeContent, programmingLanguage));

        if (setInformationMode) {
            setInformationMode("output");
        }
        setCodeOutput([
            { type: "log", content: `Correct: ${response.result.correct}` },
            { type: "log", content: `Total: ${response.result.total}` },
            { type: response.result.statusId === 1 ? "log" : "error", content: `Status: ${RUN_CODE_RESPONSES[response.result.statusId]}` },
        ]);
    } catch (err) {
        if (err instanceof LockUnavailableError) {
            openPopupWith(
                "Please wait for the code to run before attempting running the code, running test cases, or submitting the code again.",
                "Understood",
                null,
                () => {},
                () => {}
            );
        } else {
            openPopupWith(
                (err as Error).message,
                "Understood",
                null,
                () => {},
                () => {}
            );
        }
    } finally {
        setIsClusterLocked(false);
    }
}