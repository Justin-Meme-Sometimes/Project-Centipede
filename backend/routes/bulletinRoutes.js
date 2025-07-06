const express = require('express');
const auth = require('../middleware/auth');
const Bulletin = require('../models/Bulletin');
const Group = require('../models/Group');

const router = express.Router();

async function fetchBulletinPosts(filter = {}) {
    return await Bulletin.find(filter)
    .sort({ createdAt: -1 })
    .populate('authorId', 'username name'); 
}

router.get('/', async (req, res) => {
    try {
        const filter = {};
        if (req.query.lookingFor) filter.lookingFor = req.query.lookingFor;
        if (req.query.county) filter.county = req.query.county;
        const posts = await fetchBulletinPosts(filter);
        res.json(posts);
    } catch (err) {
        console.error('Fetch bulletins error:', err);
        res.status(500).json({ error: err.message });
    }
});

router.post('/', auth, async (req, res) => {
    const { authorModel, groupId, lookingFor, text, county } = req.body;
    const allowed = ['User', 'Group'];
    if (!allowed.includes(authorModel)) {
        return res.status(400).json({ error: 'Invalid authorModel' });
    }

    let authorId;

    if (authorModel === 'User') {
        authorId = req.user._id;
    }

    if (authorModel === 'Group') {
        if (!groupId) {
            return res.status(400).json({ error: 'groupId is required for group posts' });
        }
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        const ownerMember = group.members.find(m =>
            m.user.toString() === req.user._id.toString() && m.role === 'owner'
        );
        if (!ownerMember) {
            return res.status(403).json({ error: 'Only group owner can post for this group' });
        }
        authorId = group._id;
    } try {
        const post = await Bulletin.create({
            authorId,
            authorModel,
            text,
            county,
            lookingFor: authorModel === 'Group' ? 'group' : 'individual'
        });
        res.status(201).json(post);
    } catch (err) {
        console.error('Create bulletin error:', err);
        res.status(500).json({ error: 'An error occurred while creating the post' });
    }
});

module.exports = router;
