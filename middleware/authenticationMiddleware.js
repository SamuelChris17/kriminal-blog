const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../config/logger');
const JWT_SECRET_KEY = 'brain@95'; 

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; 
    next();
  } catch (error) {
    logger.error(`Error authenticating user: ${error.message}`);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { authenticateUser };
