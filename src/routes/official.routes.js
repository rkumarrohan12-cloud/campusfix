import express from 'express';
const router = express.Router();
import { verifyToken } from '../middleware/auth.js';
import {
  getOverallStats,
  getDepartmentPerformance,
  getMisconductQueue,
} from '../controllers/official.controller.js';

router.get('/stats/overall', verifyToken('official'), getOverallStats);
router.get('/stats/departments', verifyToken('official'), getDepartmentPerformance);

// HOD-only: the one screen that shows student identity
router.get('/misconduct-queue', verifyToken('hod'), getMisconductQueue);

export default router;
