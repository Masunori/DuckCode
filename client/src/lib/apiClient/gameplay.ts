import { CodeSubmissionResponse, Question, TestCaseResult } from '@/app/(withContext)/gameplay/gameplayUtils';
import { OutputEntry } from '@/lib/apiClient/runCodeStatuses';
import { PLKeys, PROGRAMMING_LANGUAGES } from '@/app/components/settings/settingsUtils';
import sleep from '@/app/utils/delay';
import { printd } from '@/app/utils/debugUtils';

const BASE = "https://min-nondetrimental-lillia.ngrok-free.app/";
const getQuestionApi = (difficulty: number) => BASE + `api/gameplay/getQuestion?cur_point=${difficulty}`;
const GET_QUESTION_BY_DIFFICULTY_API = BASE + "question/get_question_by_difficulty";
const RUN_CODE_API = BASE + 'api/gameplay/runCode';
const RUN_TEST_CASES_API = BASE + 'api/gameplay/runAllTestCases';

function consume(item: unknown) {
    return item;
}

export async function getQuestionsInRange(minDifficulty: number, maxDifficulty: number) {
    const response = await fetch(`/api/question/get_questions_in_range?min_difficulty=${minDifficulty}&max_difficulty=${maxDifficulty}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    const data = await response.json();

    printd("@apiClient/gameplay.ts", `Fetched questions in range ${minDifficulty}-${maxDifficulty}:`, data);

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

export async function runCode(sourceCode: string, language: string): Promise<{ status: number, codeStatus: string, output: OutputEntry[] }> {
    const response = await fetch("/api/execute/execute-code", {
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

    printd("@apiClient/gameplay.ts", "Run code response:", data);

    return {
        status: response.status,
        codeStatus: data.data.status,
        output: (data.data.output as string).split('\n').map((line) => ({ type: data.data.status === 'success' ? 'log' : 'error', content: line }) ),
    }
}

export async function runAllTestCases(qid: number, sourceCode: string, language: string) {
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

    printd("@apiClient/gameplay.ts", "Run all test cases response:", data);

    const results: TestCaseResult[] = data.data;

    return {
        status: response.status,
        results: results
    }
}

export async function submitCode(qid: number, sourceCode: string, language: string) {
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

