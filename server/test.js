import express from 'express';
import dotenv from 'dotenv';
import { run_all_test_case, submit_code } from './execute_code.js'; 

dotenv.config(); 

const app = express();
app.use(express.json()); 

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
// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
