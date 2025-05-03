const Backpack = require('../models/backpack.model');
const Message = require('../models/message.model');
const Document = require('../models/document.model');
const { createAuditLog } = require('../services/audit.service');

// Get backpack
exports.getBackpack = async (req, res, next) => {
  try {
    // Find or create user's backpack
    let backpack = await Backpack.findOne({ userId: req.user._id });
    
    if (!backpack) {
      backpack = new Backpack({
        userId: req.user._id,
        items: []
      });
      
      await backpack.save();
    }
    
    // Populate items
    const populatedItems = await Promise.all(backpack.items.map(async (item) => {
      if (item.type === 'message' && item.resourceId) {
        try {
          const message = await Message.findById(item.resourceId)
            .populate('sender', 'fullName')
            .lean();
          
          if (message) {
            return {
              ...item.toObject(),
              message
            };
          }
        } catch (error) {
          console.error('Error populating message:', error);
        }
      } else if (item.type === 'document' && item.resourceId) {
        try {
          const document = await Document.findById(item.resourceId).lean();
          
          if (document) {
            // Remove encrypted content
            const { encryptedContent, ...sanitized } = document;
            
            return {
              ...item.toObject(),
              document: sanitized
            };
          }
        } catch (error) {
          console.error('Error populating document:', error);
        }
      }
      
      return item.toObject();
    }));
    
    res.json({ 
      backpack: {
        _id: backpack._id,
        userId: backpack.userId,
        items: populatedItems,
        createdAt: backpack.createdAt,
        updatedAt: backpack.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// Add item to backpack
exports.addItem = async (req, res, next) => {
  try {
    const { type, resourceId, content, name } = req.body;
    
    if (type !== 'message' && type !== 'document' && type !== 'text') {
      return res.status(400).json({ message: 'Invalid item type' });
    }
    
    // If type is message or document, verify resourceId
    if ((type === 'message' || type === 'document') && !resourceId) {
      return res.status(400).json({ message: 'Resource ID required' });
    }
    
    // If type is text, verify content
    if (type === 'text' && !content) {
      return res.status(400).json({ message: 'Content required for text items' });
    }
    
    // Find or create backpack
    let backpack = await Backpack.findOne({ userId: req.user._id });
    
    if (!backpack) {
      backpack = new Backpack({
        userId: req.user._id,
        items: []
      });
    }
    
    // Check for duplicate
    const existingItem = backpack.items.find(item => {
      if (type === 'text') {
        return item.type === 'text' && item.content === content;
      }
      
      return item.type === type && item.resourceId.toString() === resourceId;
    });
    
    if (existingItem) {
      return res.status(400).json({ message: 'Item already in backpack' });
    }
    
    // Add item
    const newItem = {
      type,
      name: name || `Backpack item ${backpack.items.length + 1}`,
      addedAt: new Date()
    };
    
    if (type === 'message' || type === 'document') {
      newItem.resourceId = resourceId;
    } else {
      newItem.content = content;
    }
    
    backpack.items.push(newItem);
    backpack.updatedAt = new Date();
    
    await backpack.save();
    
    // If message, update isPinned
    if (type === 'message') {
      await Message.findByIdAndUpdate(resourceId, {
        isPinned: true,
        backpackId: backpack._id
      });
    }
    
    // Log addition
    await createAuditLog(
      req, 
      req.user._id, 
      'document_upload', 
      type === 'text' ? backpack._id : resourceId, 
      type
    );
    
    res.status(201).json({ message: 'Item added to backpack', item: newItem });
  } catch (error) {
    next(error);
  }
};

// Remove item from backpack
exports.removeItem = async (req, res, next) => {
  try {
    // Find backpack
    const backpack = await Backpack.findOne({ userId: req.user._id });
    
    if (!backpack) {
      return res.status(404).json({ message: 'Backpack not found' });
    }
    
    // Find item
    const itemIndex = backpack.items.findIndex(
      item => item._id.toString() === req.params.id
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Remove item
    const removedItem = backpack.items[itemIndex];
    backpack.items.splice(itemIndex, 1);
    backpack.updatedAt = new Date();
    
    await backpack.save();
    
    // If message, update isPinned
    if (removedItem.type === 'message' && removedItem.resourceId) {
      await Message.findByIdAndUpdate(removedItem.resourceId, {
        isPinned: false,
        backpackId: null
      });
    }
    
    // Log removal
    await createAuditLog(
      req, 
      req.user._id, 
      'document_delete', 
      removedItem.type === 'text' ? backpack._id : removedItem.resourceId, 
      removedItem.type
    );
    
    res.json({ message: 'Item removed from backpack' });
  } catch (error) {
    next(error);
  }
};