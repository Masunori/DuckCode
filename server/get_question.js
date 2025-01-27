import { pool } from './config/db.js';

export async function get_question(cur_point) {
    const point = parseInt(cur_point, 10);
    if (isNaN(point)) {
        throw new Error('Invalid cur_point value');
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
            const questionid = question.questionid;
            
            // get test case for question
            const testcaseQuery = `SELECT * FROM question.testcase WHERE questionid = ${questionid}`;
            const testcaseResult = await pool.query(testcaseQuery);
            const testcases = testcaseResult.rows;
            const mergedResponse = { ...splitFields(question), 
                                    testcases };
            return mergedResponse;
        }
    } catch (error) {
        throw new Error('Database query error: ' + error.message);
    }
}

// function to process the pure received json.
function splitFields(data) {
    const result = {
      title: data.title,
      difficulty: data.difficulty,
      description: data.description.split('\\n\\n').filter(Boolean),
      input_type: data.input_type.split('\\n\\n').filter(Boolean),
      output_type: data.output_type.split('\\n\\n').filter(Boolean),
      ques_constraint: data.ques_constraint.split('\\n\\n').filter(Boolean)
    };
    const exampleParts = data.example.split('\\n\\n').filter(Boolean);
    let currentExample = { input: [], output: [] };

    exampleParts.forEach((part, index) => {
        if (part.startsWith('Input:')) {
            currentExample.input.push(part.replace('Input: ', '').trim());
        } else if (part.startsWith('Output:')) {
            currentExample.output.push(part.replace('Output: ', '').trim());
        }
    });
    result.examples = currentExample;
    return result;
}
