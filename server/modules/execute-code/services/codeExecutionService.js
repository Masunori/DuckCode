import db from '../../database/models/index.js';    

const API_URL = 'http://localhost:2358/submissions';
const codeExecutionService = {
    async executeCode(sourceCode, languageid) {
        const payload = {
            source_code: sourceCode,
            language_id: languageid,
        };
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            throw new Error(`Error executing code: ${response.statusText}`);
        }
        const result = await response.json();
        const token = result.token;
        console.log('Submission token:', token);
        const finalResult = await this.waitForResult(token);
        console.log('Final Result:', finalResult);
        if (finalResult.stdout) {
            return {
                status: "success",
                output: finalResult.stdout
            };
        } else {
            return {
                status: "error",
                output: finalResult.stderr || finalResult.compile_output
            };
        }
    },
    async waitForResult(token) {
        const API_URL = `http://localhost:2358/submissions/${token}?base64_encoded=false&fields=*`;
        let result;
        do {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`Error fetching result: ${response.statusText}`);
            }
            result = await response.json();
            console.log('Current Result:', result);
            if (result.status.id === 3 || result.status.id === 4) {
                break; // Finished or Error
            }
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait before next check
        } while (true);
        return result;
    },
    async executeCodeWithInput(sourceCode, stdin, expectedOutput, languageid) {
        const API_URL = 'http://localhost:2358/submissions';
        const payload = {
            source_code: sourceCode,
            stdin: stdin,
            expected_output: expectedOutput,
            language_id: languageid,
        };

        try {
            const response = await fetch(`${API_URL}?base64_encoded=false&wait=true&fields=*`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Submission failed: ${response.statusText}`);
            }
            const result = await response.json();
            const token = result.token;
            console.log('Submission token:', token);
            const finalResult = await this.waitForResult(token);
            console.log('Final Result:', finalResult);
            return finalResult;
        } catch (error) {
            console.error('Error executing code with input:', error.message);
            throw error;
        }
    },
    async runTestCases(questionid, sourceCode, languageid) {
        const question = await db.Question.findByPk(questionid, {
            include: [
                {
                    model: db.Testcase,
                    as: 'testcases',
                    where: { is_public: true }
                }
            ]
        });
        if (!question) {
            throw new Error('Question not found');
        }
        const testCases = question.testcases.map(tc => ({
            input: tc.input,
            expectedOutput: tc.expected_output,
        }));
        const results = await Promise.all(
            testCases.map(({ input, expectedOutput }) =>
                this.executeCodeWithInput(sourceCode, input, expectedOutput, languageid)
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
    },
    async submitCode(sourceCode, languageid, questionid) {
        const question = await db.Question.findByPk(questionid, {
            include: [
                {
                    model: db.Testcase,
                    as: 'testcases',
                }
            ]
        });
        if (!question) {
            throw new Error('Question not found');
        }
        const testCases = question.testcases.map(tc => ({
            input: tc.input,
            expectedOutput: tc.expected_output,
        }));
        const results = await Promise.all(
            testCases.map(({ input, expectedOutput }) =>
                this.executeCodeWithInput(sourceCode, input, expectedOutput, languageid)
            )
        );
        console.log('Test case results:', results);
        let customId = -1; // custom ID for specific use of DuckCode
        let correctCount = 0;
        for(const result of results) {
            if (result.status.id === 3) { // Assuming 3 is the ID for 'Accepted'
                correctCount++;
            }
            else if(result.status.id === 6) {
                customId = 2; // compile error
                break;
            }
            else if(result.status.id >= 7) {
                customId = 3; // runtime error
            }
            else if(result.status.id === 5) {
                customId = 4; // TLE
            }
        }
        if(correctCount === testCases.length) {
            customId = 1; // Accepted
        }
        else {
            if (customId === -1) {
                customId = 5; // Wrong answer
            }
        }
        console.log('Submission status: ', customId);
        console.log('Submission results:', results);
        return { correct: correctCount, total: testCases.length, statusId: customId };
    }
};
export default codeExecutionService;