const express = require('express');
const router = express.Router();
const artworkService = require('../../services/gfcf14-art/artwork.service');
const { isTokenValid, canPost } = require('../../utils/jwt.util');
const artworkSchema = require('../../schemas/artwork.schema');

router.get('/artworks', async (req, res) => {
  try {
    const artworks = await artworkService.getAllArtworks();
    res.json(artworks);
  } catch (err) {
    console.error('Error fetching artworks:', err);
    res.status(500).send('Internal server error');
  }
});

router.get('/artworks/:date', async (req, res) => {
  const { date } = req.params;
  try {
    let artwork = await artworkService.findClosestArtworkOnOrBefore(date);

    if (!artwork) {
      artwork = await artworkService.findEarliestArtwork();
    }

    if (artwork) {
      res.json(artwork);
    } else {
      res.status(404).send('Artwork not found');
    }
  } catch (err) {
    console.error('Error fetching artwork:', err);
    res.status(500).send('Internal server error');
  }
});

router.post('/artworks', async (req, res) => {
  const { error } = artworkSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Missing or invalid token format');
  }

  const token = authHeader.slice(7); // Remove "Bearer "
  if (!isTokenValid(token) || !canPost(token)) {
    return res.status(403).send('Invalid or expired token');
  }

  try {
    const newArtwork = await artworkService.createArtwork(req.body);
    res.status(201).json(newArtwork);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create artwork');
  }
});

module.exports = router;
