import express from 'express';
import dotenv from 'dotenv';
import { getQuestion } from './get_question.js'; // Import the function
import { submitCode, runAllTestCase, runCodeOnly } from './execute_code.js'; // Import the function
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json()); 
app.use(cors());

app.get('/get_question', async (req, res) => {
    try {
        const { cur_point } = req.query;

        if (!cur_point) {
            return res.status(400).json({ error: 'cur_point is required' });
        }

        // Call the function to get the question based on cur_point
        const questions = await getQuestion(cur_point);
        console.log(questions);
        res.json(questions);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});
app.post('/submit_code', async (req, res) => {
    try {
        const { qid, sourceCode, languageId } = req.body;

        // check for input validation
        if (!qid || !sourceCode || !languageId) {
            return res.status(400).json({
                error: 'Missing required fields: question_id, source_code, language_id',
            });
        }
        const results = await submitCode(qid, sourceCode, languageId);
        res.json({ results });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});
app.post('/run_all_test_case', async (req, res) => {
    try {
        const { qid, sourceCode, languageId } = req.body;

        // check for input validation
        if (!qid || !sourceCode || !languageId) {
            return res.status(400).json({
                error: 'Missing required fields: question_id, source_code, language_id',
            });
        }
        const results = await runAllTestCase(qid, sourceCode, languageId);
        res.json({results});
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});
app.post('/run_code_only', async (req, res) => {
    try {
        const { sourceCode, languageId } = req.body;

        // check for input validation
        if (!sourceCode || !languageId) {
            return res.status(400).json({
                error: 'Missing required fields: source_code, language_id',
            });
        }
        const results = await runCodeOnly(sourceCode, languageId);
        res.json({output: results});
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
