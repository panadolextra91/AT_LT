const jwt = require('jsonwebtoken');
const User = require('../models/User'); // User model

// Middleware to validate JWT token (Protect Routes)
const protect = async (req, res, next) => {
  try {
    // Check for token in headers
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = await User.findById(decoded.id).select('-password'); // Attach user to request
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    console.error('Token validation failed:', error.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to authorize roles (Admin-only routes)
const authorize = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
  };
};

module.exports = { protect, authorize };
