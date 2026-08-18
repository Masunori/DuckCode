import { OutputEntry, TestCaseResult } from "@/utils/gameplay";

export enum RunCodeStatuses {
    ACCEPTED = "Accepted",
    COMPILE_ERROR = "Compile Error",
    RUNTIME_ERROR = "Runtime Error",
    TIME_LIMIT_EXCEEDED = "Time Limit Exceeded",
    WRONG_ANSWER = "Wrong Answer",
}

export const RUN_CODE_STATUSES: Record<number, RunCodeStatuses> = {
    1: RunCodeStatuses.ACCEPTED,
    2: RunCodeStatuses.COMPILE_ERROR,
    3: RunCodeStatuses.RUNTIME_ERROR,
    4: RunCodeStatuses.TIME_LIMIT_EXCEEDED,
    5: RunCodeStatuses.WRONG_ANSWER
}

export type Response<T> = {
    success: true;
    data: T;
} | {
    success: false;
    error: string;
}

export type RunCodeResponse = {
    status: number;
    codeStatus: string;
    output: OutputEntry[];
}

export type RunAllTestCasesResponse = {
    status: number;
    results: TestCaseResult[];
    message?: string;
}

export type SubmitCodeResponse = {
    correct: number;
    total: number;
    statusId: number;
}
