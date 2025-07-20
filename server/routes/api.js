import express from 'express';
import 'express-router-group';
import authController from '../modules/auth/controllers/authController.js';
import questionController from '../modules/question/controllers/questionController.js';
import codeController from '../modules/execute-code/controllers/codeController.js';

const router = express.Router({ mergeParams: true });

router.group('/auth', (router) => {
    router.post('/login', authController.login);
    router.post('/register', authController.register);
    router.post('/verify-otp', authController.verifyOTP);
});
router.group('/question', (router) => {
    router.get('/get_question/:questionid', questionController.getQuestionFromID);
});
router.group('/execute', (router) => {
    router.post('/execute-code', codeController.executeCode);
    router.post('/run-all-test-cases', codeController.runTestCases);
    router.post('/submit-code', codeController.submitCode);
});
export default router;