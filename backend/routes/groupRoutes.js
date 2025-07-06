const express =  require('express');
const router =  express.Router();
const User =  require('../models/User');
const Group = require('../models/Group');
const bcrypt = require ('bcrypt');
const auth = require('../middleware/auth')

router.post('/', auth, async (req, res) => {
      console.log(req.method, req.url, req.headers['authorization']);
    try{
        const { name, location, county, maxGroupSize, acceptingNewMembers, members } = req.body;
        const userId = req.user._id;

        const newGroup = new Group({ 
            name, 
            location, 
            county,
            maxGroupSize,
            groupSize: 1,
            acceptingNewMembers,
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

router.get('/:id', auth, async (req, res) =>{
    try{
        const currentUserId = req.user._id;

        const group = await Group.findById(req.params.id).populate('members.user').lean();
        group.members.forEach(member => {
            const isCurrentUser = member.user._id.toString() === currentUserId._id;
            const sameGroup = group.members.some(m => m.user._id.toString() === currentUserId._id);

            if (!sameGroup && !isCurrentUser){
                delete member.user.address;
            }
        });

        res.json(group);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get group' });
    }
});

module.exports = router;