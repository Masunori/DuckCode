export type ExecutionStatus = "idle" | "running" | "codeError" | "codeSuccess" | "testCasesPassed" | "testCasesFailed" | "serverError";

export const EXECUTION_STATUS_INFORMATION: Record<ExecutionStatus, { abbr: string, desc: string, color: string }> = {
    "idle": { abbr: "I", desc: "Idle - No code execution happening", color: "var(--font-colour)" },
    "running": { abbr: "R", desc: "Running", color: "#3498db" },
    "codeError": { abbr: "E", desc: "Code Execution Error", color: "var(--error-code-text-border-color)" },
    "codeSuccess": { abbr: "S", desc: "Code Execution Success", color: "var(--success-code-text-border-color)" },
    "testCasesPassed": { abbr: "P", desc: "All Public Test Cases Passed", color: "var(--success-code-text-border-color)" },
    "testCasesFailed": { abbr: "F", desc: "Some Public Test Cases Failed", color: "var(--error-code-text-border-color)" },
    "serverError": { abbr: "X", desc: "Server Error - Please try again later", color: "var(--error-code-text-border-color)" },
}

export type ChatboxMessage = {
    sender: string;
    content: string;
    timestamp: string;
}