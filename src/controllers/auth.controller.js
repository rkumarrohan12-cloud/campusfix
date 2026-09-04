const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { comparePassword } = require('../utils/hash');

async function studentLogin(req, res) {
  const { admission_number, password } = req.body;
  if (!admission_number || !password) {
    return res.status(400).json({ error: 'admission_number and password are required' });
  }

  try {
    const result = await pool.query(
      'SELECT student_id, password_hash, is_active FROM students WHERE admission_number = $1',
      [admission_number]
    );
    const student = result.rows[0];
    if (!student || !student.is_active) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await comparePassword(password, student.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { role: 'student', student_id: student.student_id },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
}

async function staffLogin(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  try {
    const result = await pool.query(
      'SELECT staff_id, password_hash, department_id, designation, is_active FROM staff WHERE email = $1',
      [email]
    );
    const staff = result.rows[0];
    if (!staff || !staff.is_active) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await comparePassword(password, staff.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        role: staff.designation === 'hod' ? 'hod' : 'staff',
        staff_id: staff.staff_id,
        department_id: staff.department_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
}

async function officialLogin(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  try {
    const result = await pool.query(
      'SELECT official_id, password_hash FROM officials WHERE email = $1',
      [email]
    );
    const official = result.rows[0];
    if (!official) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await comparePassword(password, official.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { role: 'official', official_id: official.official_id },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
}

module.exports = { studentLogin, staffLogin, officialLogin };
