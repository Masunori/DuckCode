import questionService from '../services/questionService.js';
const questionController = {
    async getQuestionFromID(req, res) {
        const { question_id } = req.query;
        if (!question_id) {
            return res.status(422).json({ error: 'Question ID is required' });
        }
        try {
            const question = await questionService.getQuestionByID(question_id);
            if (!question) {
                return res.status(404).json({ error: 'Question not found' });
            }
            res.status(200).json(question);
        } catch (error) {
            console.error('Error fetching question:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async getRandomQuestion(req, res) {
        try {
            const question = await questionService.getRandomQuestion();
            if (!question) {
                return res.status(404).json({ error: 'No questions available' });
            }
            res.status(200).json(question);
        }
        catch (error) {
            console.error('Error fetching random question:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async getQuestionByDifficulty(req, res) {
        console.log("Inside getQuestionByDifficulty controller", req.params);
        const { difficulty } = req.query;
        console.log("Requested difficulty: ", difficulty);
        if (!difficulty) {
            return res.status(422).json({ error: 'Difficulty level is required' });
        }
        try {
            const question = await questionService.getQuestionByDifficulty(difficulty);
            if (!question) {
                return res.status(404).json({ error: 'No questions found for the specified difficulty' });
            }
            res.status(200).json(question);
        } catch (error) {
            console.error('Error fetching question by difficulty:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};
export default questionController;