const express =  require('express');
const router =  express.Router();
const User =  require('../models/User');
const Group = require('../models/Group');
const bcrypt = require ('bcrypt');

router.post('/', async (req, res) => {
    try{
        const { name, location, county, maxGroupSize } = req.body;
        const userId = req.user._id;

        const newGroup = new Group({ 
            name, 
            location, 
            county,
            maxGroupSize,
            groupSize: 1,
            members:[{
                user: userId,
                role: 'owner'
            }],
        });
        
        const savedGroup = await newGroup.save();

        await User.findByIdAndUpdate(userId, {
            $push: {
                groups: {
                    group: savedGroup._id,
                    role: 'owner'
                }
            }
        });

        res.status(201).json({ message: 'Group created!', group: savedGroup });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create group' });
    }
});