import { ApiModule } from "./apiModule";
import type { ApiTransport } from "./transport";
import type {
    GetQuestionByIdResponse,
    GetQuestionsInRangeResponse,
} from "./types";

/**
 * QuestionApi provides operations for the question API.
 * It provides methods to fetch questions by ID and to fetch questions within a specified difficulty range.
 * 
 * @param transport - An instance of `ApiTransport` for making HTTP requests.
 * @param path - The base path for the question API. Defaults to "/api/question".
 */
class QuestionApi extends ApiModule {
    constructor(transport: ApiTransport, path: string = "/api/question") {
        super(transport, path);
    }

    public async getQuestionById(qid: string): Promise<GetQuestionByIdResponse> {
        const searchParams = new URLSearchParams({ qid });

        return this.transport.get<GetQuestionByIdResponse>(
            `${this.endpoint("get_question_by_id")}?${searchParams.toString()}`
        );
    }

    public async getQuestionsInRange(
        minDifficulty: number,
        maxDifficulty: number
    ): Promise<GetQuestionsInRangeResponse> {
        const searchParams = new URLSearchParams({
            min_difficulty: minDifficulty.toString(),
            max_difficulty: maxDifficulty.toString(),
        });

        return this.transport.get<GetQuestionsInRangeResponse>(
            `${this.endpoint("get_questions_in_range")}?${searchParams.toString()}`
        );
    }
}

export { QuestionApi };
