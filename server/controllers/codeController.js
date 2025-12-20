import { submitCode as submitCodeService, runAllTestCase as runAllTestCaseService, runCodeOnly as runCodeOnlyService } from "../services/executeCode.js";

export const submitCode = async (req, res) => { 
    try {
        const {qid, sourceCode, languageId} = req.body;
        if(!qid || !sourceCode || !languageId) {
            return res.status(400).json({
                error: 'Missing required fields: question_id, source_code, language_id',
            });
        }
        const result = await submitCodeService(qid, sourceCode, languageId);
        res.json( { result });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal server error'});
    }
};

export const runAllTestCase = async (req, res) => {
    try {
        const {qid, sourceCode, languageId} = req.body;
        if(!qid || !sourceCode || !languageId) {
            return res.status(400).json({
                error: 'Missing required fields: question_id, source_code, language_id',
            });
        }
        const result = await runAllTestCaseService(qid, sourceCode, languageId);
        res.json({ result });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal server error'});
    }
};

export const runCodeOnly = async (req, res) => {
    try {
        const {sourceCode, languageId} = req.body;
        if(!sourceCode || !languageId) {
            return res.status(400).json({
                error: 'Missing required fields: source_code, language_id',
            });
        }
        const result = await runCodeOnlyService(sourceCode, languageId);
        res.json({ output: result });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal server error'});
    }
};