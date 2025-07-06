const express =  require('express');
const router =  express.Router();
const User =  require('../models/User');
const Group = require('../models/Group');
const bcrypt = require ('bcrypt');
const protect = require('../middleware/auth')

router.get('/:id', auth, async (req, res) =>{
    try{
        const requestedUser = await User.findById(req.params.id).lean();
        const currentUserId = req.user._id;

        const isInSameGroup = await Group.findOne({
            'members.user': { $all: [requestedUser._id, currentUserId] }
        });

        if (!isInSameGroup) {
            delete requestedUser.address;
        }

        res.json(requestedUser);
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});

router.post('/', async (req, res) => {
    const { username, email, password } = req.body;

    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ 
            username, 
            email, 
            password: hashedPassword,
        });
        
        await newUser.save();
        res.status(201).json({ message: 'User created!', user: newUser });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Failed to create user' });
    }
});

module.exports = router;