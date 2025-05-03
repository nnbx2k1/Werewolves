const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const authValidation = {
  register: [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 })
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
      .withMessage('Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character'),
    body('fullName').trim().notEmpty(),
    validate
  ],
  login: [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
    validate
  ]
};

const messageValidation = {
  create: [
    body('conversationId').isMongoId(),
    body('content').trim().notEmpty(),
    body('attachments').optional().isArray(),
    validate
  ]
};

const notificationValidation = {
  markAsRead: [
    body('notificationId').isMongoId(),
    validate
  ]
};

module.exports = {
  authValidation,
  messageValidation,
  notificationValidation
}; 