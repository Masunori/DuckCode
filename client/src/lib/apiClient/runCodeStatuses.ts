export type OutputType = "log" | "error" | "warn";
export type OutputEntry = {
    type: OutputType;
    content: string;
};

export enum RunCodeStatuses {
    ACCEPTED = "Accepted",
    COMPILE_ERROR = "Compile Error",
    RUNTIME_ERROR = "Runtime Error",
    TIME_LIMIT_EXCEEDED = "Time Limit Exceeded",
    WRONG_ANSWER = "Wrong Answer",
}

export const RUN_CODE_RESPONSES: Record<number, RunCodeStatuses> = {
    1: RunCodeStatuses.ACCEPTED,
    2: RunCodeStatuses.COMPILE_ERROR,
    3: RunCodeStatuses.RUNTIME_ERROR,
    4: RunCodeStatuses.TIME_LIMIT_EXCEEDED,
    5: RunCodeStatuses.WRONG_ANSWER
}