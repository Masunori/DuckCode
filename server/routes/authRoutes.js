import express from 'express';
import { logIn, register } from '../controllers/authController.js';

const router = express.Router();
router.post('/login', logIn);
router.post('/register', register);

export default router;