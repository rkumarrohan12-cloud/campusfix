import express from 'express';
const router = express.Router();
import { verifyToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import {
  getDepartmentComplaints,
  updateStatus,
  uploadProgressPhoto,
} from '../controllers/staff.controller.js';

router.use(verifyToken(['staff', 'hod']));

router.get('/complaints', getDepartmentComplaints);
router.patch('/complaints/:complaint_id/status', updateStatus);
router.post('/complaints/:complaint_id/photo', upload.single('photo'), uploadProgressPhoto);

export default router;
