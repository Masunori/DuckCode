import db from '../../../models/index.js';
const questionService = {
    async getQuestionByID(questionid) {
        const question = await db.Question.findByPk(questionid, {
            include: [
                {
                    model: db.Testcase,
                    as: 'testcases',
                    where: { ispublic: true }
                }
            ]
        });
        if(!question) {
            throw new Error('Question not found');
        }
        const data = {
            qid: question.questionid,
            title: question.title,
            difficulty: question.difficulty,
            description: question.description.split('\\n\\n').filter(Boolean),
            input: question.input_type.split('\\n\\n').filter(Boolean),
            output: question.output_type.split('\\n\\n').filter(Boolean),
            examples: [],
            constraints: question.ques_constraint.split('\\n\\n').filter(Boolean),
            publicTestCases: question.testcases.map(tc => ({
                tid: tc.testcaseid,
                input: tc.input,
                expectedOutput: tc.expected_output,
            }))
        };
        const exampleParts = question.example.split('\\n\\n').filter(Boolean);
        let currentExample = { input: [], output: [], explanation: '' };
        exampleParts.forEach((part) => {
            if (part.startsWith('Input:')) {
                currentExample.input.push(part.replace('Input: ', '').trim());
            } else if (part.startsWith('Output:')) {
                currentExample.output.push(part.replace('Output: ', '').trim());
            } else if (part.startsWith('Explanation:')) {
                currentExample.explanation = part.replace('Explanation: ', '').trim();
            }

            // Push the current example to examples array when input and output are both populated
            if (currentExample.input.length && currentExample.output.length) {
                data.examples.push({ ...currentExample });
                currentExample = { input: [], output: [], explanation: '' }; // Reset for the next example
            }
        });
        // Ensure examples is an array
        if (!Array.isArray(data.examples)) {
            throw new Error('Expected examples to be an array, but got something else.');
        }
        return data;
    },
    async getRandomQuestion() {
        const question = await db.Question.findOne({
            order: db.sequelize.random(),
            include: [
                {
                    model: db.Testcase,
                    as: 'testcases',
                    where: { ispublic: true }
                }
            ]
        });
        console.log('Randomly selected question:', question);
        if(!question) {
            throw new Error('No questions available');
        }
        const data = {
            qid: question.questionid,
            title: question.title,
            difficulty: question.difficulty,
            description: question.description.split('\\n\\n').filter(Boolean),
            input: question.input_type.split('\\n\\n').filter(Boolean),
            output: question.output_type.split('\\n\\n').filter(Boolean),
            examples: [],
            constraints: question.ques_constraint.split('\\n\\n').filter(Boolean),
            publicTestCases: question.testcases.map(tc => ({
                tid: tc.testcaseid,
                input: tc.input,
                expectedOutput: tc.expected_output,
            }))
        };
        const exampleParts = question.example.split('\\n\\n').filter(Boolean);
        let currentExample = { input: [], output: [], explanation: '' };
        exampleParts.forEach((part) => {
            if (part.startsWith('Input:')) {
                currentExample.input.push(part.replace('Input: ', '').trim());
            } else if (part.startsWith('Output:')) {
                currentExample.output.push(part.replace('Output: ', '').trim());
            } else if (part.startsWith('Explanation:')) {
                currentExample.explanation = part.replace('Explanation: ', '').trim();
            }
            // Push the current example to examples array when input and output are both populated
            if (currentExample.input.length && currentExample.output.length) {
                data.examples.push({ ...currentExample });
                currentExample = { input: [], output: [], explanation: '' }; // Reset for the next example
            }
        });
        // Ensure examples is an array
        if (!Array.isArray(data.examples)) {
            throw new Error('Expected examples to be an array, but got something else.');
        }
        return data;
    },
    async getQuestionByDifficulty(difficulty) {
        // get question in difficulty in range +- 500
        const question = await db.Question.findOne({
            where: {
                difficulty: {
                    [db.Sequelize.Op.between]: [difficulty - 1000, difficulty + 1000]
                }
            },
            include: [
                {
                    model: db.Testcase,
                    as: 'testcases',
                    where: { ispublic: true }
                }
            ],
            order: db.sequelize.random(),
        });
        if (!question) {
            throw new Error('No questions found for the specified difficulty');
        }
        const data = {
            qid: question.questionid,
            title: question.title,
            difficulty: question.difficulty,
            description: question.description.split('\\n\\n').filter(Boolean),
            input: question.input_type.split('\\n\\n').filter(Boolean),
            output: question.output_type.split('\\n\\n').filter(Boolean),
            examples: [],
            constraints: question.ques_constraint.split('\\n\\n').filter(Boolean),
            publicTestCases: question.testcases.map(tc => ({
                tid: tc.testcaseid,
                input: tc.input,
                expectedOutput: tc.expected_output,
            }))
        };
        const exampleParts = question.example.split('\\n\\n').filter(Boolean);
        let currentExample = { input: [], output: [], explanation: '' };
        exampleParts.forEach((part) => {
            if (part.startsWith('Input:')) {
                currentExample.input.push(part.replace('Input: ', '').trim());
            } else if (part.startsWith('Output:')) {
                currentExample.output.push(part.replace('Output: ', '').trim());
            } else if (part.startsWith('Explanation:')) {
                currentExample.explanation = part.replace('Explanation: ', '').trim();
            }
            // Push the current example to examples array when input and output are both populated
            if (currentExample.input.length && currentExample.output.length) {
                data.examples.push({ ...currentExample });
                currentExample = { input: [], output: [], explanation: '' }; // Reset for the next example
            }
        });
        // Ensure examples is an array
        if (!Array.isArray(data.examples)) {
            throw new Error('Expected examples to be an array, but got something else.');
        }
        return data;
    }
};
export default questionService;