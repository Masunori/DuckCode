import { GAMEPLAY_API_HTTP, LANGUAGE_TO_ID } from "../../globalcomponents/constants";
import { delay } from "../fakeApiUtils";

/**
 * Sends a POST request to the server to submit the user's code.
 * A submission will run the user's code against both public and private test cases.
 * 
 * @param {number} qid The question ID (which is given in the getQuestion's JSON response)
 * @param {string} sourceCode The user's source code
 * @param {string} language The programming language
 * @returns the JSON response containing the submission results
 */
export async function submitCode(qid, sourceCode, language) {
    const response = await fetch(`${GAMEPLAY_API_HTTP}/code/submit_code`, {
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
        throw new Error(`Failed to submit code! Status: ${response.status}`);
    }

    const result = await response.json();

    return result;
}

/**
 * Simulates a fake API call to submit the user's code.
 * A submission will run the user's code against both public and private test cases.
 * 
 * @param {number} qid The question ID (which is given in the getQuestion's JSON response)
 * @param {string} sourceCode The user's source code
 * @param {string} language The programming language
 * @param {boolean} isSuccessful (default: false) The status of the submission. True if the user's code passes all test cases, false otherwise.
 * @returns the JSON response containing the submission results
 */
export async function submitCodeFake(qid, sourceCode, language, isSuccessful=false) {
    if (isSuccessful) {
        return delay(1000, {
            result: {
                correct: 10,
                total: 10,
                statusId: 1
            }
        });
    } else {
        return delay(1000, {
            result: {
                correct: 8,
                total: 10,
                statusId: 2
            }
        });
    }
}