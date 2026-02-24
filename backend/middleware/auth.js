const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
exports.protect = async (req, res, next)=> {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      if (!req.user.isActive) {
        return res.status(401).json({ message: 'User account is inactive' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token invalid' });
    }
  }
   catch (error) {
    res.status(500).json({ message: 'Server error in authentication' });
  }
};

// Check if user is admin
exports.admin = (req, res, next)=> {
  if (req.user && req.user.role === 'Admin') {
    next();
  }
   else {
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};

// Generate JWT token
exports.generateToken = (id)=> {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};
