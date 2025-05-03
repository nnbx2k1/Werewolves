const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// Get user notifications
router.get('/', authMiddleware, notificationController.getUserNotifications);

// Mark notification as read
router.patch('/:notificationId/read', authMiddleware, notificationController.markAsRead);

module.exports = router; 