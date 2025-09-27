import { OutputEntry } from "@/lib/apiClient/runCodeStatuses"
import { ExecutionStatus, TestCaseResult } from "../multiplayerUtils";
import { create } from "zustand";

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
    /** Code output for each player */
    outputsByUser: OutputByUser;
    /** Test case results for each player */
    testCasesResultsByUser: TestCaseResultsByUser;
    /** The state of code execution for each user */
    executionStatusByUser: ExecutionStatusByUser;

    /** Set code output for a specified user */
    setOutput: (userId: string, output: OutputEntry[]) => void;
    /** Set code execution status for a specified user */
    setExecutionStatus: (userId: string, status: ExecutionStatus) => void;
    /** Set test case results for a specified user */
    setTestCaseResults: (userId: string, testCaseResults: TestCaseResult[]) => void;
}

export const useCodeExecutionStore = create<CodeExecutionState>((set) => ({
    outputsByUser: {},
    executionStatusByUser: {},
    testCasesResultsByUser: {},

    setExecutionStatus: (userId, status) => 
        set((state) => ({
            executionStatusByUser: { ...state.executionStatusByUser, [userId]: status }
        })),
    setOutput: (userId, output) => 
        set((state) => ({
            outputsByUser: { ...state.outputsByUser, [userId]: output }
        })),
    setTestCaseResults: (userId, testCaseResults) => 
        set((state) => ({
            testCasesResultsByUser: { ...state.testCasesResultsByUser, [userId]: testCaseResults }
        }))
}));

