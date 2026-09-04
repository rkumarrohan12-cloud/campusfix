const { pool } = require('../config/db');

async function getDepartmentComplaints(req, res) {
  const { department_id } = req.user;
  try {
    const result = await pool.query(
      'SELECT * FROM v_department_complaints WHERE department_id = $1 ORDER BY created_at DESC',
      [department_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch complaints' });
  }
}

const ALLOWED_STATUSES = ['under_review', 'in_progress', 'resolved', 'rejected'];

async function updateStatus(req, res) {
  const { complaint_id } = req.params;
  const { status, note } = req.body;
  const { staff_id, department_id } = req.user;

  if (!ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${ALLOWED_STATUSES.join(', ')}` });
  }

  try {
    const check = await pool.query('SELECT department_id FROM complaints WHERE complaint_id = $1', [
      complaint_id,
    ]);
    if (!check.rows[0]) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    if (check.rows[0].department_id !== department_id) {
      return res.status(403).json({ error: 'Not your department' });
    }

    await pool.query('UPDATE complaints SET status = $1 WHERE complaint_id = $2', [status, complaint_id]);

    // the status-change trigger already inserted the log row; attach who/why to it
    await pool.query(
      `UPDATE complaint_status_log
       SET changed_by_staff_id = $1, note = $2
       WHERE log_id = (
         SELECT log_id FROM complaint_status_log
         WHERE complaint_id = $3 ORDER BY changed_at DESC LIMIT 1
       )`,
      [staff_id, note || null, complaint_id]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update status' });
  }
}

async function uploadProgressPhoto(req, res) {
  const { complaint_id } = req.params;
  const { stage } = req.body; // 'in_progress' or 'resolved'
  const { staff_id } = req.user;

  if (!req.file) {
    return res.status(400).json({ error: 'photo file is required' });
  }
  if (!['in_progress', 'resolved'].includes(stage)) {
    return res.status(400).json({ error: "stage must be 'in_progress' or 'resolved'" });
  }

  try {
    const imageUrl = `/uploads/${req.file.filename}`;
    await pool.query(
      `INSERT INTO complaint_images (complaint_id, image_url, stage, uploaded_by_role, uploaded_by_staff_id)
       VALUES ($1, $2, $3, 'staff', $4)`,
      [complaint_id, imageUrl, stage, staff_id]
    );
    res.status(201).json({ ok: true, image_url: imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not upload photo' });
  }
}

module.exports = { getDepartmentComplaints, updateStatus, uploadProgressPhoto };
