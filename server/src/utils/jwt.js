const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const signToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

const verifyToken = (token) => jwt.verify(token, JWT_SECRET);

module.exports = { signToken, verifyToken };
