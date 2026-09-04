const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { createComplaint, getMyComplaints } = require('../controllers/student.controller');

router.use(verifyToken('student'));

router.post('/complaints', upload.single('photo'), createComplaint);
router.get('/complaints', getMyComplaints);

module.exports = router;
