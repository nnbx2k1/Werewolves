const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed, // Changed from String to Mixed to handle encrypted object
    required: true
  },
  attachment: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File'
    },
    originalName: String,
    size: Number,
    mimeType: String
  },
  readBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  persistence: {
    mode: {
      type: String,
      enum: ['normal', 'incognito'],
      default: 'normal'
    },
    ttl: Number, // Time to live in seconds
    deleteAfterRead: {
      type: Boolean,
      default: false
    }
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  backpackId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Backpack'
  },
  summary: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', messageSchema);