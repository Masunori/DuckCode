import e from "express";
import codeExecutionService from "../services/codeExecutionService";
const codeController = {
    async executeCode(req, res) {
        const { sourceCode, languageId } = req.body;
        try {
            const result = await codeExecutionService.executeCode(sourceCode, languageId);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error executing code:', error);
            res.status(500).json({ error: error.message });
        }
    },
    async runTestCases(req, res) {
        const { questionId, sourceCode, languageId } = req.body;
        try {
            const results = await codeExecutionService.runTestCases(questionId, sourceCode, languageId);
            res.status(200).json(results);
        } catch (error) {
            console.error('Error running test cases:', error);
            res.status(500).json({ error: error.message });
        }
    },
    async submitCode(req, res) {
        const { sourceCode, languageId, questionId } = req.body;
        try {
            const result = await codeExecutionService.submitCode(sourceCode, languageId, questionId);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error submitting code:', error);
            res.status(500).json({ error: error.message });
        }
    }
};
export default codeController;