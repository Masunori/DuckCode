import { SetState } from "@/lib/utils/types";
import { InformationMode, Question, TestCaseResult } from "../utils"
import { LockV2 } from "@/lib/utils/lock";
import { create } from "zustand";
import { useUserStore } from "@/contexts/UserContext";
import { runAllTestCases, runCode, submitCode } from "@/lib/apiClient/gameplay";
import { OutputEntry, RUN_CODE_RESPONSES, RunCodeStatuses } from "@/lib/apiClient/runCodeStatuses";
import { printd } from "@/lib/utils/debugUtils";
import { ExecutionStatus } from "@/lib/multiplayer/utils";
import { use } from "react";

/** Type of code editor view, where `shared` represents the shared code editor and `private` represents any player's private code editor identified by userId */
type CodeView = 
    | { kind: "shared" }
    | { kind: "private", userId: string };

/** The problem slice of the gameplay store. */
type ProblemSlice = {
    /** The list of questions for the game */
    questions: Question[];
    /** The time limit for the game in seconds */
    timeLimit: number;
    /** Sets the list of questions */
    setQuestions: SetState<Question[]>;
    /** Sets the time limit */
    setTimeLimit: SetState<number>;
}

/** The editor slice of the gameplay store */
type EditorSlice = {
    /** The content of the code editor for each question */
    codeContent: string[];
    /** Sets the content of the code editor for each question */
    setCodeContent: SetState<string[]>;
    /** Sets the content of the code editor at a specific question index (not identifier) */
    setCodeContentAtIndex: (index: number, content: string) => void;
    /** Broadcasts code content changes to the server or other clients */
    emitCodePatch: (questionId: string, newContent: string) => void;
}

/** The execution slice of the gameplay store */
type ExecutionSlice = {
    /** The lock to prevent concurrent code executions */
    lock: LockV2;
    /** Whether the execution is currently locked */
    isLocked: boolean;

    /** Executes the code */
    runCode: () => Promise<{ status: number, message: string } | undefined>;
    /** Runs the code against public test cases */
    runTestCases: () => Promise<{ status: number, message: string } | undefined>;
    /** Submits the code for full evaluation */
    submitCode: () => Promise<{ status: number, message: string } | undefined>;
    /** The output after running the code normally */
    codeOutput: OutputEntry[];
    /** Sets the code output */
    setCodeOutput: SetState<OutputEntry[]>;

    /** The test case results after running the code against public test cases */
    testCaseResults: TestCaseResult[][];
    /** Sets the test case results */
    setTestCaseResults: SetState<TestCaseResult[][]>;
    /** Sets the test case results at a specific question index */
    setTestCaseResultsAtIndex: (index: number, results: TestCaseResult[]) => void;

    /** The current code execution status */
    executionStatus: ExecutionStatus;
    /** Sets the current code execution status */
    setExecutionStatus: SetState<ExecutionStatus>;
}

/** The UI state slice of the gameplay store */
type UIStateSlice = {
    /** The index of the currently displayed question */
    activeQuestionIndex: number;
    /** Sets the index of the currently displayed question */
    setActiveQuestionIndex: SetState<number>;
    /** The index of the currently displayed test case */
    activeTestCaseIndex: number;
    /** Sets the index of the currently displayed test case */
    setActiveTestCaseIndex: SetState<number>;
    /** The current information mode being displayed */
    informationMode: InformationMode;
    /** Sets the current information mode being displayed */
    setInformationMode: SetState<InformationMode>;
    /** The current code view */
    activeCodeView: CodeView;
    /** Sets the code view */
    setActiveCodeView: SetState<CodeView>;
}

/** The reset slice of the gameplay store */
type ResetSlice = {
    /** Resets the store to its initial state */
    reset: () => void;
}

/** The base gameplay store that contains common functionalities for different gameplay modes. */
export type BaseGameplayController = ProblemSlice & EditorSlice & ExecutionSlice & UIStateSlice & ResetSlice;

