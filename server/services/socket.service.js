const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user.model');
const Conversation = require('../models/conversation.model');
const Message = require('../models/message.model');
const Notification = require('../models/notification.model');
const { encryptMessage, decryptMessage } = require('./encryption.service');
const { createAuditLog } = require('./audit.service');

exports.setupSocketHandlers = (io) => {
  io.use(async (socket, next) => {
    try {
      console.log('Socket connection attempt:', socket.handshake.auth);
      const token = socket.handshake.auth.token;
      
      if (!token) {
        console.error('No token provided');
        return next(new Error('Authentication required'));
      }
      
      try {
        const decoded = jwt.verify(token, config.jwtSecret);
        console.log('Token decoded successfully:', decoded);
        
        const user = await User.findById(decoded.id);
        if (!user) {
          console.error('User not found:', decoded.id);
          return next(new Error('User not found'));
        }
        
        // Attach user to socket
        socket.user = {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          role: user.role
        };
        
        console.log('Socket authenticated for user:', socket.user.email);
        next();
      } catch (jwtError) {
        console.error('JWT verification error:', jwtError);
        if (jwtError.name === 'TokenExpiredError') {
          return next(new Error('Token expired'));
        } else if (jwtError.name === 'JsonWebTokenError') {
          return next(new Error('Invalid token'));
        }
        return next(new Error('Authentication failed'));
      }
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication failed'));
    }
  });
  
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.id} (${socket.user.email})`);
    
    // Join user to their own room for private messages and notifications
    socket.join(socket.user.id.toString());
    
    // Update user's online status
    updateUserStatus(socket.user.id, true);
    
    // Join user to conversation rooms
    joinUserConversations(socket);

    // Handle notification read status
    socket.on('mark_notification_read', async (notificationId) => {
      try {
        const notification = await Notification.findByIdAndUpdate(
          notificationId,
          { isRead: true },
          { new: true }
        );

        if (!notification) {
          return socket.emit('error', { message: 'Notification not found' });
        }

        socket.emit('notification_updated', notification);
      } catch (error) {
        console.error('Error marking notification as read:', error);
        socket.emit('error', { message: 'Failed to mark notification as read' });
      }
    });
    
    // Handle new message
    socket.on('message', async (data, callback) => {
      try {
        console.log('Received message event:', data);
        const { conversationId, content, attachment } = data;
        
        if (!conversationId || (!content && !attachment)) {
          console.error('Invalid message data:', data);
          return callback({ error: 'Invalid message data' });
        }

        // Verify conversation exists and user is a participant
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          console.error('Conversation not found:', conversationId);
          return callback({ error: 'Conversation not found' });
        }

        if (!conversation.participants.includes(socket.user.id)) {
          console.error('User not in conversation:', socket.user.id);
          return callback({ error: 'Not authorized to send messages in this conversation' });
        }
        
        // Encrypt message content if it exists
        const encryptedContent = content ? await encryptMessage(content) : null;
        
        // Create message
        const message = new Message({
          conversationId,
          sender: socket.user.id,
          content: encryptedContent,
          attachment: attachment || null,
          persistence: await getMessagePersistence(conversationId)
        });
        
        console.log('Saving message:', message);
        await message.save();
        
        // Update conversation
        await updateConversation(conversationId, message);
        
        // Emit message to conversation room (including sender)
        const messageData = {
          ...message.toObject(),
          content: content, // Send original content
          sender: socket.user
        };
        
        console.log('Emitting message to room:', conversationId);
        io.to(conversationId).emit('message', messageData);
        
        // Send notification to offline participants
        conversation.participants.forEach(participantId => {
          if (participantId.toString() !== socket.user.id.toString()) {
            socket.to(participantId.toString()).emit('notification', {
              type: 'new_message',
              conversationId,
              message: {
                id: message._id,
                summary: 'New message',
                sender: socket.user.fullName
              }
            });
          }
        });
        
        // Log message creation
        await createAuditLog(
          { ip: socket.handshake.address }, 
          socket.user.id, 
          'message_send', 
          message._id, 
          'message'
        );
        
        console.log('Message sent successfully:', message._id);
        callback({ id: message._id });
      } catch (error) {
        console.error('Message error:', error);
        callback({ error: 'Failed to send message' });
      }
    });
    
    // Handle read receipt
    socket.on('read_message', async (data) => {
      try {
        const { messageId } = data;
        
        const message = await Message.findById(messageId);
        
        if (!message) {
          return socket.emit('error', { message: 'Message not found' });
        }
        
        // Add user to readBy if not already there
        const alreadyRead = message.readBy.some(
          read => read.userId.toString() === socket.user.id.toString()
        );
        
        if (!alreadyRead) {
          message.readBy.push({
            userId: socket.user.id,
            readAt: new Date()
          });
          
          await message.save();
          
          // Emit read receipt to conversation
          socket.to(message.conversationId.toString()).emit('message_read', {
            messageId,
            userId: socket.user.id
          });
          
          // Check if message should be deleted after reading
          if (message.persistence.deleteAfterRead) {
            setTimeout(async () => {
              await Message.findByIdAndDelete(messageId);
              io.to(message.conversationId.toString()).emit('message_deleted', {
                messageId
              });
            }, message.persistence.ttl * 1000 || 0);
          }
        }
      } catch (error) {
        console.error('Read receipt error:', error);
        socket.emit('error', { message: 'Failed to mark message as read' });
      }
    });
    
    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.id}`);
      updateUserStatus(socket.user.id, false);
    });
  });
  
  // Helper functions
  const updateUserStatus = async (userId, isOnline) => {
    try {
      await User.findByIdAndUpdate(userId, {
        lastActive: new Date()
      });
      
      io.emit('user_status', {
        userId,
        isOnline
      });
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };
  
  const joinUserConversations = async (socket) => {
    try {
      const conversations = await Conversation.find({
        participants: socket.user.id
      });
      
      conversations.forEach(conversation => {
        socket.join(conversation._id.toString());
        console.log(`User ${socket.user.id} joined conversation ${conversation._id}`);
      });
    } catch (error) {
      console.error('Error joining conversations:', error);
    }
  };
  
  const updateConversation = async (conversationId, message) => {
    try {
      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: {
          content: message.content, // Store encrypted content
          sender: message.sender,
          timestamp: message.timestamp
        },
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating conversation:', error);
    }
  };
  
  const getMessagePersistence = async (conversationId) => {
    try {
      const conversation = await Conversation.findById(conversationId);
      
      if (conversation.isIncognito) {
        return {
          mode: 'incognito',
          ttl: conversation.incognitoSettings.messageLifetime,
          deleteAfterRead: true
        };
      }
      
      return {
        mode: 'normal',
        deleteAfterRead: false
      };
    } catch (error) {
      console.error('Error getting message persistence:', error);
      return {
        mode: 'normal',
        deleteAfterRead: false
      };
    }
  };
};