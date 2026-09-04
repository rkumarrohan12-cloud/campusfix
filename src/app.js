const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const studentRoutes = require('./routes/student.routes');
const staffRoutes = require('./routes/staff.routes');
const officialRoutes = require('./routes/official.routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/official', officialRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// last-resort error handler (e.g. multer file-type rejections)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).json({ error: err.message || 'Something went wrong' });
});

module.exports = app;
