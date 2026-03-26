const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response.util');

const protect = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(errorResponse('No token provided. Access denied.'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json(errorResponse('Token has expired. Please log in again.'));
    }
    return res.status(401).json(errorResponse('Invalid token. Access denied.'));
  }
};

module.exports = { protect };
