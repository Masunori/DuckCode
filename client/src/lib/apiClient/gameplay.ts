import { TestCaseResult } from '@/lib/gameplay/utils';
import { PLKeys } from '@/components/settings/settingsUtils';
import { OutputEntry } from '@/lib/apiClient/runCodeStatuses';
import { printd } from '@/lib/utils/debugUtils';

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

export async function runCode(sourceCode: string, language: string): Promise<{ status: number, codeStatus: string, output: OutputEntry[] }> {
    printd("@apiClient/gameplay.ts", "Running code with language:", language);
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

    printd("@apiClient/gameplay.ts", `Run code status ${response.status}, response:`, data);

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

