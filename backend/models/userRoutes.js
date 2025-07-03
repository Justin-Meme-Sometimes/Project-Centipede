const express =  require('express');
const router =  express.Router();
const User =  require('../models/User');

router.post('/', async (req, res) => {
    const { username, email, password } = req.body;

    try{
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User created!', user: newUser });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Failed to create user' });
    }
});

module.exports = router;