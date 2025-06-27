const express = require('express');
const router = express.Router();
const postService = require('../../services/webdevtoons/post.service');
const { isTokenValid, canPost } = require('../../utils/jwt.util');

router.get('/posts', async (req, res) => {
  try {
    const posts = await postService.getAllPosts();
    res.json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).send('Internal server error');
  }
});

router.get('/posts/:date', async (req, res) => {
  const { date } = req.params;
  try {
    let post = await postService.findClosestPostOnOrBefore(date);

    if (!post) {
      post = await postService.findEarliestPost();
    }

    if (post) {
      res.json(post);
    } else {
      res.status(404).send('Post not found');
    }
  } catch (err) {
    console.error('Error fetching post:', err);
    res.status(500).send('Internal server error');
  }
});

router.post('/posts', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Missing or invalid token format');
  }

  const token = authHeader.slice(7); // Remove "Bearer "
  if (!isTokenValid(token) || !canPost(token)) {
    return res.status(403).send('Invalid or expired token');
  }

  try {
    const newPost = await postService.createPost(req.body);
    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create post');
  }
});

module.exports = router;
