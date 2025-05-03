const Message = require('../models/message.model');
const Conversation = require('../models/conversation.model');
const { createAuditLog } = require('../services/audit.service');
const { encryptMessage, decryptMessage } = require('../services/encryption.service');

// Get messages for a conversation
exports.getMessages = async (conversationId) => {
  try {
    const messages = await Message.find({ conversationId })
      .sort({ timestamp: 1 })
      .populate('sender', 'fullName email')
      .populate('attachment.id', 'originalName size mimeType');

    return messages;
  } catch (error) {
    console.error('Error getting messages:', error);
    throw error;
  }
};

// Get a single message
exports.getMessage = async (messageId) => {
  try {
    const message = await Message.findById(messageId)
      .populate('sender', 'fullName email')
      .populate('attachment.id', 'originalName size mimeType');

    return message;
  } catch (error) {
    console.error('Error getting message:', error);
    throw error;
  }
};

// Create a new message
exports.createMessage = async (messageData) => {
  try {
    const message = new Message(messageData);
    await message.save();
    return message;
  } catch (error) {
    console.error('Error creating message:', error);
    throw error;
  }
};

// Update message read status
exports.markAsRead = async (messageId, userId) => {
  try {
    const message = await Message.findById(messageId);
    
    if (!message) {
      throw new Error('Message not found');
    }

    const alreadyRead = message.readBy.some(
      read => read.userId.toString() === userId.toString()
    );

    if (!alreadyRead) {
      message.readBy.push({
        userId,
        readAt: new Date()
      });
      await message.save();
    }

    return message;
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
};

// Delete message
exports.deleteMessage = async (messageId, userId) => {
  try {
    const message = await Message.findById(messageId);
    
    if (!message) {
      throw new Error('Message not found');
    }
    
    // Check if sender or in incognito mode
    if (message.sender.toString() !== userId.toString()) {
      // Check if conversation is incognito
      const conversation = await Conversation.findById(message.conversationId);
      
      if (!conversation || !conversation.isIncognito) {
        throw new Error('Not authorized to delete this message');
      }
    }
    
    await Message.findByIdAndDelete(messageId);
    
    // Log deletion
    await createAuditLog(
      { ip: '127.0.0.1' }, 
      userId, 
      'message_delete', 
      messageId, 
      'message'
    );
    
    return { message: 'Message deleted successfully' };
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};
