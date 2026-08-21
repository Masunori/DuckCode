import { PLKeys } from "@/utils/settings";
import { ApiModule } from "./apiModule";
import type { ApiTransport } from "./transport";
import type { RunAllTestCasesResponse, RunCodeResponse, SubmitCodeResponse } from "./types";

/**
 * ExecutionApi provides operations for the code execution API.
 * It provides methods to run code, run all test cases, and submit code for a specific question.
 * 
 * @param transport - An instance of `ApiTransport` for making HTTP requests.
 * @param path - The base path for the execution API. Defaults to "/api/execute".
 */
class ExecutionApi extends ApiModule {
    constructor(transport: ApiTransport, path: string = "/api/execute") {
        super(transport, path);
    }

    public async runCode(sourceCode: string, language: string): Promise<RunCodeResponse> {
        const result = await this.transport.post<RunCodeResponse>(this.endpoint("execute-code"), {
            sourceCode: sourceCode,
            languageId: language.toLowerCase() as PLKeys,
        }, {}, { retryWithAuth: true });

        return result;
    }

    public async runAllTestCases(qid: number | string, sourceCode: string, language: string) {
        const result = await this.transport.post<RunAllTestCasesResponse>(this.endpoint("run-all-test-cases"), {
            questionId: qid,
            sourceCode: sourceCode,
            languageId: language.toLowerCase() as PLKeys,
        }, {}, { retryWithAuth: true });

        return result;
    }
    
    public async submitCode(qid: number | string, sourceCode: string, language: string): Promise<SubmitCodeResponse> {
        const response = await this.transport.post<SubmitCodeResponse>(this.endpoint("submit-code"), {
            questionId: qid,
            sourceCode: sourceCode,
            languageId: language.toLowerCase() as PLKeys,
        }, {}, { retryWithAuth: true });

        return response as SubmitCodeResponse;
    }
    
}

export { ExecutionApi };
