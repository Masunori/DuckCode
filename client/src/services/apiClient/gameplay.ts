import { printd } from '@/utils/debugUtils';

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

    // If there is no question available, this endpoint returns "{ data: null }", else, the question array.
    // Hence, return empty array if the data is null, else return the question array.
    return {
        status: response.status,
        data: Array.isArray(data.data)
            ? data.data as { qid: string; title: string; difficulty: number }[]
            : []
    };
}
