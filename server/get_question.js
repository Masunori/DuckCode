import { pool } from './config/db.js';

export async function getQuestion(curPoint) {
    const point = parseInt(curPoint, 10);
    if (isNaN(point)) {
        throw new Error('Invalid curPoint value');
    }

    const query = `SELECT * FROM question.question WHERE difficulty <= ${point + 500}`;
    
    try {
        const result = await pool.query(query);
        const questions = result.rows;
        if (!questions.length) {
            throw new Error('No questions found');
        } else {
            const randomIndex = Math.floor(Math.random() * questions.length);
            const question = questions[randomIndex];   
            const questionId = question.questionid;
            
            // Get test case for question
            const publicTestCases = await getTestCaseFromQuestion(questionId, true);
            const mergedResponse = { ...splitFields(question), publicTestCases };
            return mergedResponse;
        }
    } catch (error) {
        throw new Error('Database query error: ' + error.message);
    }
}

// Function to process the pure received JSON
function splitFields(data) {
    const result = {
      questionId: data.questionid,
      title: data.title,
      difficulty: data.difficulty,
      description: data.description.split('\n\n').filter(Boolean),
      input: data.input_type.split('\n\n').filter(Boolean),
      output: data.output_type.split('\n\n').filter(Boolean),
      constraints: data.ques_constraint.split('\n\n').filter(Boolean)
    };
    const exampleParts = data.example.split('\n\n').filter(Boolean);
    let examples = []; // Array to hold multiple example objects

    let currentExample = { input: [], output: [], explanation: '' };

    exampleParts.forEach((part, index) => {
        if (part.startsWith('Input:')) {
            currentExample.input.push(part.replace('Input: ', '').trim());
        } else if (part.startsWith('Output:')) {
            currentExample.output.push(part.replace('Output: ', '').trim());
        } else if (part.startsWith('Explanation:')) {
            currentExample.explanation = part.replace('Explanation: ', '').trim();
        }

        // Optionally, push the current example to examples array when input and output are both populated
        if (currentExample.input.length && currentExample.output.length) {
            examples.push({ ...currentExample });
            currentExample = { input: [], output: [], explanation: '' }; // Reset for the next example
        }
    });

    // Now `examples` contains the structure you're looking for
    result.examples = examples;
    return result;
}

export async function getTestCaseFromQuestion(questionId, isPublic) {
    let query;
    if (isPublic === false) {
        query = `SELECT testcaseid, input, expected_output FROM question.testcase WHERE questionid = ${questionId}`;
    } else {
        query = `SELECT testcaseid, input, expected_output FROM question.testcase WHERE questionid = ${questionId} AND ispublic = true`;
    }

    try {
        const result = await pool.query(query);

        // Ensure result.rows is an array
        if (!Array.isArray(result.rows)) {
            throw new Error('Expected an array of test cases, but got something else.');
        }

        // Map the results to the desired format
        const filteredResults = result.rows.map(({ input, expected_output }) => {
            return {
                input: input,
                expectedOutput: expected_output,
            };
        });

        return filteredResults; // Return the array directly, without wrapping in an object
    } catch (error) {
        console.error('Error fetching test cases:', error.message);
        throw new Error('Database query error: ' + error.message);
    }
}