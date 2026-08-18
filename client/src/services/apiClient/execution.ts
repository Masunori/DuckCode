import { printd } from "@/utils/debugUtils";
import { TestCaseResult } from "@/utils/gameplay";
import { PLKeys } from "@/utils/settings";
import { RunCodeResponse } from "./types";

class ExecutionClient {
    private path: string;
    private client: Client;

    constructor(path: string = "/execute", client: Client) {
        this.path = path;
        this.client = client;
    }

    public async runCode(sourceCode: string, language: string): Promise<RunCodeResponse> {
        // const result = await this.client.post<RunCodeResponse>(`${this.path}/execute-code`, {
        //     sourceCode: sourceCode,
        //     languageId: language.toLowerCase() as PLKeys,
        // });


        printd("@apiClient/execution.ts", "Running code with language:", language);
        const response = await fetch(`${this.path}/execute-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sourceCode: sourceCode,
                languageId: language.toLowerCase() as PLKeys,
            }),
            credentials: 'include',
        });

        const data = await response.json();

        if (response.status === 200) {
            return {
                status: response.status,
                codeStatus: data.data.status,
                output: (data.data.output as string).split('\n').map((line) => ({ type: data.data.status === 'success' ? 'log' : 'error', content: line })),
            }
        } else {
            return {
                status: response.status,
                codeStatus: 'error',
                output: [{ type: 'error', content: data.message || 'An error occurred while executing the code.' }],
            }
        }
    }

    public async runAllTestCases(qid: number | string, sourceCode: string, language: string) {
        const response = await fetch("/api/execute/run-all-test-cases", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                questionId: qid,
                sourceCode: sourceCode,
                languageId: language.toLowerCase() as PLKeys,
            })
        });
    
        const data = await response.json();
    
        if (!data.ok) {
            return {
                status: response.status,
                results: [],
                message: (data.message as string) || 'An error occurred while running test cases.'
            }
        }
    
        const results: TestCaseResult[] = data.data;
    
        return {
            status: response.status,
            results: results,
            message: 'Test cases run successfully.'
        }
    }
    
    public async submitCode(qid: number | string, sourceCode: string, language: string) {
        const response = await fetch("/api/execute/submit-code", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                questionId: qid,
                sourceCode: sourceCode,
                languageId: language.toLowerCase() as PLKeys,
            })
        });
    
        const data = await response.json();
    
        printd("@apiClient/gameplay.ts", "Submit code response:", data);
    
        return {
            status: response.status,
            result: data.data
        }
    }
    
}