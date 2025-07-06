const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashed });
    res.status(201).json({ message: 'User created', userId: newUser._id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to register' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    const user = await User.findOne({ username });
    if (!user){      
        console.error('Login failed: user not found');
        return res.status(401).json({ error: 'Invalid credentials' });
    } 

    const match = await bcrypt.compare(password, user.password);
    if (!match){
        console.error('Login failed: password mismatch');
        return res.status(401).json({ error: 'Invalid credentials' });
    } 
    
    console.log('Using JWT_SECRET:', !!process.env.JWT_SECRET);
    const token = jwt.sign(
        { _id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
    console.log('Login successful, token issued');
    res.status(200).json({ token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
