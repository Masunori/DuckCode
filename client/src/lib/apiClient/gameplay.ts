import { CodeSubmissionResponse, Question, TestCaseResult } from '@/app/(withContext)/gameplay/gameplayUtils';
import { OutputEntry } from '@/lib/apiClient/runCodeStatuses';
import { PLKeys, PROGRAMMING_LANGUAGES } from '@/app/components/settings/settingsUtils';
import sleep from '@/app/utils/delay';

const BASE = "https://min-nondetrimental-lillia.ngrok-free.app/";
const getQuestionApi = (difficulty: number) => BASE + `/api/gameplay/getQuestion?cur_point=${difficulty}`;
const GET_QUESTION_BY_DIFFICULTY_API = BASE + "/question/get_question_by_difficulty";
const RUN_CODE_API = BASE + '/api/gameplay/runCode';
const RUN_TEST_CASES_API = BASE + '/api/gameplay/runAllTestCases';

function consume(item: unknown) {
    return item;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getQuestionByDifficulty(difficulty: number, accessToken: string, refreshToken: string) {
    const response = await fetch(GET_QUESTION_BY_DIFFICULTY_API + `?difficulty=${difficulty}`, {
        method: "GET",
        headers: {
            'Authorization': accessToken,
        },
    });

    const data = await response.json();

    return {
        status: response.status,
        data
    };
}

export async function getQuestion(difficulty: number): Promise<Question> {
    const response = await fetch(getQuestionApi(difficulty), {
        cache: "no-store",
    });
    
    await sleep(1000);
    const data = await response.json();
    return data.question;
}

export async function runCode(qid: number, sourceCode: string, language: string): Promise<{ status: number, output: OutputEntry[] | undefined, message: string | undefined }> {
    const response = await fetch(RUN_CODE_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            qid: qid,
            sourceCode: sourceCode,
            languageId: PROGRAMMING_LANGUAGES[language as PLKeys].id,
        })
    });

    const data = await response.json();
    await sleep(2000);

    return {
        status: response.status,
        output: data?.output,
        message: data?.message,
    }
}

export async function runAllTestCases(qid: number, sourceCode: string, language: string) {
    const response = await fetch(RUN_TEST_CASES_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            qid: qid,
            sourceCode: sourceCode,
            languageId: PROGRAMMING_LANGUAGES[language as PLKeys].id,
        })
    });

    const data = await response.json();
    const results: TestCaseResult[] = data.results;
    await sleep(2000);

    return {
        status: response.status,
        results: results
    }
}

export async function submitCode(qid: number, sourceCode: string, language: string) {
    consume([qid, sourceCode, language]);

    await sleep(2000);

    const result: CodeSubmissionResponse = {
        correct: 69,
        total: 420,
        statusId: 5
    }

    return {
        status: 200,
        result
    }
}

