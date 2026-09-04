const { pool } = require('../config/db');

async function getOverallStats(req, res) {
  try {
    const result = await pool.query('SELECT * FROM v_overall_stats');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch stats' });
  }
}

async function getDepartmentPerformance(req, res) {
  try {
    const result = await pool.query('SELECT * FROM v_department_performance ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch department performance' });
  }
}

// Used by an HOD, not a general official - kept here since it's also a
// "look at aggregated/escalated data" endpoint. Gate this route with
// verifyToken('hod') in routes, and log access - it's the one screen
// in the whole system that shows student identity.
async function getMisconductQueue(req, res) {
  const { staff_id } = req.user;
  try {
    const result = await pool.query(
      `SELECT report_id, student_id, warning_count, status, generated_at
       FROM misconduct_reports
       WHERE sent_to_hod_id = $1 AND status = 'pending_review'
       ORDER BY generated_at ASC`,
      [staff_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch misconduct queue' });
  }
}

module.exports = { getOverallStats, getDepartmentPerformance, getMisconductQueue };
