// this will run before the route logic and check if a user is logged in

require('dotenv').config();
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  console.log('Auth header:', req.headers.authorization);
  const raw = req.headers.authorization;

  if (!raw) return res.status(401).json({ error: 'No token header' });

  const parts = raw.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Invalid token format' });
  }

  const token = parts[1];
  console.log('Raw token:', token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(err.name === 'TokenExpiredError' ? 401 : 403)
    .json({ error: 'Invalid or expired token' });
  }
};

module.exports = auth;
