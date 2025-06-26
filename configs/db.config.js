const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

const connectToDb = async () => {
  try {
    const client = await pool.connect();
    console.log('🟢 Connected to PostgreSQL');
    client.release(); // release the client after initial test
  } catch (err) {
    console.error('🔴 DB connection error:', err.stack);
  }
};

module.exports = {
  pool,
  connectToDb,
};
