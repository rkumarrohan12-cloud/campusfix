const { pool, withTransaction } = require('../config/db');

async function createComplaint(req, res) {
  const { category_id, description, location } = req.body;
  const studentId = req.user.student_id;

  if (!category_id || !description) {
    return res.status(400).json({ error: 'category_id and description are required' });
  }

  try {
    // create_complaint() is SECURITY DEFINER, so it can write to
    // complaint_owner even though campusfix_app has no direct INSERT there.
    const complaintId = await withTransaction(async (client) => {
      const result = await client.query(
        'SELECT create_complaint($1, $2, $3, $4) AS complaint_id',
        [studentId, category_id, description, location || null]
      );
      return result.rows[0].complaint_id;
    }, studentId);

    if (req.file) {
      const imageUrl = `/uploads/${req.file.filename}`;
      await pool.query(
        `INSERT INTO complaint_images (complaint_id, image_url, stage, uploaded_by_role)
         VALUES ($1, $2, 'initial', 'student')`,
        [complaintId, imageUrl]
      );
    }

    // Fire-and-forget: hand off to your moderation worker/queue here, e.g.
    //   await moderationQueue.add({ complaintId });
    // It should write into ai_moderation_results and, if flagged,
    // INSERT INTO student_warnings - the DB trigger handles the rest.

    res.status(201).json({ complaint_id: complaintId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create complaint' });
  }
}

async function getMyComplaints(req, res) {
  const studentId = req.user.student_id;
  try {
    const rows = await withTransaction(async (client) => {
      const result = await client.query('SELECT * FROM v_student_complaints ORDER BY created_at DESC');
      return result.rows;
    }, studentId);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch complaints' });
  }
}

module.exports = { createComplaint, getMyComplaints };
