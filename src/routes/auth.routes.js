import express from 'express';
const router = express.Router();
import { studentLogin, staffLogin, officialLogin } from '../controllers/auth.controller.js';

router.post('/student/login', studentLogin);
router.post('/staff/login', staffLogin);
router.post('/official/login', officialLogin);

export default router;
