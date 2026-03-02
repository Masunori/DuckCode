# Arcade

**Route**: [`client/src/app/(withContext)/arcade`](../../../client/src/app/(withContext)/arcade/page.tsx)
**Introduced**: Version 0.1.0
**Last modified**: Version 0.1.0

**Layouts**
- [Default](#default)
- [Inverted](#inverted)
- [Two Tabs](#two-tabs)
- [Two Tabs Inverted](#two-tabs-inverted)
- [Full Screen Editor](#full-screen-editor)

**Components**
- [Code Editor](#code-editor)
- [Code Handler Buttons](#code-handler-buttons)
- [Gameplay Navbar](#gameplay-navbar)
- [Information Panel Buttons](#information-panel-buttons)
- [Question Tab](#question-tab)
    - [Question Display](#question-display)
    - [Question Switcher](#question-switcher)
- [Test Cases](#test-cases)

**Logic**
- [Base Gaemplay Store](#usebasegameplaystore)
---

The arcade UI is an interface used for single-player matches. Note that all components of the arcade UI are taken from the [gameplay components](../../../client/src/components/gameplay/components/).

On load, the arcade UI route takes in a search parameter, which is the question ID.

```ts
// page.tsx
export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ qid: string }>;
}) {
    const { qid } = await searchParams;
    // ...
}
```

Then, the flow is as follows:
- The `page.tsx` file is a server-side component and will directly fetch data from the endpoint `question/get_questions_by_id` ([here](../../../client/src/app/api/question/get_question_by_id/route.ts)), using the wrapper `getQuestionById` ([here](../../../client/src/lib/apiServer/gameplay.ts)).
- The endpoint only returns 200 or 401 under normal server conditions. If HTTP status 401 is received, the user will be redirected to `/portal` route. Other response statuses other than 200 will simply be thrown and rendered with `error.tsx`. 
- Otherwise, the response (a question of type `Question`), alongside `initialTime` (the time allowed to solve the question), forms the initial server data object. The question is passed onto an `ArcadeClient` component and the time is passed onto a `GameplayNavbar` as props.
- The `ArcadeClient` is a client component and will initialise the data using `useBaseGameplayStore` hook ([read below](#usebasegameplaystore)). Then, based on user preference, it will choose one of the [layouts](../../../client/src/components/gameplay/layout/).

-----
## Layouts
This part describes the specifications for different layouts, which should be followed regardless of the design.

> **ON THE "CODE EXECUTION" KEYWORD**
> 
> When the document mentions "**code execution**" in the context of a component, it refers to all of the 
> - **code handler buttons** (run test cases, run code, submit), 
> - the **test case panel** (to display test case results) and 
> - the **code output** (to display the system output when the code is run normally, without any test cases).

> **ON THE "INVERTED" KEYWORD**
> 
> It might be implicitly (or better, explicitly) assumed that otherwise being said, a layout without the "inverted" keyword in its name should put the code editor on the right, whenever possible. Then, the "inverted" keyword will indicate the code editor being located on the left.

### Default
This layout consists of two parts, a question displayer component on the left, and a code component (editor + execution) on the right. The question displayer, code editor and code execution must always appear on the screen simultaneously. 

There is no specifications on where the code handler buttons should be located, but it must be visible.

### Inverted
This layout is the same as Default, but the position of the question displayer and code components are swapped. 

### Two Tabs
This layout is more code-editor-centric, where there are two tabs: the code editor on the right and the information component on the left (question and code execution). Similar to the Default layout, the code handler buttons must be visible. 

There are no specifications on how the information should be arranged. However, if there is insufficient screen space and multiple information must compete for screen space (question, test case results, code output, etc.), a set of buttons to toggle between what information to show must also be visible. 

### Two Tabs Inverted
This layout is the same as Two Tabs, but the code editor is located on the left, and the information component is on the right.

### Full Screen Editor
This layout is the most code-editor-centric, with the code editor spanning the entire screen space, and all other information "islands" can be toggled. It's more ideal to add code execution buttons and information toggling buttons, but it is expected that the user is familiar with the key bindings. 

There are no specifications on where the information "island" should be at.

-----
## Components

### Code Editor
**Source code**:
- Default, Inverted, Two Tabs, Two Tabs Inverted: [here](../../../client/src/components/gameplay/components/CodeEditor.tsx)
- Full Screen: [here](../../../client/src/components/gameplay/components/FullScreenCodeEditor.tsx)

The Code Editor component is where the user types code. It uses the Monaco Editor library underneath. It takes in an `onMount` as the single prop, because the `<Editor />` component of Monaco Editor also has an `onMount` prop which exposes the `editor` and `monaco` instances, and the implementing layout can use `onMount` to store the `editor` and `monaco` instances in a reference object (`useRef`).

The utility files for gameplay also defines an `instantiateEditorOnMount` method, where layouts can simply call them to handle editor instantiation. 

```ts
// <the layout file>.tsx
const userPreference = useUserPreferenceStore(state => state.userPreference);
const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    

const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) => {
    instantiateEditorOnMount(
        editorRef, 
        editor, 
        monacoInstance, 
        userPreference
    );
}
```

The utility function will:
- Assign the `editor` to `editorRef.current`.
- Register custom code editor themes onto the `monacoInstance`, so that the `editor` can use them. For example, we define 4 different themes (4 pairs of names (`string`) and theme specifications (`IStandaloneThemeData`)). We need to register these to the `monacoInstance`.
- Bind the "defocus from editor" action to the `editor` using Monaco Editor's custom keyboard event handler. This keyboard event management is separated from the layout keyboard management because they are two separate systems.

### Code Handler Buttons
**Source code**:
- Default, Inverted, Full Screen Editor: **none**
- Two Tabs, Two Tabs Inverted: [here](../../../client/src/components/gameplay/components/CodeHandlerButtons.tsx)

The code handler buttons is a cluster of buttons that deal with running code, running code against test cases and submitting code. It takes in three props: `onRunCode`, `onRunTestCases` and `onSubmitCode`. 

This component does not use the code execution actions from the base gameplay store directly because the implementing layout (controlling the gameplay) has to wrap over these functions with `usePopup` to show relevant alerts when any execution finishes. 

Code handler buttons also uses `isLocked` from the base gameplay store to disable themselves when any code execution is in progress.

Default and Inverted layouts have their internal implementation of the code handler buttons (because of functionality overloading), but they can use this component when layout changes.

### Gameplay Navbar
**Source code**: [here](../../../client/src/components/gameplay/components/GameplayNavbar.tsx)

The gameplay navigation bar provides universal, layout-independent controls, such as countdown timer, settings, quick programming language change and exiting.

### Information Panel Buttons
**Source code**:
- Default, Inverted, Full Screen Editor: **none**
- Two Tabs, Two Tabs Inverted: [here](../../../client/src/components/gameplay/components/InformationPanelButtons.tsx)

The information panel buttons is another cluster of buttons that allow switching between different information modes. It uses `setInformationMode` from the base gameplay store to switch between questions, test case results, and outputs.

### Question Tab
**Source code**: 
- Default, Inverted, Two Tabs, Two Tabs Inverted: [here](../../../client/src/components/gameplay/components/QuestionTab.tsx)
- Full Screen Editor: **none**

The question tab is a simple wrapper over the question display and the question switcher below.

### Question Display
**Source code**:
- Default, Inverted, Two Tabs, Two Tabs Inverted: [here](../../../client/src/components/gameplay/components/QuestionDisplay.tsx)
- Full Screen Editor: [here](../../../client/src/components/gameplay/components/FullScreenQuestionDisplay.tsx)

The question display shows the question. It is a server-side component, and so takes in a `question` prop to directly render the UI based on this question.

### Question Switcher
**Source code**: [here](../../../client/src/components/gameplay/components/QuestionSwitcher.tsx)

The question switcher allows the user to switch between different questions, using the `setActiveQuestionIndex` from the base gameplay store. The `activeQuestionIndex` would dictate what question is shown, and the code content corresponding to the said question.

On the full screen editor layout, this is located on top of the full screen code editor, allowing the user to know which question they are working on.

### Output
**Source code**:
- Default, Inverted: [bundled within Test Cases](../../../client/src/components/gameplay/components/DefaultTestCases.tsx)
- Two Tabs, Two Tabs Inverted: [here](../../../client/src/components/gameplay/components/TwoTabsOutput.tsx)
- Full Screen Editor: [here](../../../client/src/components/gameplay/components/FullScreenOutput.tsx)

The output component shows the results from running the code in the editor normally, not against any test cases. The `OutputEntry` type allows different types of outputs (logs or error) to be rendered in different colours.

```ts
// @src/lib/apiClient/runCodeStatuses.ts
export type OutputType = "log" | "error" | "warn";

export type OutputEntry = {
    type: OutputType;
    content: string;
};
```

### Test Cases
**Source code**:
- Default, Inverted: [bundled within Test Cases](../../../client/src/components/gameplay/components/DefaultTestCases.tsx)
- Two Tabs, Two Tabs Inverted: [here](../../../client/src/components/gameplay/components/TwoTabsTestCases.tsx)
- Full Screen Editor: [here](../../../client/src/components/gameplay/components/FullScreenTestCases.tsx)

The test cases component shows the results from running the code against test cases. It contains a test case selector, and a display area that shows the test case information and results.

-----

## Logic

### [`useBaseGameplayStore`](../../../client/src/lib/gameplay/hooks/useBaseGameplayStore.ts)

This is a centralised Zustand store that is the single source of truth for all single-player gameplay logic. It provides a set of data (states) for rendering, and defines a set of actions that is sufficiently expressive to deal with all aspects of single-player gameplay logic.

The states and actions are logically split into different slices:

1. The `ProblemSlice` allows **reading and writing to initial data**, including the list of questions (with details) and time limit.
```ts
type ProblemSlice = {
    questions: Question[];
    setQuestions: SetState<Question[]>;

    timeLimit: number;
    setTimeLimit: SetState<number>;
}
```

2. The `EditorSlice` is responsible for the user's **code content** on the editor component.
```ts
type EditorSlice = {
    codeContent: string[];
    setCodeContent: SetState<string[]>;
    setCodeContentAtIndex: (index: number, content: string) => void;

    // for websocket broadcasting
    emitCodePatch: (questionId: string, newContent: string) => void;
}
```

3. The `ExecutionSlice` is responsible for **actions on the user's code** (executing them) and the **results of such execution** (code output and test case results).

The `LockV2` mechanism follows an observer architecture, where `isLocked` will subscribe to the lock status and will count as a state change whenever the lock status changes. This value is then used to disable the UI for buttons/clickables related to code execution when an execution is in progress (acquired the lock, waiting to release after execution done).

At the same time, code execution functions pass the appropriate Zustand states from here and other relevant stores as props to endpoints in the `/execute` group:
- `runCode` invokes `/execute/execute-code` via the wrapper `runCode`.
- `runTestCases` invokes `/execute/run-all-test-cases` via the wrapper `runAllTestCases`.
- `submitCode` invokes `/execute/submit-code` via the wrapper `submtCode`.

All wrappers are from [here](../../../../client/src/lib/apiClient/gameplay.ts).

```ts
type ExecutionSlice = {
    // ensures the user cannot execute code when another execution is in progress
    lock: LockV2;
    isLocked: boolean;

    // three types of code execution procedure
    runCode: () => Promise<{ status: number, message: string } | undefined>;
    runTestCases: () => Promise<{ status: number, message: string } | undefined>;
    submitCode: () => Promise<{ status: number, message: string } | undefined>;

    // line-by-line code output
    codeOutput: OutputEntry[];
    setCodeOutput: SetState<OutputEntry[]>;

    // testCaseResults[i][j] is the j-th test case of the i-th question
    testCaseResults: TestCaseResult[][];
    setTestCaseResults: SetState<TestCaseResult[][]>;
    setTestCaseResultsAtIndex: (index: number, results: TestCaseResult[]) => void;

    // used in multiplayer where teammates know what the player is doing
    executionStatus: ExecutionStatus;
    setExecutionStatus: SetState<ExecutionStatus>;
}
```

4. The `UIStateSlice` is responsible for **what data the user sees**. Because this might sound vague, know that this slice includes the 

- **active question index** (the index of the question displayed on the screen when there are more than 1 questions), 
- **active test case index** (the index of the test case whose information is currently being shown to the user when there are more than 1 test case)
- **information mode** is when multiple information (question, test case info, code output) compete for the same screen area, and only one should be viewed at a time
- **active code view** is used to extend to multiplayer when the user needs to view other people's codes, and can be ignored for the arcade mode
```ts
type CodeView = 
    | { kind: "shared" }
    | { kind: "private", userId: string };

type UIStateSlice = {
    activeQuestionIndex: number;
    setActiveQuestionIndex: SetState<number>;

    activeTestCaseIndex: number;
    setActiveTestCaseIndex: SetState<number>;

    informationMode: InformationMode;
    setInformationMode: SetState<InformationMode>;

    activeCodeView: CodeView;
    setActiveCodeView: SetState<CodeView>;
}
```

5. The `ResetSlice` that provides a single utility for **resetting the entire store** should a player starts a new match.
```ts
type ResetSlice = {
    reset: () => void;
}
```

> To improve user experience, the `codeContent` and `activeQuestionIndex` are stored **persistently** in the local storage (also through Zustand handling), so that on website reload, the user can resume coding for the question he or she has just worked on.