const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const User = require('../models/User');
require('dotenv').config();

const { generateAccessToken, generateRefreshToken } = require('../middleware/tokens');

const router = express.Router();
router.use(cookieParser());

// Register new users
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });
    res.status(201).json({ message: 'User created', userId: user._id });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Failed to register' });
  }
});

// Login user and issue tokens
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    // Send refresh token securely in cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/api/auth/refresh-token'
    });

    res.status(200).json({ accessToken });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Refresh access token endpoint
router.post('/refresh-token', async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ error: 'No refresh token' });

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload._id);
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false,        // true if HTTPS and production
    sameSite: 'none',     // needed for cross-domain access in modern browsers
    path: '/api/auth/refresh-token',
    maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ accessToken });
  } catch (err) {
    console.error('Refresh token error:', err);
    res.status(403).json({ error: 'Invalid refresh token' });
  }
});

module.exports = router;