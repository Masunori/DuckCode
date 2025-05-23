import { CodeSubmissionResponse, TestCaseResult } from '@/app/gameplay/gameplayUtils';
import { PLKeys, PROGRAMMING_LANGUAGES } from '@/app/components/settings/settingsUtils';
import sleep from '@/app/utils/delay';

const BASE = "http://localhost:3000";
const getQuestionApi = (difficulty: number) => BASE + `/api/gameplay/getQuestion?cur_point=${difficulty}`;
const RUN_CODE_API = BASE + '/api/gameplay/runCode';
const RUN_TEST_CASES_API = BASE + '/api/gameplay/runAllTestCases';

function consume(item: unknown) {
    return item;
}

export async function getQuestion(difficulty: number) {
    const response = await fetch(getQuestionApi(difficulty), {
        cache: "no-store",
    });
    
    await sleep(1000);
    const data = await response.json();
    return data.question;
}

export async function runCode(qid: number, sourceCode: string, language: string) {
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
        output: data.output
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

