const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
  getOverallStats,
  getDepartmentPerformance,
  getMisconductQueue,
} = require('../controllers/official.controller');

router.get('/stats/overall', verifyToken('official'), getOverallStats);
router.get('/stats/departments', verifyToken('official'), getDepartmentPerformance);

// HOD-only: the one screen that shows student identity
router.get('/misconduct-queue', verifyToken('hod'), getMisconductQueue);

module.exports = router;
