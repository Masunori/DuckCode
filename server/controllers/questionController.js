import { getQuestion as getQuestionService } from '../services/getQuestion.js';

export const getQuestion = async (req, res) => {
    try {
        const {cur_point} = req.query;
        if(!cur_point) {
            return res.status(400).json({ error: 'cur_point is required' });
        }
        const question = await getQuestionService(cur_point);
        res.json(question);
    } catch (error) {
        console.error('Error fetching question:', error.message);
        res.status(500).json({ error: 'Internal server error'}); 
    }
};