import { ExecutionApi } from "./execution";
import { AuthenticationApi } from "./auth";
import type { ApiTransport } from "./transport";
import { QuestionApi } from "./question";

class ApiClient {
    readonly execution: ExecutionApi;
    readonly auth: AuthenticationApi;
    readonly question: QuestionApi;

    constructor(transport: ApiTransport) {
        this.execution = new ExecutionApi(transport);
        this.auth = new AuthenticationApi(transport);
        this.question = new QuestionApi(transport);
    }
}

export { ApiClient };
