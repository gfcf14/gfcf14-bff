const { pool } = require("../../configs/db.config");

async function findUserByUsername(username) {
  const result = await pool.query(
    'SELECT * FROM users WHERE username = $1',
    [username]
  );

  return result.rows[0] || null;
}

module.exports = { findUserByUsername };
