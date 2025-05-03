const Conversation = require('../models/conversation.model');
const Message = require('../models/message.model');
const User = require('../models/user.model');
const { createAuditLog } = require('../services/audit.service');
// Get conversations
exports.getConversations = async (req, res, next) => {
  try {
    // Find all conversations where user is a participant
    const conversations = await Conversation.find({
      participants: req.user._id
    })
      .populate('participants', 'fullName email role')
      .sort({ updatedAt: -1 })
      .lean();
    
    res.json({ conversations });
  } catch (error) {
    next(error);
  }
};

// Create conversation
exports.createConversation = async (req, res, next) => {
  try {
    const { participants, title } = req.body;
    
    // Ensure user is included in participants
    let participantIds = [...participants];
    
    if (!participantIds.includes(req.user._id.toString())) {
      participantIds.push(req.user._id);
    }
    
    // Remove duplicates
    participantIds = [...new Set(participantIds)];
    
    // Validate participants
    const users = await User.find({
      _id: { $in: participantIds }
    });
    
    if (users.length !== participantIds.length) {
      return res.status(400).json({ message: 'Invalid participant IDs' });
    }
    
    // Create conversation
    const conversation = new Conversation({
      participants: participantIds,
      title,
      isIncognito:false,
      incognitoSettings: {
        messageLifetime: req.body.messageLifetime || 10
      }
    });
    
    await conversation.save();
    
    // Log conversation creation
    await createAuditLog(
      req, 
      req.user._id, 
      'conversation_create', 
      conversation._id, 
      'conversation'
    );
    
    // Populate participants
    await conversation.populate('participants', 'fullName email role');
    
    res.status(201).json({ conversation });
  } catch (error) {
    next(error);
  }
};

// Get conversation
exports.getConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate('participants', 'fullName email role')
      .lean();
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    // Ensure user is a participant
    if (!conversation.participants.some(
      p => p._id.toString() === req.user._id.toString()
    )) {
      return res.status(403).json({ message: 'Not authorized to view this conversation' });
    }
    
    res.json({ conversation });
  } catch (error) {
    next(error);
  }
};

// Get conversation messages
exports.getConversationMessages = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    // Ensure user is a participant
    if (!conversation.participants.some(
      p => p.toString() === req.user._id.toString()
    )) {
      return res.status(403).json({ message: 'Not authorized to view this conversation' });
    }
    
    // Get pagination parameters
    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    
    // Get messages
    const messages = await Message.find({
      conversationId: req.params.id
    })
      .populate('sender', 'fullName email role')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get total count
    const total = await Message.countDocuments({
      conversationId: req.params.id
    });
    
    res.json({
      messages: messages.reverse(), // Return in chronological order
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Toggle incognito mode
exports.toggleIncognitoMode = async (req, res, next) => {
  try {
    const { isIncognito, messageLifetime } = req.body;
    
    const conversation = await Conversation.findById(req.params.id);
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    // Ensure user is a participant
    if (!conversation.participants.some(
      p => p.toString() === req.user._id.toString()
    )) {
      return res.status(403).json({ message: 'Not authorized to modify this conversation' });
    }
    
    // Update incognito settings
    conversation.isIncognito = isIncognito;
    
    if (isIncognito && messageLifetime) {
      conversation.incognitoSettings = {
        messageLifetime
      };
    }
    
    await conversation.save();
    
    // Log toggle
    await createAuditLog(
      req, 
      req.user._id, 
      isIncognito ? 'conversation_incognito_on' : 'conversation_incognito_off', 
      conversation._id, 
      'conversation'
    );
    
    res.json({
      message: `Incognito mode ${isIncognito ? 'enabled' : 'disabled'}`,
      conversation
    });
  } catch (error) {
    next(error);
  }
};
