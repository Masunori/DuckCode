import express from 'express';
import dotenv from 'dotenv';
import { get_question } from './get_question.js'; // Import the function

dotenv.config();

const app = express();

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
