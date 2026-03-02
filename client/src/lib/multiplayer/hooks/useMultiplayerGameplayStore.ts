import { PLKeys } from "@/components/settings/settingsUtils";
import { useUserStore } from "@/contexts/UserContext";
import { OutputEntry } from "@/lib/apiClient/runCodeStatuses";
import { BaseGameplayController, useBaseGameplayStore } from "@/lib/gameplay/hooks/useBaseGameplayStore";
import { TestCaseResult } from "@/lib/gameplay/utils";
import { create } from "zustand";
import { ChatboxMessage, ExecutionStatus } from "../utils";

/** The multiplayer editor slice of the gameplay store. */
type MultiplayerEditorSlice = {
    /** The programming language shared by the entire team */
    programmingLanguage: PLKeys;
    /** Sets the programming language shared by the entire team */
    setProgrammingLanguage: (language: PLKeys) => void;

    /** The code content in the shared code editor tab, indexed by question index */
    sharedCode: string[];
    /** Sets the shared code for all questions */
    setSharedCode: (code: string[]) => void;
    /** Sets the shared code for a specific question */
    setSharedCodeForQuestion: (questionIndex: number, code: string) => void;
    /** Broadcasts shared code content changes to the server or other clients */
    emitSharedCodePatch: (questionIndex: number, newContent: string) => void;

    /** The code content of teammates' private code editor tabs, where keys are player IDs and values are arrays indexed by question index */
    teammatesCode: Record<number, string[]>;
    /** Sets the code content of a teammate's private code editor tab */
    setTeammateCode: (userId: number, code: string[]) => void;
    /** Sets the code content of a teammate's private code editor tab for a specific question */
    setTeammateCodeForQuestion: (userId: number, questionIndex: number, code: string) => void;

    /** Selects the code content and its editability based on the current code view */
    getActiveEditorCode: () => { code: string, editable: boolean };
}

/** The multiplayer execution slice of the gameplay store. */
type MultiplayerExecutionSlice = {
    /** The output of the shared code editor tab */
    sharedCodeOutput: OutputEntry[];
    /** Sets the output of the shared code editor tab */
    setSharedCodeOutput: (o: OutputEntry[]) => void;

    /** The output of teammates' private code editor tabs, where keys are player IDs */
    teammatesCodeOutput: Record<number, OutputEntry[]>;
    /** Sets the code output of a teammate's private code editor tab, where keys are player IDs */
    setTeammatesCodeOutput: (userId: number, output: OutputEntry[]) => void;

    /** The test case results of the shared code editor tab, indexed by question index */
    sharedTestCasesResults: TestCaseResult[][];
    /** Sets the test case results of the shared code editor tab for a specific question */
    setSharedTestCasesResults: (questionIndex: number, results: TestCaseResult[]) => void;

    /** The test case results of teammates' private code editor tabs, where keys are player IDs and values are arrays indexed by question index */
    teammatesTestCasesResults: Record<number, TestCaseResult[][]>;
    /** Sets the test case results of a teammate's private code editor tab for a specific question */
    setTeammateTestCasesResults: (userId: number, questionIndex: number, results: TestCaseResult[]) => void;

    /** The current code execution status of the shared code editor tab */
    sharedExecutionStatus: ExecutionStatus;
    /** Sets the current code execution status of the shared code editor tab */
    setSharedExecutionStatus: (status: ExecutionStatus) => void;

    /** The current code execution status of teammates' private code editor tabs, where keys are player IDs */
    teammatesExecutionStatus: Record<number, ExecutionStatus>;
    /** Sets the current code execution status of a teammate's private code editor tab */
    setTeammateExecutionStatus: (userId: number, status: ExecutionStatus) => void;
}

/** The board slice controls interactions with the strategy board */
type BoardSlice = {
    /** Whether the strategy board is open */
    isBoardOpen: boolean;

    /** Toggles the strategy board */
    setIsBoardOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
};

/** The chat slice controls interactions with the chat interface */
type ChatSlice = {
    /** Whether the chatbox is open */
    isChatboxOpen: boolean;
    /** Toggles the chatbox */
    setIsChatboxOpen: (bool: boolean | ((prev: boolean) => boolean)) => void;
    /** The message in the chatbox's text input field */
    message: string;
    /** Sets the message in the chatbox's text input field */
    setMessage: (message: string) => void;
    /** Broadcasts the message to the server and updates the message history */
    sendMessage: () => void;

    /** The list of message from all users */
    messageHistory: ChatboxMessage[];
    /** Adds a new message to the list of messages */
    addMessageToHistory: (message: ChatboxMessage) => void;
};

