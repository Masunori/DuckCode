import fetch from 'node-fetch';
import atob from 'atob';
import { get_test_case_from_question } from './get_question.js';

const Status = {
    PENDING: 'PENDING',
    RUNNING: 'RUNNING',
    COMPLETED: 'COMPLETED',
};
const decoder = new TextDecoder('utf-8');

const API_URL = 'http://localhost:2358/submissions'; // api for compiler 
const HEADERS = {
    'Content-Type': 'application/json',
};

const decodeBase64 = (encoded) => encoded ? Uint8Array.from(atob(encoded), c => c.charCodeAt(0)) : null;

export async function execute_code(source_code, stdin, expected_output, language_id) {
    //console.log(`Here is the source code`, source_code);
    const payload = {
        source_code,
        language_id,
        stdin,
        expected_output,
    };

    try {
        const response = await fetch(`${API_URL}?base64_encoded=false&wait=false&fields=*`, {
            method: 'POST',
            headers: HEADERS,
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Submission failed: ${response.statusText}`);
        }

        const result = await response.json();
        const token = result.token;
        console.log('Submission token:', token);

        const finalResult = await wait_for_result(token);
        // console.log('Final Result:', finalResult);

        return finalResult;
    } catch (error) {
        console.error('Error submitting code:', error.message);
        throw error;
    }
}

export async function submit_code(question_id, source_code, language_id) {
    try {
        //console.log(`Here is the source code`, source_code);
        const testcases = await get_test_case_from_question(question_id, false);
        const num_of_testcases = testcases.length;
        //console.log(testcases.length);
        const results = await Promise.all(
            testcases.map(({ input, expected_output }) =>
                execute_code(source_code, input, expected_output, language_id)
            )
        );
        let custom_id = -1; // custom id for specific use of duckcode
        // check for number of accepted test case
        let correct = 0;
        for (const result of results) {
            if (result.status.id === 3) {
                correct++;
            }
            else if(result.status.id === 6) {
                custom_id = 2; // compile error
                break;
            }
            else if(result.status.id >= 7) {
                custom_id = 3; // runtime error
            }
            else if(result.status.id === 5) {
                custom_id = 4; // tle
            }
        }
        if (correct === num_of_testcases) {
            custom_id = 1; // accepted
        }
        else {
            // check for other case // tle, mle, run time error
            if(custom_id == -1) {
                custom_id = 5; // wrong answer
            }
        }        
        console.log('Submission status: ', custom_id);
        console.log('Submission results:', results);    
        return {num_of_correct: correct, total: num_of_testcases, statusId: custom_id };
    } catch (error) {
        console.error('Error submitting code:', error.message);
        throw error;
    }
}

// get submission result from token
export async function get_submission_result(token) {
    const url = `${API_URL}/${token}?base64_encoded=true`; // get the submission result in base64 format

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: HEADERS,
        });

        if (!response.ok) {
            throw new Error(`Error fetching result: ${response.statusText}`);
        }

        const result = await response.json();

        const decodedResult = {
            ...result,
            compile_output: decodeBase64(result.compile_output) ? decoder.decode(decodeBase64(result.compile_output)) : null,
            stdout: decodeBase64(result.stdout) ? decoder.decode(decodeBase64(result.stdout)) : null,
            stderr: decodeBase64(result.stderr) ? decoder.decode(decodeBase64(result.stderr)) : null,
        };

        //console.log('Decoded Submission Result:', decodedResult);

        return decodedResult;
    } catch (error) {
        console.error('Error fetching submission result:', error.message);
        throw error;
    }
}

// set timeout and status for getting submission result
export async function wait_for_result(token, timeout = 30000) {
    let result;
    let status = Status.PENDING;
    const start = Date.now();

    while ((status === Status.PENDING || status === Status.RUNNING || status === 'Processing') && Date.now() - start < timeout) {
        console.log('Waiting for submission result... Current status:', status);
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Poll every 2 seconds

        result = await get_submission_result(token);
        status = result.status.description;
    }

    if (status === Status.PENDING || status === Status.RUNNING || status === 'Processing') {
        throw new Error('Timeout waiting for submission result');
    }

    // console.log('Final submission result:', result);
    return result;
}
// code for run all test case
export async function run_all_test_case(question_id, source_code, language_id) {
    try {
        const testcases = await get_test_case_from_question(question_id, true);
        const results = await Promise.all(
            testcases.map(({ input, expected_output }) =>
                execute_code(source_code, input, expected_output, language_id)
            )
        );
        console.log('Test case results:', results);
        const filted_results = results.map(({ status, stdout, compile_output }) => {
            return {
                stdout: stdout,
                status: status.description,
                compile_output: compile_output,
                
            };
        });
        console.log('Filtered test case results:', filted_results);
        return filted_results;
    } catch (error) {
        console.error('Error running test cases:', error.message);
        throw error;
    }
}

