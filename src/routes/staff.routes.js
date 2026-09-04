const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const {
  getDepartmentComplaints,
  updateStatus,
  uploadProgressPhoto,
} = require('../controllers/staff.controller');

router.use(verifyToken(['staff', 'hod']));

router.get('/complaints', getDepartmentComplaints);
router.patch('/complaints/:complaint_id/status', updateStatus);
router.post('/complaints/:complaint_id/photo', upload.single('photo'), uploadProgressPhoto);

module.exports = router;
