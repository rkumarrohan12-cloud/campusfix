const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle DB client', err);
});

/**
 * Runs `fn(client)` inside a single transaction.
 *
 * If `studentId` is provided, sets the `app.current_student_id` session
 * variable for the DURATION OF THIS TRANSACTION ONLY (SET LOCAL semantics
 * via set_config's third arg = true). This is what the Row-Level Security
 * policies on `students` and `complaint_owner` check against - without it,
 * a student session sees zero rows in either table.
 *
 * Always use this (not the raw pool) for any query that touches
 * complaint_owner or students on behalf of a logged-in student.
 */
async function withTransaction(fn, studentId = null) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    if (studentId) {
      // Parameterized - never string-interpolate the id into SQL directly.
      await client.query(`SELECT set_config('app.current_student_id', $1, true)`, [studentId]);
    }
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { pool, withTransaction };
