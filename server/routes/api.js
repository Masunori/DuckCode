import express from 'express';
import 'express-router-group';
import validate from "../kernels/validations/index.js";

import authController from '../modules/auth/controllers/authController.js';
import authValidation from '../modules/auth/validations/authValidation.js';

const router = express.Router({ mergeParams: true });

router.group('/auth', (router) => {
    router.post('/login', authController.login);
    router.post('/register', authController.register);
    router.post('/verify-otp', authController.verifyOTP);
});
export default router;