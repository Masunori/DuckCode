import express from 'express';
import { submitCode, runAllTestCase, runCodeOnly } from '../controllers/codeController.js';

const router = express.Router();   
router.post('/submit_code', submitCode);
router.post('/run_all_test_case', runAllTestCase);
router.post('/run_code_only', runCodeOnly);

export default router;