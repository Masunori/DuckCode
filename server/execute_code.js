import fetch from 'node-fetch';
import atob from 'atob';
import { getTestCaseFromQuestion } from './get_question.js';

const Status = {
    PENDING: 'PENDING',
    RUNNING: 'RUNNING',
    COMPLETED: 'COMPLETED',
};
const decoder = new TextDecoder('utf-8');
const urlPath = process.env.judge0_api;

//const API_URL = `http://localhost:2358/submissions`; // API for local compiler
const API_URL = `http://${urlPath}/submissions`; // API for server compiler 
const HEADERS = {
    'Content-Type': 'application/json',
};

const decodeBase64 = (encoded) => encoded ? Uint8Array.from(atob(encoded), c => c.charCodeAt(0)) : null;

export async function executeCode(sourceCode, stdin, expectedOutput, languageId) {
    const payload = {
        source_code: sourceCode,
        language_id: languageId,
        stdin,
        expected_output: expectedOutput,
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

        const finalResult = await waitForResult(token);
        return finalResult;
    } catch (error) {
        console.error('Error submitting code:', error.message);
        throw error;
    }
}

export async function submitCode(questionId, sourceCode, languageId) {
    try {
        const testCases = await getTestCaseFromQuestion(questionId, false);
        console.log(testCases);
        const numOfTestCases = testCases.length;
        const results = await Promise.all(
            testCases.map(({ input, expectedOutput }) =>
                executeCode(sourceCode, input, expectedOutput, languageId)
            )
        );
        let customId = -1; // custom ID for specific use of DuckCode
        let correct = 0;
        for (const result of results) {
            if (result.status.id === 3) {
                correct++;
            }
            else if (result.status.id === 6) {
                customId = 2; // compile error
                break;
            }
            else if (result.status.id >= 7) {
                customId = 3; // runtime error
            }
            else if (result.status.id === 5) {
                customId = 4; // tle
            }
        }
        if (correct === numOfTestCases) {
            customId = 1; // accepted
        } else {
            if (customId == -1) {
                customId = 5; // wrong answer
            }
        }
        console.log('Submission status: ', customId);
        console.log('Submission results:', results);    
        return { correct, total: numOfTestCases, statusId: customId };
    } catch (error) {
        console.error('Error submitting code:', error.message);
        throw error;
    }
}

export async function getSubmissionResult(token) {
    const url = `${API_URL}/${token}?base64_encoded=true`; 
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
            message: decodeBase64(result.message) ? decoder.decode(decodeBase64(result.message)) : null,
            compile_output: decodeBase64(result.compile_output) ? decoder.decode(decodeBase64(result.compile_output)) : null,
            stdout: decodeBase64(result.stdout) ? decoder.decode(decodeBase64(result.stdout)) : null,
            stderr: decodeBase64(result.stderr) ? decoder.decode(decodeBase64(result.stderr)) : null,
        };

        return decodedResult;
    } catch (error) {
        console.error('Error fetching submission result:', error.message);
        throw error;
    }
}

export async function waitForResult(token, timeout = 100000) {
    let result;
    let status = Status.PENDING;
    const start = Date.now();

    while ((status === Status.PENDING || status === Status.RUNNING || status === 'Processing') && Date.now() - start < timeout) {
        console.log('Waiting for submission result... Current status:', status);
        await new Promise((resolve) => setTimeout(resolve, 4000)); 

        result = await getSubmissionResult(token);
        status = result.status.description;
    }

    if (status === Status.PENDING || status === Status.RUNNING || status === 'Processing') {
        throw new Error('Timeout waiting for submission result');
    }
    return result;
}

export async function runAllTestCase(questionId, sourceCode, languageId) {
    try {
        const testCases = await getTestCaseFromQuestion(questionId, true);
        const results = await Promise.all(
            testCases.map(({ input, expectedOutput }) =>
                executeCode(sourceCode, input, expectedOutput, languageId)
            )
        );
        console.log('Test case results:', results);
        const filteredResults = results.map(({ status, stdout, compile_output }) => {
            const actualOutput = stdout ? stdout.split('\n') : [];
            if (compile_output != null) {
                return {
                    actualOutput,
                    status: status.description,
                    message: compile_output
                };
            }
            return {
                actualOutput,
                status: status.description
            };
        });        
        console.log('Filtered test case results:', filteredResults);
        return filteredResults;
    } catch (error) {
        console.error('Error running test cases:', error.message);
        throw error;
    }
}

export async function runCodeOnly(sourceCode, languageId) {
    const payload = {
        source_code: sourceCode,
        language_id: languageId,
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

        const finalResult = await waitForResult(token);
        console.log('Final Result:', finalResult);
        return finalResult.stdout || finalResult.compile_output || finalResult.stderr;
    } catch (error) {
        console.error('Error submitting code:', error.message);
        throw error;
    }
}