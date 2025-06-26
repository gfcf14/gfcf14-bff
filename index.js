require('dotenv').config();
const express = require('express');
const { connectToDb, pool } = require('./configs/db.config');

const app = express();

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('GFCF14 BFF is live');
});

async function startServer() {
  const port = process.env.PORT || 5000;
  app.listen({ port }, () =>
    console.log(`✨ Server ready at http://localhost:${port}`)
  );
  connectToDb();
}

app.get('/api/webdevtoons/posts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts ORDER BY date DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch posts');
  }
});

startServer();