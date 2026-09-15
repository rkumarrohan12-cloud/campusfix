import express from 'express';
const router = express.Router();
import { verifyToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { createComplaint, getMyComplaints } from '../controllers/student.controller.js';

router.use(verifyToken('student'));

router.post('/complaints', upload.single('photo'), createComplaint);
router.get('/complaints', getMyComplaints);

export default router;
