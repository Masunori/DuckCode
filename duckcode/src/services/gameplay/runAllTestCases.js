import { LANGUAGE_TO_ID } from "../../globalcomponents/constants";
import { delay } from "../fakeApiUtils";

/**
 * Sends a POST request to the server to run the user's code with respect to all test cases.
 * 
 * @param {number} qid The question ID (which is given in the getQuestion's JSON response)
 * @param {string} sourceCode The user's source code
 * @param {string} language The programming language
 * @returns the JSON response containing the results for each public test case
 */
export async function runAllTestCases(qid, sourceCode, language) {
    const GAMEPLAY_API_HTTP = process.env.REACT_APP_GAMEPLAY_API_HTTP;
    
    const response = await fetch(`${GAMEPLAY_API_HTTP}/code/run_all_test_case`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            qid: qid,
            sourceCode: sourceCode,
            languageId: LANGUAGE_TO_ID[language]
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to execute code! Status: ${response.status}`);
    }

    const result = await response.json();

    return result;
}

/**
 * Simulates a fake API call to run the user's code with respect to all test cases.
 * 
 * @param {number} qid The question ID (which is given in the getQuestion's JSON response)
 * @param {string} sourceCode The user's source code
 * @param {string} language The programming language
 * @returns the JSON response containing the results for each public test case
 */
export async function runAllTestCasesFake(qid, sourceCode, language) {
    const response = {
        result: [
            {
                tid: 12345678, // int
                actualOutput: ['0 1'], // string array
                statusId: 1, // int
                status: 'Accepted', // string if there is compile/runtime error, else null
            },
            {
                tid: 123456789, // int
                actualOutput: ['1 2'], // string array
                statusId: 1, // int
                status: 'Accepted', // string if there is compile/runtime error, else null
            },
            {
                tid: 12345680, // int
                actualOutput: ['0 1'], // string array
                statusId: 1, // int
                status: 'Accepted', // string if there is compile/runtime error, else null
            },
            {
                tid: 123456781, // int
                actualOutput: ['1 3'], // string array
                statusId: 1, // int
                status: 'Accepted', // string if there is compile/runtime error, else null
            },
            {
                tid: 12345682, // int
                actualOutput: ['2 3'], // string array
                statusId: 5, // int
                status: 'Output Mismatch', // string if there is compile/runtime error, else null
            },
        ]
    };

    const GAMEPLAY_API_HTTP = process.env.REACT_APP_GAMEPLAY_API_HTTP;
    console.log(GAMEPLAY_API_HTTP);

    return await delay(1000, response);
}