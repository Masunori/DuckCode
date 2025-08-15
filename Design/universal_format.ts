type Example = {
    input: string[];
    output: string[];
    explanation: string;
}

type TestCase = {
    tid: number;
    input: string;
    output: string;
}

export type Question = {
    qid: number;
    title: string;
    difficulty: number;
    description: string[];
    input: string[];
    output: string[];
    examples: Example[];
    constraints: string[];
    publicTestCases: TestCase[];
}