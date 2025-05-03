const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const messageController = require('../controllers/message.controller');
const { decryptMessage } = require('../services/encryption.service');

// Get messages for a conversation
router.get('/:conversationId', authMiddleware, async (req, res) => {
  try {
    const messages = await messageController.getMessages(req.params.conversationId);
    
    // Decrypt messages
    const decryptedMessages = await Promise.all(messages.map(async (message) => {
      try {
        const decryptedContent = message.content ? await decryptMessage(message.content) : null;
        return {
          ...message.toObject(),
          content: decryptedContent
        };
      } catch (error) {
        console.error('Error decrypting message:', error);
        return {
          ...message.toObject(),
          content: '[Encrypted message]'
        };
      }
    }));
    
    res.json({ messages: decryptedMessages });
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// Get a single message
router.get('/message/:id', authMiddleware, async (req, res) => {
  try {
    const message = await messageController.getMessage(req.params.id);
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    // Decrypt message content
    try {
      const decryptedContent = message.content ? await decryptMessage(message.content) : null;
      res.json({
        ...message.toObject(),
        content: decryptedContent
      });
    } catch (error) {
      console.error('Error decrypting message:', error);
      res.json({
        ...message.toObject(),
        content: '[Encrypted message]'
      });
    }
  } catch (error) {
    console.error('Error getting message:', error);
    res.status(500).json({ error: 'Failed to get message' });
  }
});

// Delete a message
router.delete('/:messageId', authMiddleware, async (req, res) => {
  try {
    const result = await messageController.deleteMessage(req.params.messageId, req.user.id);
    res.json(result);
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

module.exports = router; 