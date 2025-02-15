import { GAMEPLAY_API_HTTP } from "../../globalcomponents/constants";
import { delay } from "../fakeApiUtils";

/**
 * Sends a GET request to the server to fetch a question from the database.
 * 
 * @param {number} difficulty The difficulty of the question.
 * @returns A JSON response containing the information of the question
 */
export async function getQuestion(difficulty) {
    const response = await fetch(`${GAMEPLAY_API_HTTP}/question/get_question?cur_point=${difficulty.current}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch question! Status: ${response.status}`);
    }

    const result = await response.json();

    return result;
}

/**
 * Simulates a fake API call to fetch a question from the database.
 * 
 * @param {number} difficulty The difficulty of the question.
 * @returns A JSON response containing the information of the question
 */
export async function getQuestionFake(difficulty) {
    const questionResponse = {
        qid: 10000000, // int
        title: 'Two Sum', // string
        difficulty: 1000, // int
        description: [
            "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n",
            "You may assume that each input would have exactly one solution, and you may not use the same element twice.\n",
            "Arrange the values in your answer in INCREASING order."
        ], // string array
        input: [
            'Line 1 contains 1 integer, specifying the size n of the nums array.',
            'Line 2 contains n integers, specifying the elements of the array.',
            'Line 3 contains 1 integer, specifying the target.'
        ], // string array
        output: [
            'One line containing two integers, specifying the indices of the pair of numbers whose sum equals the target.',
            'Return the two integers in increasing order.'
        ], // string array
        examples: [ // JSON object array
            {
                input: [
                    '4',
                    '1 3 4 6',
                    '9',
                ], // string array
                output: [
                    '1 3',
                ], // string array
                explanation: 'Because nums[1] + nums[3] == 7, we print 1 and 3.' // string
            }
        ],
        constraints: [
            '2 <= nums.length <= 10^4',
            '-10^9 <= nums[i] <= 10^9',
            '-10^9 <= target <= 10^9',
            'Only one valid answer exists'
        ], // string array
        publicTestCases: [ // JSON object array
            {
                tid: 12345678,
                input: '4\n2 7 11 15\n9', // string 
                expectedOutput: '0 1', // string 
            },
            {
                tid: 12345679,
                input: '3\n3 2 4\n6',
                expectedOutput: '1 2', // string array
            },
            {
                tid: 12345680,
                input: '2\n3 3\n6',
                expectedOutput: '0 1',
            },
            {
                tid: 12345681,
                input: '4\n1 7 2 9\n16', // string array
                expectedOutput: '1 3',
            },
            {
                tid: 12345682,
                input: '6\n1 2 7 8 12 13\n10', // string array
                expectedOutput: '1 3',
            }
        ]
    }

    return delay(1000, questionResponse);
}