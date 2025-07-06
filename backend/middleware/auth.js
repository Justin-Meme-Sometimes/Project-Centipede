// this will run before the route logic and check if a user is logged in

const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.res.status(401).json({ error: 'No token' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = auth;