# Multiplayer

**Route**: [`client/src/app/(withContext)/multiplayer`](../../../client/src/app/(withContext)/multiplayer/page.tsx)
**Introduced**: Version 0.2.0

**New/Changed components**:
- (Changed) [CodeEditor](#codeeditortsx)
- (Changed) [TestCases](#testcasestsx)
- (Changed) [CodeHandlerButtons](#codehandlerbuttonstsx)
- (New) [Chatbox](#chatboxtsx)
- (New) [StrategyBoard](#strategyboardtsx)
- (Changed) [MultiplayerNavbar](#multiplayernavbartsx)

**Logic**:
- [Handling the Chatbox Logic](#handling-the-chatbox-logic)
- [Handling Code Editor Content for Multiple Users](#handling-code-editor-content-for-multiple-users)
- [Handling Test Case Results and Code Output](#handling-test-case-results-and-code-output)
- [Handling the Strategy Board](#handling-the-strategy-board)
---

The multiplayer component inherits the gameplay UI, with certain changes to factor in the multiplayer aspect. This section will only mention the deviations from the gameplay UI component.

#### [`CodeEditor.tsx`](../../../client/src/app/(withContext)/multiplayer/components/CodeEditor.tsx)
In multiplayer, players can look at the team's code and other players' code. At the same time, each user must know the execution status of others. Thus, the code editor UI not only renders the code editor part, but also a way for users to select which code editor tab they want to view.

```ts
// multiplayer/components/CodeEditor.tsx

// ...
return (
    // ...
    <ul className={styles.codeEditorTabs}> // an unordered list of all players' names
        {Object.keys(codeByUser).map((user, index) => (
            <li 
                key={index} 
                onClick={() => { setActiveTab(user); }} // clicking on a tab will display the code content of that tab
                className={ activeTab === user ? styles.selected : "" }
                style={{ color: EXECUTION_STATUS_INFORMATION[executionStatusByUser[user]].color }}
            >
                <div>{user}</div>
                <span 
                    title={EXECUTION_STATUS_INFORMATION[executionStatusByUser[user]].desc}
                >
                    {EXECUTION_STATUS_INFORMATION[executionStatusByUser[user]].abbr} // the execution status of each tab
                </span>
            </li>
        ))}
    </ul>
    // ...
)
//...
```

Also, in multiplayer,
- Any player can read and write onto the shared code editor tab.
- Each player has a personal code editor tab, which they have read and write access to. However, they can only read from others' code editor tab.

The code editor UI will disable the code editor for tabs that the user has no write access.

#### [`TestCases.tsx`](../../../client/src/app/(withContext)/multiplayer/components/TestCases.tsx)
While different layouts may implement this differently, the same principle is that the test case results and code output should always match the code editor tab displayed. This is the only difference from the gameplay UI's implementation of test cases UI.

#### [`CodeHandlerButtons.tsx`](../../../client/src/app/(withContext)/gameplay/components/CodeHandlerButtons.tsx)
In multiplayer, 
- Anyone can run the code normally, run the code against test cases and submit the code in the team's shared tab.
- A player can run the code normally and run the code against test cases for their own tab.
- A player cannot execute code from another player's tab.
- In the shared team tab, one person executing code will block all users from executing the team code until the current execution finishes.
- Code execution in different tabs do not affect each other.

The code handler buttons UI component will disable relevant buttons when corresponding code editor tabs are displayed.

#### [`Chatbox.tsx`](../../../client/src/app/(withContext)/multiplayer/components/Chatbox.tsx)
To facilitate communication, the chatbox UI allows players to communicate with each other in real time using text.

#### [`StrategyBoard.tsx`](../../../client/src/app/(withContext)/multiplayer/components/StrategyBoard.tsx)
For visual communication, the strategy board UI provides a resizable and draggable canvas with basic drawing tools where players can use to communicate more abstract concepts.

The resizable and draggable feature is enabled using the React Rnd package
- [`react-rnd` library](https://www.npmjs.com/package/react-rnd)

The canvas uses the Excalidraw library underneath. We may change to a custom canvas in the future.
- [Excalidraw](https://docs.excalidraw.com/)
- [`@excalidraw/excalidraw` library](https://www.npmjs.com/package/@excalidraw/excalidraw)

#### [`MultiplayerNavbar.tsx`](../../../client/src/app/(withContext)/multiplayer/components/MultiplayerNavbar.tsx)
The multiplayer navbar display extra information, such as buttons to access communication tools, team information and match progress information.

#### Handling the chatbox logic
The chatbox is controlled using a Zustand UI controller hook ([here](../../../client/src/app/(withContext)/multiplayer/hooks/useChatController.ts)).

```ts
// multiplayer/hooks/useChatController.ts

type ChatControllerProps = {
    isChatboxOpen: boolean;
    setIsChatboxOpen: (bool: boolean | ((prev: boolean) => boolean)) => void;
    message: string;
    setMessage: (message: string) => void;
    sendMessage: () => void;
}
```
- `isChatboxOpen`: Whether the chatbox UI is open.
- `setIsChatboxOpen`: Sets the open state of the chatbox UI.
- `message`: The content currently in the user's input field.
- `setMessage`: Sets the message.
- `sendMessage`: Sends the message in the user's input field to the message dialogue.

All message data is stored using a Zustand store hook ([here](../../../client/src/app/(withContext)/multiplayer/stores/chatStore.tsx)).

```ts
// multiplayer/stores/chatStore.ts

type ChatState = {
    messages: ChatboxMessage[];
    addMessage: (message: ChatboxMessage) => void;
}
```
- `messages`: The list of messages from all users, which is used to render the chat dialogue UI.
- `addMessage`: Adds a new message to the list of messages.

#### Handling code editor content for multiple users
Code editor content of multiple users are stored using a Zustand store hook, which can be found [here](../../../client/src/app/(withContext)/multiplayer/stores/codeEditorStores.ts).

```ts
// multiplayer/stores/codeEditorStores.ts
type CodeByUser = {
    [userId: string]: string;
}

type CodeEditorState = {
    codeByUser: CodeByUser;
    readOnlyTabs: string[];
    programmingLanguage: PLKeys;

    setCodeForUser: (userId: string, code: string) => void;
    setReadOnlyTabs: (tabs: string[]) => void;
    setProgrammingLanguage: (language: PLKeys) => void;
}
```

- `codeByUser`: The code content for each tab.
- `setCodeForUser`: Sets the code content for a specified tab.
- `readOnlyTabs`: The tabs that the current user only has read access to.
- `setReadOnlyTabs`: Sets the read-only tabs. This should only be invoked once.
- `programmingLanguage`: The programming language used for the current session. In a multiplayer session, the programming language is locked.
- `setProgrammingLanguage`: Sets the permitted programming language. This should only be invoked once.

#### Handling test case results and code output
Code execution results of multiple users are stored using a Zustand store hook, which can be found [here](../../../client/src/app/(withContext)/multiplayer/stores/codeExecutionStore.ts).

```ts
type OutputByUser = {
    [userId: string]: OutputEntry[];
}

type TestCaseResultsByUser = {
    [userId: string]: TestCaseResult[];
}

type ExecutionStatusByUser = {
    [userId: string]: ExecutionStatus;
}

type CodeExecutionState = {
    outputsByUser: OutputByUser;
    testCasesResultsByUser: TestCaseResultsByUser;
    executionStatusByUser: ExecutionStatusByUser;

    setOutput: (userId: string, output: OutputEntry[]) => void;
    setExecutionStatus: (userId: string, status: ExecutionStatus) => void;
    setTestCaseResults: (userId: string, testCaseResults: TestCaseResult[]) => void;
}
```

- `outputsByUser`: Code output for each player.
- `setOutput`: Sets the code output for a specified player.
- `testCasesResultsByUser`: Test case results for each player.
- `settestCaseResults`: Sets the test case results for a specified player.
- `executionStatusByUser`: The code execution state of each player, can be idle, running, code compiled and run successfully/with error, pass/fail public test cases.
- `setExecutionStatus`: Sets the code execution state for a specified player.

#### Handling the strategy board
The strategy board UI is controlled by a Zustand UI controller hook, which can be found [here](../../../client/src/app/(withContext)/multiplayer/hooks/useBoardController.ts).

```ts
// multiplayer/hooks/useBoardController.ts
type BoardControllerProps = {
    isBoardOpen: boolean;
    setIsBoardOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
}
```

- `isBoardOpen`: Whether the strategy board UI is open.
- `setIsBoardOpen`: Sets the open status of the board UI.
---

### [`/playground`](../../../client/src/app/(withContext)/playground/page.tsx)

The playground component represents an ordinary code editor that a user can use to run any code. Without the question/information display, it currently uses the two tabs layout, where the other tab is fixed to output mode.
