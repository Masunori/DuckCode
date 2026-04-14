export type FullTestCase = {
    isPublic: boolean;
    input: string;
    expectedOutput: string;
}

export type Example = {
    input: string;
    output: string;
    explanation: string;
}

export type FullQuestion = {
    questionid: number | string;
    title: string;
    difficulty: number;
    description: string;
    input_type: string;
    output_type: string;
    examples: Example[];
    ques_constraint: string;
    testcases: FullTestCase[];
}

export async function addQuestion(questionData: FullQuestion) {
    return fetch("/api/admin/addQuestion", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(questionData),
    });
}