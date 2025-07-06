const jwt = require('jsonwebtoken');

function generateAccessToken(user) {
  return jwt.sign(
    { _id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { _id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
}

module.exports = { generateAccessToken, generateRefreshToken };