/** The multiplayer store that contains extra functionalities for multiplayer gameplay modes, on top of the base gameplay store. */
type MultiplayerSlice = MultiplayerEditorSlice & MultiplayerExecutionSlice & BoardSlice & ChatSlice;

/**
 * Selects the code content and its editability based on the current code view.
 * 
 * @param state The combined base gameplay and multiplayer store state
 * @returns The code content and whether it is editable
 */
function selectEditorCode(
    state: BaseGameplayController & MultiplayerSlice
): { code: string, editable: boolean } {
    const activeQuestionIndex = state.activeQuestionIndex;
    const view = state.activeCodeView;

    if (view.kind === "shared") {
        return {
            code: state.sharedCode[activeQuestionIndex] ?? "",
            editable: true,
        }
    }

    if (Object.keys(state.teammatesCode).includes(view.userId.toString())) {
        return {
            code: state.teammatesCode[view.userId][activeQuestionIndex] ?? "",
            editable: false,
        }
    }

    return {
        code: state.codeContent[activeQuestionIndex] ?? "",
        editable: true,
    }
}

export const useMultiplayerGameplayStore = create<
    BaseGameplayController & MultiplayerSlice
>((set, get) => ({
    // Inherit all base gameplay store states and actions
    ...useBaseGameplayStore.getState(),

    // Multiplayer editor slice
    programmingLanguage: "JavaScript",
    setProgrammingLanguage: (language) => set({ programmingLanguage: language }),

    sharedCode: [],
    setSharedCode: (code) => set({ sharedCode: code }),
    setSharedCodeForQuestion: (questionIndex, code) =>
        set((state) => {
            const newCode = [...state.sharedCode];
            newCode[questionIndex] = code;
            return { sharedCode: newCode };
        }),
    emitSharedCodePatch: (questionIndex, newContent) => {
        // Implementation for emitting code patch to server or other clients
    },

    teammatesCode: {},
    setTeammateCode: (userId, code) =>
        set((state) => ({
            teammatesCode: { ...state.teammatesCode, [userId]: code }
        })),
    setTeammateCodeForQuestion: (userId, questionIndex, code) =>
        set((state) => {
            const newCode = [...(state.teammatesCode[userId] ?? [])];
            newCode[questionIndex] = code;
            return {
                teammatesCode: { ...state.teammatesCode, [userId]: newCode }
            };
        }),
    getActiveEditorCode: () => selectEditorCode(get()),

    // Multiplayer execution slice
    sharedCodeOutput: [],
    setSharedCodeOutput: (o) => set({ sharedCodeOutput: o }),

    teammatesCodeOutput: {},
    setTeammatesCodeOutput: (userId, output) =>
        set((state) => ({
            teammatesCodeOutput: { ...state.teammatesCodeOutput, [userId]: output }
        })),
    sharedTestCasesResults: [],
    setSharedTestCasesResults: (questionIndex, results) =>
        set((state) => {
            const newResults = [...state.sharedTestCasesResults];
            newResults[questionIndex] = results;
            return { sharedTestCasesResults: newResults };
        }),
    teammatesTestCasesResults: {},
    setTeammateTestCasesResults: (userId, questionIndex, results) =>
        set((state) => {
            const newResults = [...(state.teammatesTestCasesResults[userId] ?? [])];
            newResults[questionIndex] = results;
            return {
                teammatesTestCasesResults: { ...state.teammatesTestCasesResults, [userId]: newResults }
            };
        }),

    sharedExecutionStatus: "idle",
    setSharedExecutionStatus: (status) => set({ sharedExecutionStatus: status }),

    teammatesExecutionStatus: {},
    setTeammateExecutionStatus: (userId, status) =>
        set((state) => ({
            teammatesExecutionStatus: { ...state.teammatesExecutionStatus, [userId]: status }
        })),

    // Chat slice
    isChatboxOpen: false,
    setIsChatboxOpen: (bool) =>
        set((state) => ({
            isChatboxOpen: typeof bool === "function"
                ? bool(state.isChatboxOpen)
                : bool,
        })),
    message: "",
    setMessage: (message) => set({ message: message }),
    sendMessage: () => {
        const message = get().message;
        if (message.trim() === "") {
            return;
        }

        const user = useUserStore.getState().user;

        get().addMessageToHistory({
            sender: user.name,
            content: message,
            timestamp: new Date().toISOString(),
        });

        set({ message: "" });
    },
    messageHistory: [],
    addMessageToHistory: (message) => set((state) => ({
        messageHistory: [...state.messageHistory, message]
    })),

    // Board slice
    isBoardOpen: false,
    setIsBoardOpen: (bool) =>
        set((state) => ({
            isBoardOpen: typeof bool === "function"
                ? bool(state.isBoardOpen)
                : bool,
        })),
}));

