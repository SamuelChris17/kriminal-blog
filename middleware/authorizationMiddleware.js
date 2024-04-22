const authorizeUser = (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    next();
  };
  
  module.exports = { authorizeUser };
  