const express = require('express');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../../utils/jwt.util');
const { findUserByUsername } = require('../../services/user/user.service');

const router = express.Router();

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  const user = await findUserByUsername(username);

  if (user) {
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const token = generateToken(username, true);
      return res.json({ token });
    }
  }

  return res.status(401).send('Invalid credentials');
});

module.exports = router;
