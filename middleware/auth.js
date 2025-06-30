// middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { userId, tenantId }
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};
