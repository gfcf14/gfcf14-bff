require('dotenv').config();
const { connectToDb, pool } = require('./configs/db.config');
const webDevToonsPostController = require('./controllers/webdevtoons/post.controller');
const cors = require('cors');
const express = require('express');

const allowedOrigins = process.env.FRONT_END_ORIGINS?.split(',') || [];
const corsOptions = {
  origin: function (origin, callback) {
    // Allow no-origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use('/api/webdevtoons', webDevToonsPostController);

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

startServer();