/**
 * Memoizes a selector by caching its result as long as the specified dependency
 * references remain the same. Since Zustand store methods are stable references
 * (created once, never replaced), setter selectors wrapped with this utility will
 * return the same function reference on every call after the first, preventing
 * unnecessary re-renders when used with `useMultiplayerGameplayStore`.
 */
function memoizeSelector<TState, TResult>(
    selector: (state: TState) => TResult,
    getDeps: (state: TState) => unknown[]
): (state: TState) => TResult {
    let prevDeps: unknown[] | null = null;
    let prevResult: TResult;
    return (state: TState) => {
        const deps = getDeps(state);
        if (prevDeps !== null && deps.every((d, i) => d === prevDeps![i])) {
            return prevResult;
        }
        prevDeps = deps;
        prevResult = selector(state);
        return prevResult;
    };
}

/**
 * Aggregates code content for all users based on the current state, including the shared code and teammates' private code.
 * 
 * @param state The multiplayer gameplay store state
 * @returns A record mapping user identifiers ("Team", "You", teammate userIds) to their respective code content arrays indexed by question index
 */
export function selectCodeByUser(state: BaseGameplayController & MultiplayerSlice): Record<string, string[]> {
    return {
        "Team": state.sharedCode,
        "You": state.codeContent,
        ...state.teammatesCode,
    }
}

/**
 * A selector function that returns a code setter function which updates the appropriate code content based on the user identifier.
 * 
 * @param state The multiplayer gameplay store state
 * @returns A function that takes a userId and code array, and updates the corresponding code content in the store (shared code for "Team", personal code for "You", and corresponding teammate code for other userIds)
 */
export const selectCodeSetterForUser = memoizeSelector(
    (state: BaseGameplayController & MultiplayerSlice) =>
        (userId: string, code: string[]) => {
            if (userId === "Team") {
                state.setSharedCode(code);
            } else if (userId === "You") {
                state.setCodeContent(code);
            } else {
                const numericUserId = parseInt(userId);
                if (!isNaN(numericUserId)) {
                    state.setTeammateCode(numericUserId, code);
                }
            }
        },
    (state) => [state.setSharedCode, state.setCodeContent, state.setTeammateCode]
);

/**
 * A selector function that returns a code setter function which updates the appropriate code content for a specific question based on the user identifier.
 * 
 * @param state The multiplayer gameplay store state
 * @returns A function that takes a userId, questionIndex, and code string, and updates the corresponding code content for that question in the store (shared code for "Team", personal code for "You", and corresponding teammate code for other userIds)
 */
export const selectCodeSetterForUserAtQuestionIdx = memoizeSelector(
    (state: BaseGameplayController & MultiplayerSlice) =>
        (userId: string, questionIndex: number, code: string) => {
            // Read fresh state at call time so the stable cached function never uses stale data
            const s = useMultiplayerGameplayStore.getState();
            if (userId === "Team") {
                const currentSharedCode = s.sharedCode;
                currentSharedCode[questionIndex] = code;
                state.setSharedCode(currentSharedCode);
            } else if (userId === "You") {
                const currentPersonalCode = s.codeContent;
                currentPersonalCode[questionIndex] = code;
                state.setCodeContent(currentPersonalCode);
            } else {
                const numericUserId = parseInt(userId);
                if (!isNaN(numericUserId)) {
                    const currentTeammateCode = s.teammatesCode[numericUserId];
                    if (currentTeammateCode) {
                        currentTeammateCode[questionIndex] = code;
                        state.setTeammateCode(numericUserId, currentTeammateCode);
                    }
                }
            }
        },
    (state) => [state.setSharedCode, state.setCodeContent, state.setTeammateCode]
);

/**
 * Aggregates execution status for all users based on the current state, including the shared code execution status and teammates' private code execution status.
 * 
 * @param state The multiplayer gameplay store state
 * @returns A record mapping user identifiers ("Team", "You", teammate userIds) to their respective code execution status
 */
export function selectExecutionStatusForUser(
    state: BaseGameplayController & MultiplayerSlice
): Record<string, ExecutionStatus> {
    return {
        "Team": state.sharedExecutionStatus,
        "You": state.executionStatus,
        ...state.teammatesExecutionStatus
    }
}

