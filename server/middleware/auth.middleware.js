const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user.model');
const { createAuditLog } = require('../services/audit.service');

exports.authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Authentication required. Please provide a valid Bearer token.' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Find user
    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) {
      return res.status(401).json({ 
        message: 'User not found' 
      });
    }

    // Add user to request
    req.user = user;
    
    // Log access
    console.log(req.originalUrl);
    await createAuditLog(req, user._id, 'login', user._id, 'user');
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired. Please login again.' 
      });
    }
    
    console.error('Auth error:', error);
    return res.status(401).json({ 
      message: 'Invalid token. Please login again.' 
    });
  }
};

exports.bankerAuthMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Authentication required. Please provide a valid Bearer token.' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Find user
    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) {
      return res.status(401).json({ 
        message: 'User not found' 
      });
    }

    // Check if user is a banker
    if (user.role !== 'banker') {
      return res.status(403).json({ 
        message: 'Banker access required' 
      });
    }

    // Add user to request
    req.user = user;
    
    // Log banker access
    await createAuditLog(
      req, 
      user._id, 
      'banker_api_access', 
      null, 
      req.originalUrl
    );
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired. Please login again.' 
      });
    }
    
    console.error('Banker auth error:', error);
    return res.status(401).json({ 
      message: 'Invalid token. Please login again.' 
    });
  }
};