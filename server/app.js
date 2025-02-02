import express from 'express';
import dotenv from 'dotenv';
import { get_question } from './get_question.js'; // Import the function
import { submit_code, run_all_test_case, run_code_only } from './execute_code.js'; // Import the function

dotenv.config();

const app = express();
app.use(express.json()); 


app.get('/get_question', async (req, res) => {
    try {
        const { cur_point } = req.query;

        if (!cur_point) {
            return res.status(400).json({ error: 'cur_point is required' });
        }

        // Call the function to get the question based on cur_point
        const questions = await get_question(cur_point);
        console.log(questions);
        res.json(questions);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});
app.post('/submit_code', async (req, res) => {
    try {
        const { question_id, source_code, language_id } = req.body;

        // check for input validation
        if (!question_id || !source_code || !language_id) {
            return res.status(400).json({
                error: 'Missing required fields: question_id, source_code, language_id',
            });
        }
        const results = await submit_code(question_id, source_code, language_id);
        res.json({ success: true, results });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});
app.post('/run_all_test_case', async (req, res) => {
    try {
        const { question_id, source_code, language_id } = req.body;

        // check for input validation
        if (!question_id || !source_code || !language_id) {
            return res.status(400).json({
                error: 'Missing required fields: question_id, source_code, language_id',
            });
        }
        const results = await run_all_test_case(question_id, source_code, language_id);
        res.json({success: true, results });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});
app.post('/run_code_only', async (req, res) => {
    try {
        const { source_code, language_id } = req.body;

        // check for input validation
        if (!source_code || !language_id) {
            return res.status(400).json({
                error: 'Missing required fields: source_code, language_id',
            });
        }
        const results = await run_code_only(source_code, language_id);
        res.json({ success: true, results });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
