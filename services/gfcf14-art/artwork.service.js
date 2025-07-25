const { pool } = require("../../configs/db.config");

async function getAllArtworks() {
  const result = await pool.query(`
    SELECT
      p.date,
      p.title,
      p.description,
      p.image,
      json_agg(json_build_object('type', l.type, 'url', l.url)) AS links
    FROM artworks p
    LEFT JOIN artwork_links l ON p.date = l.artwork_date
    GROUP BY p.date, p.title, p.description, p.image
    ORDER BY p.date DESC
  `);

  return result.rows;
}

async function getArtwork(date) {
  const result = await pool.query(`
    SELECT
      p.date,
      p.title,
      p.description,
      p.image,
      json_agg(json_build_object('type', l.type, 'url', l.url)) AS links
    FROM artworks p
    LEFT JOIN artwork_links l ON p.date = l.artwork_date
    WHERE p.date = $1
    GROUP BY p.date, p.title, p.description, p.image
  `, [date]);

  return result.rows[0];
}



async function findClosestArtworkOnOrBefore(date) {
  const query = `
    SELECT
      p.date,
      p.title,
      p.description,
      p.image,
      COALESCE(json_agg(json_build_object('type', l.type, 'url', l.url)) FILTER (WHERE l.type IS NOT NULL), '[]') AS links
    FROM artworks p
    LEFT JOIN artwork_links l ON p.date = l.artwork_date
    WHERE p.date <= $1
    GROUP BY p.date, p.title, p.description, p.image
    ORDER BY p.date DESC
    LIMIT 1;
  `;
  const result = await pool.query(query, [date]);
  return result.rows[0] || null;
}

async function findEarliestArtwork() {
  const query = `
    SELECT
      p.date,
      p.title,
      p.description,
      p.image,
      COALESCE(json_agg(json_build_object('type', l.type, 'url', l.url)) FILTER (WHERE l.type IS NOT NULL), '[]') AS links
    FROM artworks p
    LEFT JOIN artwork_links l ON p.date = l.artwork_date
    GROUP BY p.date, p.title, p.description, p.image
    ORDER BY p.date ASC
    LIMIT 1;
  `;
  const result = await pool.query(query);
  return result.rows[0] || null;
}

async function createArtwork(artwork) {
  const { date, title, description, image, links } = artwork;

  const insertArtworkQuery = `
    INSERT INTO artworks (date, title, description, image)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  await pool.query(insertArtworkQuery, [date, title, description, image]);

  // Insert associated links if provided
  if (Array.isArray(links) && links.length > 0) {
    const insertLinksQuery = `
      INSERT INTO artwork_links (artwork_date, type, url)
      VALUES ${links.map((_, i) => `($1, $${i * 2 + 2}, $${i * 2 + 3})`).join(', ')}
    `;

    const linkValues = links.flatMap(link => [link.type, link.url]);
    await pool.query(insertLinksQuery, [date, ...linkValues]);
  }

  return {
    message: `Artwork "${title}" successfully created`
  };
};

module.exports = {
  createArtwork,
  getArtwork,
  getAllArtworks,
  findClosestArtworkOnOrBefore,
  findEarliestArtwork
};
