const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversation.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
// Get all conversations for user
router.get('/', conversationController.getConversations);

// Create new conversation
router.post('/', conversationController.createConversation);

// Get conversation by ID
router.get('/:id', conversationController.getConversation);

// Get messages for conversation
router.get('/:id/messages', conversationController.getConversationMessages);

// Toggle incognito mode
router.patch('/:id/incognito', conversationController.toggleIncognitoMode);

module.exports = router;