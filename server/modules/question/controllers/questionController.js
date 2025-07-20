const questionController = {
    async getQuestionFromID(req, res) {
        const {questionid} = req.params;
        if (!questionid) {
            return res.status(422).json({ error: 'Question ID is required' });
        }
        try {
            const question = await getQuestionService(questionid);
            if (!question) {
                return res.status(404).json({ error: 'Question not found' });
            }
            res.status(200).json(question);
        } catch (error) {
            console.error('Error fetching question:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};
export default questionController;