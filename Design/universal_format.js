// fetch question
const QUESTION_REQUEST = {
    difficulty: 1000, // int
}

const QUESTION_RESPONSE = {
    qid: 10000000, // int
    title: 'Title', // string
    difficulty: 1000, // int
    description: [
        'description_1',
        'description_2',
        'description_3'
    ], // string array
    input: [
        'input_1',
        'input_2',
        'input_3'
    ], // string array
    output: [
        'output_1',
        'output_2',
        'output_3'
    ], // string array
    examples: [ // JSON object array
        {
            input: [], // string array
            output: [], // string array
            explanation: 'Explanation' // string
        }
    ],
    constraints: [], // string array
    publicTestCases: [ // JSON object array
        {
            tid: 12345678,
            input: [], // string array
            expectedOutput: [], // string array
        }
    ]
}

// submit & run code
const SUBMISSION_REQUEST = {
    sourceCode: '// hello world', // string
    language: 'javascript', // string
}

/*
    1: accepted
    2: compile error
    3: runtime error
    4: TLE
    5: wrong answer
*/

const RUN_TEST_CASE_RESPONSE = [ // JSON object array
    {
        tid: 12345678, // int
        actualOutput: [], // string array
        statusId: 1, // int
        message: 'something...', // string if there is compile/runtime error, else null
    }
]

const SUBMISSION_RESPONSE = {
    correct: 69, // int
    total: 420, // int
    statusId: 1, // int
}

// run code in output mode
const RUN_CODE_REQUEST = {
    sourceCode: '// hello world', // string
    language: 'javascript', // string
}

const RUN_CODE_RESPONSE = {
    output: "", // string
}


