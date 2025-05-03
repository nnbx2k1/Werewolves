const AuditLog = require('../models/auditLog.model');
const crypto = require('crypto');
const mongoose = require('mongoose');

// Custom Unauthorized Exception Class
class UnauthorizedException extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedException';
    this.statusCode = 401;
    this.stack = (new Error()).stack;
  }
}

// Custom Validation Exception Class
class ValidationException extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationException';
    this.statusCode = 400;
    this.stack = (new Error()).stack;
  }
}

// Get device type from user agent
const getDeviceType = (userAgent) => {
  if (!userAgent) return 'unknown';
  
  const ua = userAgent.toLowerCase();
  if (ua.includes('mobile')) return 'mobile';
  if (ua.includes('tablet')) return 'tablet';
  if (ua.includes('desktop')) return 'desktop';
  return 'other';
};

// Get browser info from user agent
const getBrowserInfo = (userAgent) => {
  if (!userAgent) return { name: 'unknown', version: 'unknown' };
  
  const ua = userAgent.toLowerCase();
  let browser = { name: 'unknown', version: 'unknown' };
  
  if (ua.includes('chrome')) {
    browser.name = 'chrome';
    browser.version = ua.match(/chrome\/(\d+\.\d+)/)?.[1] || 'unknown';
  } else if (ua.includes('firefox')) {
    browser.name = 'firefox';
    browser.version = ua.match(/firefox\/(\d+\.\d+)/)?.[1] || 'unknown';
  } else if (ua.includes('safari')) {
    browser.name = 'safari';
    browser.version = ua.match(/version\/(\d+\.\d+)/)?.[1] || 'unknown';
  } else if (ua.includes('edge')) {
    browser.name = 'edge';
    browser.version = ua.match(/edge\/(\d+\.\d+)/)?.[1] || 'unknown';
  }
  
  return browser;
};

// Generate standard metadata
const generateStandardMetadata = (req) => {
  const userAgent = req.headers?.['user-agent'] || 'unknown';
  const browser = getBrowserInfo(userAgent);
  
  return {
    timestamp: new Date(),
    ipAddress: req.ip || req.socket?.remoteAddress || 'unknown',
    userAgent,
    deviceInfo: {
      type: getDeviceType(userAgent),
      browser: browser.name,
      browserVersion: browser.version,
      os: req.headers?.['sec-ch-ua-platform'] || 'unknown'
    }
  };
};

exports.createAuditLog = async (req, userId, action, resourceId, resourceType, additionalMetadata = {}) => {
  try {
    // Validate action
    if (!AuditLog.schema.path('action').enumValues.includes(action)) {
      throw new ValidationException(`Invalid action: ${action}`);
    }

    // Validate resourceType
    if (!AuditLog.schema.path('resourceType').enumValues.includes(resourceType)) {
      throw new ValidationException(`Invalid resourceType: ${resourceType}`);
    }

    // Validate userId and resourceId are valid ObjectIds
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new ValidationException(`Invalid userId: ${userId}`);
    }
    if (resourceId && !mongoose.Types.ObjectId.isValid(resourceId)) {
      throw new ValidationException(`Invalid resourceId: ${resourceId}`);
    }

    // Generate standard metadata
    const standardMetadata = generateStandardMetadata(req);
    
    // Combine standard and additional metadata
    const metadata = {
      ...standardMetadata,
      ...additionalMetadata
    };

    // Create hash if in production
    let hash = '';
    const isProdEnv = process.env.NODE_ENV === 'production';
    
    if (isProdEnv) {
      // Get the last audit log entry for this user
      const lastLog = await AuditLog.findOne({ userId })
        .sort({ timestamp: -1 })
        .select('hash');
      
      const previousHash = lastLog?.hash || '';
      
      // Create hash of current log data
      hash = crypto
        .createHash('sha256')
        .update(JSON.stringify({
          userId,
          action,
          resourceId,
          resourceType,
          metadata,
          timestamp: metadata.timestamp
        }) + previousHash)
        .digest('hex');
    }

    // Create and save audit log
    const auditLog = new AuditLog({
      userId,
      action,
      resourceId,
      resourceType,
      metadata,
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
      deviceInfo: metadata.deviceInfo,
      timestamp: metadata.timestamp,
      hash,
      previousEntryHash: isProdEnv ? previousHash : undefined
    });

    await auditLog.save();

    // Log to console in development
    if (!isProdEnv) {
      console.log(`[AUDIT] ${new Date().toISOString()} - User: ${userId} - Action: ${action} - Resource: ${resourceId} (${resourceType})`);
    }

    return auditLog;
  } catch (error) {
    console.error('Error creating audit log:', error);
    
    if (error instanceof ValidationException || error instanceof UnauthorizedException) {
      throw error;
    }
    
    throw new Error(`Audit log creation failed: ${error.message}`);
  }
};
