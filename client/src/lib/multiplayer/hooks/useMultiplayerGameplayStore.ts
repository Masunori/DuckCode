import { PLKeys } from "@/components/settings/settingsUtils";
import { OutputEntry } from "@/lib/apiClient/runCodeStatuses";
import { TestCaseResult } from "@/lib/gameplay/utils";
import { ChatboxMessage, ExecutionStatus } from "../utils";
import { BaseGameplayController, useBaseGameplayStore } from "@/lib/gameplay/hooks/useBaseGameplayStore";
import { create } from "zustand";
import { useUserStore } from "@/contexts/UserContext";

/** The multiplayer editor slice of the gameplay store. */
type MultiplayerEditorSlice = {
    /** The programming language shared by the entire team */
    programmingLanguage: PLKeys;
    /** Sets the programming language shared by the entire team */
    setProgrammingLanguage: (language: PLKeys) => void;

    /** The code content in the shared code editor tab, where keys are question indices */
    sharedCode: Record<string, string>;
    /** Sets the shared code for all questions */
    setSharedCode: (code: Record<string, string>) => void;
    /** Sets the shared code for a specific question */
    setSharedCodeForQuestion: (questionIndex: string, code: string) => void;
    /** Broadcasts shared code content changes to the server or other clients */
    emitSharedCodePatch: (questionIndex: string, newContent: string) => void;

    /** The code content of teammates' private code editor tabs, where first keys are player IDs and second keys are question indices */
    teammatesCode: Record<string, Record<string, string>>;
    /** Sets the code content of a teammate's private code editor tab */
    setTeammateCode: (userId: string, code: Record<string, string>) => void;
    /** Sets the code content of a teammate's private code editor tab for a specific question */
    setTeammateCodeForQuestion: (userId: string, questionIndex: string, code: string) => void;

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
    teammatesCodeOutput: Record<string, OutputEntry[]>;
    /** Sets the code output of a teammate's private code editor tab, where keys are player IDs */
    setTeammatesCodeOutput: (userId: string, output: OutputEntry[]) => void;  

    /** The test case results of the shared code editor tab, where keys are question indices */
    sharedTestCasesResults: Record<string, TestCaseResult[]>;
    /** Sets the test case results of the shared code editor tab for a specific question */
    setSharedTestCasesResults: (questionIndex: string, results: TestCaseResult[]) => void;

    /** The test case results of teammates' private code editor tabs, where first keys are player IDs and second keys are question indices */
    teammatesTestCasesResults: Record<string, Record<string, TestCaseResult[]>>;
    /** Sets the test case results of a teammate's private code editor tab for a specific question */
    setTeammateTestCasesResults: (userId: string, questionIndex: string, results: TestCaseResult[]) => void;

    /** The current code execution status of the shared code editor tab */
    sharedExecutionStatus: ExecutionStatus;
    /** Sets the current code execution status of the shared code editor tab */
    setSharedExecutionStatus: (status: ExecutionStatus) => void;

    /** The current code execution status of teammates' private code editor tabs, where keys are player IDs */
    teammatesExecutionStatus: Record<string, ExecutionStatus>;
    /** Sets the current code execution status of a teammate's private code editor tab */
    setTeammateExecutionStatus: (userId: string, status: ExecutionStatus) => void;
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

    if (Object.keys(state.teammatesCode).includes(view.userId)) {
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

    sharedCode: {},
    setSharedCode: (code) => set({ sharedCode: code }),
    setSharedCodeForQuestion: (questionIndex, code) =>
        set((state) => ({
            sharedCode: { ...state.sharedCode, [questionIndex]: code }
    })),
    emitSharedCodePatch: (questionIndex, newContent) => {
        // Implementation for emitting code patch to server or other clients
    },

    teammatesCode: {},
    setTeammateCode: (userId, code) =>
        set((state) => ({
            teammatesCode: { ...state.teammatesCode, [userId]: code }
    })),
    setTeammateCodeForQuestion: (userId, questionIndex, code) =>
        set((state) => ({
            teammatesCode: {
                ...state.teammatesCode,
                [userId]: {
                    ...state.teammatesCode[userId],
                    [questionIndex]: code,
                }
            }
    })),
    getActiveEditorCode: () => selectEditorCode(get()),

    // Multiplayer execution slice
    sharedCodeOutput: [],
    setSharedCodeOutput: (o) => set({ sharedCodeOutput: o }),

    teammatesCodeOutput: {},
    setTeammatesCodeOutput: (userId, output) =>
        set((state) => ({
            teammatesCodeOutput: { ...state.teammatesCodeOutput, [userId]: output }
    })),
    sharedTestCasesResults: {},
    setSharedTestCasesResults: (questionIndex, results) =>
        set((state) => ({
            sharedTestCasesResults: { ...state.sharedTestCasesResults, [questionIndex]: results }

    })),
    teammatesTestCasesResults: {},
    setTeammateTestCasesResults: (userId, questionIndex, results) =>
        set((state) => ({
            teammatesTestCasesResults: {
                ...state.teammatesTestCasesResults,
                [userId]: {
                    ...state.teammatesTestCasesResults[userId],
                    [questionIndex]: results,
                }
            }
    })),

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
