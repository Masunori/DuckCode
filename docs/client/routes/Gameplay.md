# Gameplay

**Route**: [`client/src/app/(withContext)/gameplay`](../../../client/src/app/(withContext)/gameplay/page.tsx)
**Introduced**: Version 0.1.0

**Components**:
- [GameplayClient](#gameplayclienttsx)
- [GameplayNavbar](#gameplaynavbartsx)
- [QuestionDisplay](#questiondisplaytsx)
- [CodeEditor](#codeeditortsx)
- [TestCases](#testcasestsx)
- [CodeHandlerButtons](#codehandlerbuttonstsx)
- [InformationPanelButtons](#informationpanelbuttonstsx)
- [Output](#outputtsx)

**Logic**
- [Centralizing gameplay UI logic](#centralizing-gameplay-ui-logic)
- [Centralizing gameplay storage](#centralizing-gameplay-storage)

---

The gameplay UI is a generic interface where interactions with game matches happen. It is a server component where the question/information will be fetched and passed to the `GameplayClient` component.

```ts
return (
    <div className={styles.container}>
        <GameplayNavbar />
        <GameplayClient question={question} />
    </div>
)
```

The `Question` has the following type:
```ts
// gameplay/gameplayUtils.ts
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
```

#### [`GameplayClient.tsx`](../../../client/src/app/(withContext)/gameplay/GameplayClient.tsx)

This component is the client part of the gameplay UI which takes in the relevant question/information to render and enable intractivity.
Because the gameplay layout is customisable, the `GameplayClient` is again, a wrapper over the user-chosen layout.

```ts
// gameplay/layout/layoutUtils.tsx
export type LayoutInfo = {
    miniPreview: React.JSX.Element;
    implementation: React.JSX.Element;
}

export const LAYOUTS: Record<string, LayoutInfo> = {
    // ...
}

// gameplay/GameplayClient.tsx
return (
    LAYOUTS[user.userPreference.gameplayLayout].implementation
);
```

The layouts are as follows:
- **Default**:
    <div style="
        display: grid;
        grid-template-rows: 1fr 5fr 2fr;
        grid-template-columns: 2fr 3fr;
        grid-template-areas:
            'nav nav'
            'question editor'
            'question testcases';
        column-gap: 0.5rem;
        row-gap: 0.5rem;
        border: 3px solid #888;
        padding: 0.5rem;
        border-radius: 1.5rem;
    ">
        <div style="
            grid-area: nav;
            padding: 0.5rem 1rem;
            border: 1px solid #888;
            border-radius: 1rem;
        ">
            Navigation Bar
        </div>
        <div style="
            grid-area: question;
            padding: 1rem;
            border: 1px solid #888;
            border-radius: 1rem;
        ">
            Question
        </div>
        <div style="
            grid-area: editor;
            padding: 1rem;
            border: 1px solid #888;
            border-radius: 1rem;
        ">
            Code Editor
        </div>
        <div style="
            grid-area: testcases;
            padding: 1rem;
            border: 1px solid #888;
            border-radius: 1rem;
        ">
            Test Cases
        </div>
    </div>
    <br>
- **Inverted**
    <div style="
        display: grid;
        grid-template-rows: 1fr 5fr 2fr;
        grid-template-columns: 3fr 2fr;
        grid-template-areas:
            'nav nav'
            'editor question'
            'testcases question';
        column-gap: 0.5rem;
        row-gap: 0.5rem;
        border: 3px solid #888;
        padding: 0.5rem;
        border-radius: 1.5rem;
    ">
        <div style="
            grid-area: nav;
            padding: 0.5rem 1rem;
            border: 1px solid #888;
            border-radius: 1rem;
        ">
            Navigation Bar
        </div>
        <div style="
            grid-area: question;
            padding: 1rem;
            border: 1px solid #888;
            border-radius: 1rem;
        ">
            Question
        </div>
        <div style="
            grid-area: editor;
            padding: 1rem;
            border: 1px solid #888;
            border-radius: 1rem;
        ">
            Code Editor
        </div>
        <div style="
            grid-area: testcases;
            padding: 1rem;
            border: 1px solid #888;
            border-radius: 1rem;
        ">
            Test Cases
        </div>
    </div>
    <br>
- **Two Tabs**
    <div style="
        display: grid;
        grid-template-rows: 1fr 5fr 2fr;
        grid-template-columns: 1fr 1fr;
        grid-template-areas:
            'nav nav'
            'question editor'
            'question editor';
        column-gap: 0.5rem;
        row-gap: 0.5rem;
        border: 3px solid #888;
        padding: 0.5rem;
        border-radius: 1.5rem;
    ">
        <div style="
            grid-area: nav;
            padding: 0.5rem 1rem;
            border: 1px solid #888;
            border-radius: 1rem;
        ">
            Navigation Bar
        </div>
        <div style="
            grid-area: question;
            padding: 1rem;
            border: 1px solid #888;
            border-radius: 1rem;
        ">
            Question + Test Cases (Toggle)
        </div>
        <div style="
            grid-area: editor;
            padding: 1rem;
            border: 1px solid #888;
            border-radius: 1rem;
        ">
            Code Editor
        </div>
    </div>
    <br>
- **Two Tabs Inverted**
    <div style="
        display: grid;
        grid-template-rows: 1fr 5fr 2fr;
        grid-template-columns: 1fr 1fr;
        grid-template-areas:
            'nav nav'
            'editor question'
            'editor question';
        column-gap: 0.5rem;
        row-gap: 0.5rem;
        border: 3px solid #888;
        padding: 0.5rem;
        border-radius: 1.5rem;
    ">
        <div style="
            grid-area: nav;
            padding: 0.5rem 1rem;
            border: 1px solid #888;
            border-radius: 1rem;
        ">
            Navigation Bar
        </div>
        <div style="
            grid-area: question;
            padding: 1rem;
            border: 1px solid #888;
            border-radius: 1rem;
        ">
            Question + Test Cases (Toggle)
        </div>
        <div style="
            grid-area: editor;
            padding: 1rem;
            border: 1px solid #888;
            border-radius: 1rem;
        ">
            Code Editor
        </div>
    </div>
    <br>
- **Fullscreen Editor**
    <div style="
        display: grid;
        grid-template-rows: 1fr 7fr;
        grid-template-columns: 1fr 1fr;
        grid-template-areas:
            'nav nav'
            'editor editor';
        column-gap: 0.5rem;
        row-gap: 0.5rem;
        border: 3px solid #888;
        padding: 0.5rem;
        border-radius: 1.5rem;
        position: relative;
        overflow: hidden;
        font-family: sans-serif;
        background-color: #fefefe;
    ">
        <div style="
            grid-area: nav;
            padding: 0.5rem 1rem;
            border: 1px solid #888;
            border-radius: 1rem;
        ">
            Navigation Bar + Toggle Question + Toggle Test Cases
        </div>
        <div style="
            grid-area: editor;
            padding: 1rem;
            border: 1px solid #888;
            border-radius: 1rem;
        ">
            Code Editor
        </div>
        <div style="
            position: absolute;
            top: 0;
            right: 0;
            height: calc(100% - 1rem);
            width: 50%;
            background-color: rgba(127, 127, 127, 0.6); /* Light orange, semi-transparent */
            border: 1px solid #888;
            margin: 0.5rem;
            border-radius: 1rem;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: question-toggle 8s infinite normal;
            box-shadow: -4px 0 8px rgba(0,0,0,0.1);
        ">
            Question (toggle)
        </div>
        <div style="
            position: absolute;
            bottom: 0;
            left: 0;
            height: 50%;
            width: calc(100% - 1rem);
            background-color: rgba(160, 160, 160, 0.75); /* Light green, semi-transparent */
            border: 1px solid #888;
            margin: 0.5rem;
            border-radius: 1rem;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: test-cases-toggle 8s infinite normal;
            box-shadow: 0 -4px 8px rgba(0,0,0,0.1);
        ">
            Test Cases + Output (toggle)
        </div>
        <style>
            @keyframes question-toggle {
                0% { transform: translateX(100%); }
                25% { transform: translateX(0%); }
                50% { transform: translateX(100%); }
                100% { transform: translateX(100%); }
            }
            @keyframes test-cases-toggle {
                0% { transform: translateY(100%); }
                50% { transform: translateY(100%); }
                75% { transform: translateY(0%); }
                100% { transform: translateY(100%); }
            }
        </style>
    </div>

These preview are also available in the Settings UI. Here, we will talk more about the common components that appear across all layouts.

To allow certain component(s) to be resizable, we use the library React Resizable Panels.
- [`react-resizable-panels` library](https://www.npmjs.com/package/react-resizable-panels)

Most importantly, the GameplayClient will set relevant gameplay stores and state logic. Refer to them at [centralizing gameplay UI logic](#centralizing-gameplay-ui-logic) and [centralizing gameplay storage](#centralizing-gameplay-storage).


#### [`GameplayNavbar.tsx`](../../../client/src/app/(withContext)/gameplay/components/GameplayNavbar.tsx)

This component contains most controls of the game for the user, including the timer and access to settings. 

At this point, you may notice the use of custom hooks `useSettings()` and `usePopup()`. These are explained in the [Context](#context) part of the documentation.

#### [`QuestionDisplay.tsx`](../../../client/src/app/(withContext)/gameplay/components/QuestionDisplay.tsx)

This component takes in the question in the `Question` format and renders it to the user.

#### [`CodeEditor.tsx`](../../../client/src/app/(withContext)/gameplay/components/CodeEditor.tsx)

This component is the code editor the user can use. It uses Monaco Editor underneath.
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [`@monaco-editor/react` library](https://www.npmjs.com/package/@monaco-editor/react)

The editor is configured according to user preferences, extracted from the user context. You can read more about user context [here](#context).

The `editorOptions` prop of the `<Editor />` component is created from user preference, with more attributes supported in the future.

```ts
import * as monaco from 'monaco-editor';
import { useUserStore } from "@app/components/contexts/UserContext";

const user = useUserStore(state => state.user);

const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
    detectIndentation: false,
    fontSize: user.userPreference.fontSize,
    lineNumbers: LINE_NUMBERS_OPTIONS[user.userPreference.editorOptions.lineNumbers],
    minimap: {
        enabled: user.userPreference.editorOptions.enableMinimap,
    },
    renderWhitespace: RENDER_WHITESPACE_OPTIONS[user.userPreference.editorOptions.renderWhiteSpace],
    tabSize: user.userPreference.editorOptions.tabSize,
    wordWrap: WORD_WRAP_OPTIONS[user.userPreference.editorOptions.wordWrap],
    wordWrapColumn: user.userPreference.editorOptions.wordWrapColumn,
}
```

Other props such as `theme` and `language` are also controlled by user preference. Functional props such as `onMount`, `value` and `onChange` are handled by the layout components that use this code editor component.

Regarding the `onMount` prop for the `Editor` component, the respective layouts will define their own React states and invoke `instantiateEditorOnMount`, a utility function called when the editor first mounts, located at [gameplayUtils.ts](../../../client/src/app/(withContext)/gameplay/gameplayUtils.ts).

#### [`TestCases.tsx`](../../../client/src/app/(withContext)/gameplay/components/TestCases.tsx)

Different layouts will implement this differently, but generally, the test cases component will render all public test cases information to the user, and gives visual feedback when they run the public test cases.

While designs may change, the test case UI must satisfy the conditions:
- The user should be able to select any public test cases, and they can view the status of all public test cases (unattempted, failed, passed).
- If the user selects a public test case, the user should be able to see the input, expected output, actual output, and the message.

**NOTE**: As of version 0.1.0, in the default and inverted settings, the test case UI is merged with the output UI and code execution buttons. In other settings, the test case UI purely displays test cases. This will change in future iterations.

#### [`CodeHandlerButtons.tsx`](../../../client/src/app/(withContext)/gameplay/components/CodeHandlerButtons.tsx)

This component contains three buttons (or equivalent) that correspond to three different functionalities:

- **Run all Test Cases**: Run the code against all public test cases.
- **Run code**: Purely runs the code like a typical compiler/interpreter.
- **Submit**: Runs the code against both public and private test cases. The behaviour differs for different game modes.

The user should not be able to perform more than one out of the functionalities at any point in time. To achieve this, the functionalities share the same [lock](../../../client/src/app/utils/lock.ts), whose documentation can be found [here](#locking-mutually-exclusive-functionalities). 

Also, each layout will define their own React states and call the following three utility functions to achieve the abovementioned three functionalities. The utility functions are located at [gameplayUtils.ts](../../../client/src/app/(withContext)/gameplay/gameplayUtils.ts).

- Running code will invoke the `runCodeOutputModeClientSide` function.
- Running code against all public test cases will invoke the `runTestCasesClientSide` function.
- Running code against all test cases (also called submission) will invoke the `submitCodeClientSide` function.

#### [`InformationPanelButtons.tsx`](../../../client/src/app/(withContext)/gameplay/components/InformationPanelButtons.tsx)

This component is exclusive for two tabs and two tabs inverted layout. Because there are two tabs, the user will have to toggle questions, test cases and output mode within the same tab. Hence, the layout that uses the information panel buttons will define their own React states and pass them as props to this component:

```ts
// gameplayUtils.ts
export type InformationMode = "question" | "testCases" | "output" | "-";
```

#### [`Output.tsx`](../../../client/src/app/(withContext)/gameplay/layout/twoTabs/components/Output.tsx)

This is an exclusive UI component to two tabs (and inverted) and fullscreen editor layout. While designs for different layouts will vary, it renders compiler/interpreter output when the user runs code, as well as submission output when the user submits the code.

**NOTE**: As of version 0.1.0, the default and inverted layout do not use this. For the sake of consistency with other layouts, this will be changed in future iterations.

#### Centralizing gameplay UI logic 

As of version 0.2.0, all gameplay UI logic will be controlled by a Zustand UI controller hook, located [here](../../../client/src/app/(withContext)/gameplay/hooks/useGameController.ts).

```ts
// gameplay/hooks/useGameController.ts

type GameplayControllerProps = {
    activeIndex: number;
    setActiveIndex: SetState<number>;
    informationMode: InformationMode;
    setInformationMode: SetState<InformationMode>;
    lock: Lock;
    isClusterLocked: boolean;
    setIsClusterLocked: SetState<boolean>;
};
```
- `activeIndex`: the index of the public test case currently rendered in the test case panel, thus "active". The test case UI component will consume this.
- `setActiveIndex`: sets the index of the active test case. The test case UI component will consume this.
- `informationMode`: in certain layouts, different information compete for the same UI component space. Consuming components can use this to decide which information gets displayed.
  - In default and inverted layout, only `output` and `testCases` compete for the same space, do not set the information mode to `question` or `-`.
  - In two tabs and two tabs inverted layout, the `question` mode also compete for the same space with `output` and `testCases`.
  - In fullscreen editor mode, only the editor is persistent and all other information can be toggled, so `-` means that nothing is being toggled on.
- `setInformationMode`: sets the information mode. Take note of which layout uses which information mode.
- `lock`: Locks code execution functions that should not be called concurrently. Refer to [code handler buttons UI](#codehandlerbuttionstsx) for more details.
- `isClusterLocked`: When one of the functions in the code execution function cluster is executed but not returning yet, this will help consuming UI components to disable UI interactions with themselves.
- `setIsClusterLocked`: Sets the locked state of the function cluster.

The hook's name is `useGameController`, and it can be called by components that consume its data.

When GameplayClient mounts, it will set corresponding information modes.

```ts
// gameplay/GameplayClient.tsx

const layout = user.userPreference.gameplayLayout;

// set information mode based on layout
useEffect(() => {
    useGameplayController.getState().setInformationMode(
        ["Default", "Inverted"].includes(layout)
            ? "testCases"
            : ["Two Tabs", "Two Tabs Inverted"].includes(layout)
            ? "question"
            : "-"
    );
}, [layout]);
```

#### Centralizing gameplay storage

As of version 0.2.0, all gameplay data will be stored in a Zustand store hook, which can be found [here](../../../client/src/app/(withContext)/gameplay/hook/useGameplayStore.ts).

```ts
type GameplayStoreProps = {
    codeContent: string;
    setCodeContent: SetState<string>;
    testCaseResults: TestCaseResult[];
    setTestCaseResults: SetState<TestCaseResult[]>;
    codeOutput: OutputEntry[];
    setCodeOutput: SetState<OutputEntry[]>;
    question: Question;
    setQuestion: SetState<Question>;
};
```

- `codeContent`: User's code in the code editor.
- `setCodeContent`: Sets user's code content.
- `testCaseResults`: The results after the user runs their code against test cases.
- `setTestCaseResults`: Sets the test case results.
- `codeOutput`: The results after the user runs code normally, and will be rendered in the terminal-like UI component.
- `setCodeOutput`: Sets the code output.
- `question`: The problem to solve in the current gameplay session.
- `setQuestion`: Sets the question. Only the GameplayClient component should use this exactly once, and the question will be persistent.

When GameplayClient mounts, it will set the relevant stores.

```ts
// gameplay/GameplayClient.tsx

useEffect(() => {
    useGameplayStore.getState().setQuestion(question);
}, [question]);
```