const jwt = require('jsonwebtoken');
const TOKEN_TIME_LIMIT = 15 * 60 * 1000; // 15 minutes

function generateToken(username, canPost) {
  return jwt.sign({
    sub: username,
    canPost,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor((Date.now() + TOKEN_TIME_LIMIT) / 1000)
  }, process.env.JWT_SECRET);
}

function validateTokenAndGetUsername(token) {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload.sub;
  } catch (err) {
    return null;
  }
}

function isTokenValid(token) {
  return validateTokenAndGetUsername(token) !== null;
}

function canPost(token) {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return !!payload.canPost;
  } catch (err) {
    return false;
  }
}

module.exports = {
  generateToken,
  validateTokenAndGetUsername,
  isTokenValid,
  canPost
};