export const useBaseGameplayStore = create<BaseGameplayController>((set, get) => {
    const lock = new LockV2();

    lock.subscribe((v) => {
        set({ isLocked: v });
    });

    return {
        // Problem Slice
        questions: [],
        timeLimit: 0,
        setQuestions: (questions) => 
            set((state) => ({
                questions: typeof questions === "function"
                    ? questions(state.questions) 
                    : questions
            })),
        setTimeLimit: (timeLimit) => 
            set((state) => ({
                timeLimit: typeof timeLimit === "function"
                    ? timeLimit(state.timeLimit) 
                    : timeLimit
            })),

        // Editor Slice
        codeContent: [],
        setCodeContent: (codeContents) => 
            set((state) => ({
                codeContent: typeof codeContents === "function"
                    ? codeContents(state.codeContent)
                    : codeContents
            })),
        setCodeContentAtIndex: (index, content) => {
            const currentContents = get().codeContent;
            const newContents = [...currentContents];
            newContents[index] = content;
            set({ codeContent: newContents });
        },
        emitCodePatch: (questionId, newContent) => {
            // Placeholder for emitting code patches to server or other clients
            printd("@/src/lib/gameplay/hooks/useBaseGameplayStore.ts", `Emitting code patch for question ${questionId}: ${newContent.slice(0, 10)}...`);
        },

        // Execution Slice
        lock,
        isLocked: lock.locked,
        runCode: async () => {
            const { 
                lock, 
                codeContent, 
                activeQuestionIndex, 
                setInformationMode,
                setCodeOutput
            } = get();

            const sourceCode = codeContent[activeQuestionIndex];

            if (!sourceCode) {
                return undefined;
            }

            const language = useUserStore.getState().user.userPreference.language;
            const output = await lock.call(() => runCode(sourceCode, language));

            setInformationMode("output");

            if (!output) {
                return { status: 409, message: "Another code execution is in progress" };
            } else if (output.status !== 200) {
                setCodeOutput(output.output);
                return { status: output.status, message: "Failed to run code" };
            } else {
                setCodeOutput(output.output);
                return { status: 200, message: "Code executed successfully" };
            }
        },
        runTestCases: async () => {
            const { 
                codeContent, 
                questions, 
                lock, 
                activeQuestionIndex, 
                setTestCaseResults, 
                setActiveTestCaseIndex, 
                setInformationMode 
            } = get();
            const sourceCode = codeContent[activeQuestionIndex];

            if (!sourceCode) {
                return undefined;
            }

            const language = useUserStore.getState().user.userPreference.language;
            const questionId = questions[activeQuestionIndex].qid;
            const output = await lock.call(() => runAllTestCases(questionId, sourceCode, language));

            setInformationMode("testCases");

            if (!output) {
                return { status: 409, message: "Another code execution is in progress." };
            } else if (output.status !== 200) {
                return { status: output.status, message: output.message || "Failed to run test cases." };
            } else {
                setTestCaseResults((prev) => {
                    const newResults = [...prev];
                    newResults[activeQuestionIndex] = output.results;
                    return newResults;
                });

                const firstWrongTestCaseIndex = output.results.findIndex(result => RUN_CODE_RESPONSES[result.statusId] !== RunCodeStatuses.ACCEPTED);

                if (firstWrongTestCaseIndex !== -1) {
                    setActiveTestCaseIndex(firstWrongTestCaseIndex);
                    const failedReason = output.results[firstWrongTestCaseIndex].message;
                    return { status: 200, message: `Test case ${firstWrongTestCaseIndex + 1} failed. Reason: ${failedReason}` };
                } else {
                    return { status: 200, message: "All public test cases passed successfully." };
                }
            }
        },
        submitCode: async () => {
            const {
                codeContent,
                questions,
                lock,
                activeQuestionIndex,
                setCodeOutput,
                setInformationMode
            } = get();

            const sourceCode = codeContent[activeQuestionIndex];

            if (!sourceCode) {
                return undefined;
            }

            const language = useUserStore.getState().user.userPreference.language;
            const questionId = questions[activeQuestionIndex].qid;
            const output = await lock.call(() => submitCode(questionId, sourceCode, language));

            setInformationMode("output");

            if (!output) {
                return { status: 409, message: "Another code execution is in progress." };
            } else if (output.status !== 200) {
                setCodeOutput([{ type: "error", content: "Failed to submit code" }]);
                return { status: output.status, message: "Failed to submit code" };
            } else {
                setCodeOutput([
                    { type: "log", content: `Correct: ${output.result.correct}` },
                    { type: "log", content: `Total: ${output.result.total}` },
                    { type: output.result.statusId === 1 ? "log" : "error", content: `Status: ${RUN_CODE_RESPONSES[output.result.statusId]}` }
                ]);

                return { status: 200, message: "Code submitted successfully" };
            }
        },
        codeOutput: [],
        setCodeOutput: (outputs) => 
            set((state) => ({
                codeOutput: typeof outputs === "function"
                    ? outputs(state.codeOutput)
                    : outputs
            })),
        testCaseResults: [],
        setTestCaseResults: (allResults) =>
            set((state) => ({
                testCaseResults: typeof allResults === "function"
                    ? allResults(state.testCaseResults)
                    : allResults
            })),
        setTestCaseResultsAtIndex: (index, results) => {
            const currentResults = get().testCaseResults;
            const newResults = [...currentResults];
            newResults[index] = results;
            set({ testCaseResults: newResults });
        },
        executionStatus: "idle",
        setExecutionStatus: (status) => 
            set((state) => ({
                executionStatus: typeof status === "function"
                    ? status(state.executionStatus)
                    : status
            })),

        // UI State Slice
        activeQuestionIndex: 0,
        setActiveQuestionIndex: (index) => 
            set((state) => ({
                activeQuestionIndex: typeof index === "function"
                    ? index(state.activeQuestionIndex)
                    : index
            })),
        activeTestCaseIndex: 0,
        setActiveTestCaseIndex: (index) => 
            set((state) => ({
                activeTestCaseIndex: typeof index === "function"
                    ? index(state.activeTestCaseIndex)
                    : index
            })),
        informationMode: "question",
        setInformationMode: (mode) => 
            set((state) => ({
                informationMode: typeof mode === "function"
                    ? mode(state.informationMode)
                    : mode
            })),
        activeCodeView: { kind: "private", userId: String(useUserStore.getState().user.id) },
        setActiveCodeView: (view) =>
            set((state) => ({
                activeCodeView: typeof view === "function"
                    ? view(state.activeCodeView)
                    : view
            })),
        reset: () => set({
            questions: [],
            timeLimit: 0,
            codeContent: [],
            testCaseResults: [],
            codeOutput: [],
            isLocked: false,
            activeQuestionIndex: 0,
            activeTestCaseIndex: 0,
            informationMode: "question"
        })
    }
});