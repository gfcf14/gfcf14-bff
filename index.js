require('dotenv').config();
const { connectToDb } = require('./configs/db.config');
const authController = require('./controllers/auth/auth.controller');
const webDevToonsPostController = require('./controllers/webdevtoons/post.controller');
const gfcf14ArtArtworkController = require('./controllers/gfcf14-art/artwork.controller');
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use('/api/webdevtoons', webDevToonsPostController);
app.use('/api/gfcf14-art', gfcf14ArtArtworkController);
app.use('/api/login', authController);

app.get('/', (req, res) => {
  res.send('GFCF14 Shared Backend App is live');
});

async function startServer() {
  const port = process.env.PORT || 5000;
  app.listen({ port }, () =>
    console.log(`✨ Server ready at http://localhost:${port}`)
  );
  connectToDb();
}

startServer();
