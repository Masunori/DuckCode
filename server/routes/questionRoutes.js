import express from 'express';
import { getQuestion } from '../controllers/questionController.js';
const router = express.Router();

router.get('/get_question', getQuestion);

export default router;