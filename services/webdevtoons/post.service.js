const { pool } = require("../../configs/db.config");

async function getAllPosts() {
  const result = await pool.query(`
    SELECT
      p.date,
      p.title,
      p.description,
      p.image,
      json_agg(json_build_object('type', l.type, 'url', l.url)) AS links
    FROM posts p
    LEFT JOIN post_links l ON p.date = l.post_date
    GROUP BY p.date, p.title, p.description, p.image
    ORDER BY p.date DESC
  `);

  return result.rows;
}

async function getPost(date) {
  const result = await pool.query(`
    SELECT
      p.date,
      p.title,
      p.description,
      p.image,
      json_agg(json_build_object('type', l.type, 'url', l.url)) AS links
    FROM posts p
    LEFT JOIN post_links l ON p.date = l.post_date
    WHERE p.date = $1
    GROUP BY p.date, p.title, p.description, p.image
  `, [date]);

  return result.rows[0];
}

async function createPost(post) {
  const { date, title, description, image, links } = post;

  const insertPostQuery = `
    INSERT INTO posts (date, title, description, image)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  await pool.query(insertPostQuery, [date, title, description, image]);

  // Insert associated links if provided
  if (Array.isArray(links) && links.length > 0) {
    const insertLinksQuery = `
      INSERT INTO post_links (post_date, type, url)
      VALUES ${links.map((_, i) => `($1, $${i * 2 + 2}, $${i * 2 + 3})`).join(', ')}
    `;

    const linkValues = links.flatMap(link => [link.type, link.url]);
    await pool.query(insertLinksQuery, [date, ...linkValues]);
  }

  res.status(201).json({
    message: `Post "${createdPost.title}" successfully created`
  });
};

module.exports = {
  createPost,
  getPost,
  getAllPosts
};
