import { GAMEPLAY_API_HTTP, LANGUAGE_TO_ID } from "../../globalcomponents/constants";
import { delay } from "../fakeApiUtils";

/**
 * Sends a POST request to the server to run the user's code in output mode.
 * 
 * @param {number} qid The question ID (which is given in the getQuestion's JSON response)
 * @param {string} sourceCode The user's source code
 * @param {string} language The programming language
 * @returns the JSON response containing the code status and code output
 */
export async function runCode(qid, sourceCode, language) {
    const response = await fetch(`${GAMEPLAY_API_HTTP}/code/run_code_only`, {
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

    return {
        status: 'success',
        output: result.output
    }
}

/**
 * Simulates a fake API call to run the user's code in output mode.
 * 
 * @param {number} qid The question ID (which is given in the getQuestion's JSON response)
 * @param {string} sourceCode The user's source code
 * @param {string} language The programming language
 * @param {boolean} isSuccessful (default: true) The simulated behaviour of the code. True if the code successfully runs, false otherwise
 * @returns the JSON response containing the code status and code output
 */
export async function runCodeFake(qid, sourceCode, languageId, isSuccessful=true) {
    if (isSuccessful) {
        return await delay(1000, {
            status: 'success',
            output: 'This is a dummy programme output.'
        });
    } else {
        return await delay(1000, {
            status: 'error',
            output: 'Error [duckcode.js:1]: This is a dummy programme error.'
        });
    }
}