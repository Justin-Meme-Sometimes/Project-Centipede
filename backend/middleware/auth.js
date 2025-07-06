// this will run before the route logic and check if a user is logged in

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) throw newError('No token provided');

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');

        next();
    } catch (err) {
        res.status(401).json({ error: 'Not authorized' });
    }
};

module.exports = protect;