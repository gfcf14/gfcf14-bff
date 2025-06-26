const { pool } = require("../../configs/db.config");

async function getAllPosts() {
  const result = await pool.query('SELECT * FROM posts ORDER BY date DESC');
  return result.rows;
}

async function getPost(date) {
  const result = await pool.query('SELECT * FROM posts WHERE date = $1', [date]);
  return result.rows[0] || null;
}

async function createPost(post) {
  const { date, title, description, image } = post;

  const query = `
    INSERT INTO posts (date, title, description, image)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [date, title, description, image];

  const result = await pool.query(query, values);

  return result.rows[0];
};

module.exports = {
  createPost,
  getPost,
  getAllPosts
};
