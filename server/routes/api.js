import express from 'express';
import 'express-router-group';
import authController from '../modules/auth/controllers/authController.js';
import questionController from '../modules/question/controllers/questionController.js';
import codeController from '../modules/execute-code/controllers/codeController.js';
import userPreferencesController from '../modules/user-preferences/controllers/userPreferencesController.js';
import middlewares from '../kernels/middlewares/index.js';
import authenticated from '../kernels/middlewares/authMiddlewares.js';
import passport from 'passport';
import oauthController from '../modules/oauth/controllers/oauthController.js';
const router = express.Router({ mergeParams: true });

router.group('/auth', (router) => {
    router.post('/login', authController.login);
    router.post('/register', authController.register);
    router.post('/verify-otp', authController.verifyOTP);
    router.post('/request-otp', authController.requestOTP);
    router.post('/reset-password', authController.resetPassword);
    router.get('/me', middlewares([authenticated]), authController.getSessionInfo);
    router.group('/oauth', (router) => {
        router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
        router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: false }), oauthController.googleCallback);
        router.get('/github', passport.authenticate('github', { scope: ['profile', 'user:email'] }));
    });
    router.post('/refresh-token', authController.refreshToken);
    // router.post('/signout', middlewares([authenticated]), authController.logout);
});
router.group('/question', middlewares([authenticated]), (router) => {
    router.get('/get_question', questionController.getQuestionFromID);
    router.get('/get_random_question', questionController.getRandomQuestion);
    router.get('/get_question_by_difficulty', questionController.getQuestionByDifficulty);
});
router.group('/execute', middlewares([authenticated]), (router) => {
    router.post('/execute-code', codeController.executeCode);
    router.post('/run-all-test-cases', codeController.runTestCases);
    router.post('/submit-code', codeController.submitCode);
});
router.put('/update-preferences', middlewares([authenticated]), userPreferencesController.setUserPreferences);
export default router;