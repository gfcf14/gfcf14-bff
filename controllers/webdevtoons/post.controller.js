const express = require('express');
const router = express.Router();
const postService = require('../../services/webdevtoons/post.service');

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
    const post = await postService.getPost(date);
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
  try {
    const newPost = await postService.createPost(req.body);
    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create post');
  }
});

module.exports = router;