/**
 * A selector function that returns a execution status setter function which updates the appropriate execution status based on the user identifier.
 * 
 * @param state The multiplayer gameplay store state
 * @returns A function that takes a userId and execution status, and updates the corresponding execution status in the store (shared execution status for "Team", personal execution status for "You", and corresponding teammate execution status for other userIds)
 */
export const selectExecutionStatusSetterForUser = memoizeSelector(
    (state: BaseGameplayController & MultiplayerSlice) =>
        (userId: string, status: ExecutionStatus) => {
            if (userId === "Team") {
                state.setSharedExecutionStatus(status);
            } else if (userId === "You") {
                state.setExecutionStatus(status);
            } else {
                const numericUserId = parseInt(userId);
                if (!isNaN(numericUserId)) {
                    state.setTeammateExecutionStatus(numericUserId, status);
                }
            }
        },
    (state) => [state.setSharedExecutionStatus, state.setExecutionStatus, state.setTeammateExecutionStatus]
);

/**
 * Aggregates test case results for all users based on the current state, including the shared test case results and teammates' private test case results.
 * 
 * @param state The multiplayer gameplay store state 
 * @returns A record mapping user identifiers ("Team", "You", teammate userIds) to their respective test case results arrays indexed by question index
 */
export function selectTestCaseResultsForUser(
    state: BaseGameplayController & MultiplayerSlice
): Record<string, TestCaseResult[][]> {
    return {
        "Team": state.sharedTestCasesResults,
        "You": state.testCaseResults,
        ...state.teammatesTestCasesResults
    }
}

/**
 * A selector function that returns a test case results setter function which updates the appropriate test case results based on the user identifier.
 * 
 * @param state The multiplayer gameplay store state
 * @returns A function that takes a userId, questionIndex, and results, and updates the corresponding test case results in the store (shared test case results for "Team", personal test case results for "You", and corresponding teammate test case results for other userIds)
 */
export const selectTestCaseResultsSetterForUser = memoizeSelector(
    (state: BaseGameplayController & MultiplayerSlice) =>
        (userId: string, questionIndex: number, results: TestCaseResult[]) => {
            // Read fresh state at call time so the stable cached function never uses stale data
            const s = useMultiplayerGameplayStore.getState();
            if (userId === "Team") {
                const currentSharedTestCasesResults = s.sharedTestCasesResults;
                currentSharedTestCasesResults[questionIndex] = results;
                state.setSharedTestCasesResults(questionIndex, results);
            } else if (userId === "You") {
                const currentPersonalTestCaseResults = s.testCaseResults;
                currentPersonalTestCaseResults[questionIndex] = results;
                state.setTestCaseResults(currentPersonalTestCaseResults);
            } else {
                const numericUserId = parseInt(userId);
                if (!isNaN(numericUserId)) {
                    const currentTeammateTestCasesResults = s.teammatesTestCasesResults[numericUserId];
                    if (currentTeammateTestCasesResults) {
                        currentTeammateTestCasesResults[questionIndex] = results;
                        state.setTeammateTestCasesResults(numericUserId, questionIndex, results);
                    }
                }
            }
        },
    (state) => [state.setSharedTestCasesResults, state.setTestCaseResults, state.setTeammateTestCasesResults]
);

/**
 * Aggregates code output for all users based on the current state, including the shared code output and teammates' private code output.
 * 
 * @param state The multiplayer gameplay store state
 * @returns A record mapping user identifiers ("Team", "You", teammate userIds) to their respective code output arrays
 */
export function selectCodeOutputForUser(
    state: BaseGameplayController & MultiplayerSlice
): Record<string, OutputEntry[]> {
    return {
        "Team": state.sharedCodeOutput,
        "You": state.codeOutput,
        ...state.teammatesCodeOutput
    }
}

/**
 * A selector function that returns a code output setter function which updates the appropriate code output based on the user identifier.
 * 
 * @param state The multiplayer gameplay store state
 * @returns A function that takes a userId and output, and updates the corresponding code output in the store (shared code output for "Team", personal code output for "You", and corresponding teammate code output for other userIds)
 */
export const selectCodeOutputSetterForUser = memoizeSelector(
    (state: BaseGameplayController & MultiplayerSlice) =>
        (userId: string, output: OutputEntry[]) => {
            if (userId === "Team") {
                state.setSharedCodeOutput(output);
            } else if (userId === "You") {
                state.setCodeOutput(output);
            } else {
                const numericUserId = parseInt(userId);
                if (!isNaN(numericUserId)) {
                    state.setTeammatesCodeOutput(numericUserId, output);
                }
            }
        },
    (state) => [state.setSharedCodeOutput, state.setCodeOutput, state.setTeammatesCodeOutput]
);