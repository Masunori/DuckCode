import { OutputEntry, TestCaseResult } from "@/utils/gameplay";
import type { Question } from "@/utils/gameplay";
import type { User } from "@/app/userPrefs/userPrefsTypes";

export type Response<T> = {
    success: true;
    data: T;
} | {
    success: false;
    error: string;
}

// -------
// auth.ts
// -------
export type LoginResponse = {
    status: number;
    message: string;
}

export type SignUpResponse = {
    status: number;
    message: string | string[];
}

export type GetVerificationCodeResponse = {
    status: number;
    message: string;
}

export type VerifyOtpResponse = {
    status: number;
    message: string;
}

export type VerifyNewPasswordResponse = {
    status: number;
    message: string;
}

export type LogoutResponse = {
    status: number;
    message: string;
}

export type ChangePasswordResponse = {
    status: number;
    message: string;
}

export type RefreshTokenResponse = {
    status: number;
    message: string;
}

export type ResetPasswordResponse = {
    status: number;
    message: string;
}

export type GetProfileResponse = {
    status: number;
    user: User | null;
    message: string;
}

// ------------
// execution.ts
// ------------
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

export type RunCodeResponse = {
    status: number;
    codeStatus: string;
    output: OutputEntry[];
}

export type RunAllTestCasesResponse = {
    status: number;
    results: TestCaseResult[];
    message: string;
}

export type SubmitCodeResponse = {
    status: number;
    correct: number;
    exp: number;
    total: number;
    statusId: number;
    message?: string;
}

// -----------
// question.ts
// -----------
export type QuestionSummary = Pick<Question, "title" | "difficulty"> & {
    qid: string;
}

export type GetQuestionByIdResponse = {
    status: number;
    data: Question | null;
    message: string;
}

export type GetQuestionsInRangeResponse = {
    status: number;
    data: QuestionSummary[];
    message: string;
}
